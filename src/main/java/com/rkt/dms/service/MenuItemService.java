package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.MenuItemDto;

public interface MenuItemService  {
    List<MenuItemDto> get(Long id); 
    MenuItemDto createMenuItem(MenuItemDto params);
    MenuItemDto updateMenuItem(Long id, MenuItemDto params);
    void deleteMenuItem(Long id);
}