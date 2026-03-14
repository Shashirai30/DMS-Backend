package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.MenuItemDto;
import com.rkt.dms.entity.MenuItemEntity;
import com.rkt.dms.mapper.MenuItemMapper;
import com.rkt.dms.repository.MenuItemRepository;
import com.rkt.dms.service.MenuItemService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuItemMapper menuItemMapper;

    /**
     * Creates a new menu item and saves it in the database.
     * 
     * @param menuItemDto Data Transfer Object containing menu item details.
     * @return The saved menu item as a DTO.
     */
    @Override
    public MenuItemDto createMenuItem(MenuItemDto menuItemDto) {
        MenuItemEntity entity = menuItemMapper.toEntity(menuItemDto);
        entity = menuItemRepository.save(entity);
        return menuItemMapper.toDto(entity);
    }

    /**
     * Retrieves all menu items from the database.
     * 
     * @return List of all menu items as DTOs.
     */

    /**
     * Retrieves a menu item by its ID.
     * 
     * @param id The unique identifier of the menu item.
     * @return The menu item as a DTO.
     * @throws RuntimeException if the menu item is not found.
     */
    @Override
    public List<MenuItemDto> get(Long id) {
        List<MenuItemEntity> entities;

        if (id != null && id > 0) {
            MenuItemEntity entity = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("MenuItem not found"));
            return List.of(menuItemMapper.toDto(entity)); // Wrap in a list
        }

        // Fetch all menu items
        entities = menuItemRepository.findAll();
        List<MenuItemDto> menuItems = entities.stream()
                .map(menuItemMapper::toDto)
                .collect(Collectors.toList());

        // Get all submenu IDs
        Set<Long> submenuIds = menuItems.stream()
                .flatMap(menu -> menu.getSubMenu().stream().map(MenuItemDto::getId))
                .collect(Collectors.toSet());

        // Filter out items that are already in submenus
        return menuItems.stream()
                .filter(menu -> !submenuIds.contains(menu.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing menu item by its ID.
     * 
     * @param id          The unique identifier of the menu item to be updated.
     * @param menuItemDto The updated menu item data.
     * @return The updated menu item as a DTO.
     * @throws RuntimeException if the menu item is not found.
     */
    @Override
    @Transactional
    public MenuItemDto updateMenuItem(Long id, MenuItemDto menuItemDto) {

        MenuItemEntity existingEntity = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        // Update fields
        existingEntity.setMenuKey(menuItemDto.getKey());
        existingEntity.setPath(menuItemDto.getPath());
        existingEntity.setTitle(menuItemDto.getTitle());
        existingEntity.setTranslateKey(menuItemDto.getTranslateKey());
        existingEntity.setIcon(menuItemDto.getIcon());
        existingEntity.setType(menuItemDto.getType());
        existingEntity.setAuthority(menuItemDto.getAuthority());

        // Clear old submenus
        existingEntity.getSubMenu().clear();

        // Add new submenus
        if (menuItemDto.getSubMenu() != null) {
            List<MenuItemEntity> subMenus = menuItemDto.getSubMenu()
                    .stream()
                    .map(menuItemMapper::toEntity)
                    .toList();

            existingEntity.getSubMenu().addAll(subMenus);
        }

        MenuItemEntity savedEntity = menuItemRepository.save(existingEntity);

        return menuItemMapper.toDto(savedEntity);
    }

    /**
     * Deletes a menu item by its ID.
     * 
     * @param id The unique identifier of the menu item to be deleted.
     */
    @Override
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
