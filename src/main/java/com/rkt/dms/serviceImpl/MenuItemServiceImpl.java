package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.MenuItemDto;
import com.rkt.dms.entity.MenuItemEntity;
import com.rkt.dms.mapper.MenuItemMapper;
import com.rkt.dms.repository.MenuItemRepository;
import com.rkt.dms.service.MenuItemService;
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
    public MenuItemDto updateMenuItem(Long id, MenuItemDto menuItemDto) {
        // Fetch the existing menu item
        MenuItemEntity existingEntity = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        // Delete existing submenus before updating
        if (!existingEntity.getSubMenu().isEmpty()) {
            menuItemRepository.deleteAll(existingEntity.getSubMenu());
            existingEntity.getSubMenu().clear();
        }

        // Convert DTO to Entity for updating
        MenuItemEntity updatedEntity = menuItemMapper.toEntity(menuItemDto);
        updatedEntity.setId(existingEntity.getId()); // Preserve ID

        // Save updated menu item
        updatedEntity = menuItemRepository.save(updatedEntity);

        return menuItemMapper.toDto(updatedEntity);
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
