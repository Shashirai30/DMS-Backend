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

    //@PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/create-menu")
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItemDto menuItemDto) {
        try {
            var createdItem = menuItemService.createMenuItem(menuItemDto);
            return ResponseHandler.generateResponse("Menu created successfully", HttpStatus.CREATED, createdItem);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to create menu: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get")
    public ResponseEntity<?> getMenuItemById(@RequestParam(defaultValue = "0", required = false) Long id) {
        try {
            var menuItem = menuItemService.get(id);
            return ResponseHandler.generateResponse("Menu item retrieved successfully", HttpStatus.OK, menuItem);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to retrieve menu item: " + e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<?> updateMenuItem(@RequestParam(defaultValue = "0", required = false) Long id,
                                            @RequestBody MenuItemDto menuItemDto) {
        try {
            var updatedMenuItem = menuItemService.updateMenuItem(id, menuItemDto);
            return ResponseHandler.generateResponse("Menu updated successfully", HttpStatus.OK, updatedMenuItem);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to update menu item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMenuItem(@RequestParam(defaultValue = "0", required = false) Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseHandler.generateResponse("Menu item deleted successfully", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to delete menu item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}
