package com.rkt.dms.controller;

import com.rkt.dms.dto.MenuItemDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/menu-items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    /**
     * Create a new menu item.
     * @param menuItemDto The menu item details.
     * @return The created menu item.
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/create-menu")
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItemDto menuItemDto) {
        var createdItem = menuItemService.createMenuItem(menuItemDto);
        return ResponseHandler.generateResponse("Menu created successfully", HttpStatus.CREATED, createdItem);
    }

    /**
     * Get all menu items.
     * @return List of menu items.
     */

    /**
     * Get a specific menu item by ID.
     * @param id The menu item ID.
     * @return The requested menu item.
     */
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/get")
    public ResponseEntity<?> getMenuItemById(@RequestParam(defaultValue = "0",required = false) Long id) {
        var menuItem = menuItemService.get(id);
        return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, menuItem);
    }

    /**
     * Update an existing menu item.
     * @param id The menu item ID.
     * @param menuItemDto The updated menu item details.
     * @return The updated menu item.
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<?> updateMenuItem(@RequestParam(defaultValue = "0",required = false) Long id, @RequestBody MenuItemDto menuItemDto) {
        var updatedMenuItem = menuItemService.updateMenuItem(id, menuItemDto);
        return ResponseHandler.generateResponse("Menu upadetd", HttpStatus.OK, updatedMenuItem);
    }

    
    /**
     * Delete a menu item by ID.
     * @param id The menu item ID.
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMenuItem(@RequestParam(defaultValue = "0",required = false) Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseHandler.generateResponse("Menu deleted", HttpStatus.NO_CONTENT, null);
    }
}
