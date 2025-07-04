package com.rkt.dms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserPasswordDto;
import com.rkt.dms.jwt.utilis.JwtUtil;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    JwtUtil jwtUtil;

    // @PreAuthorize("hasRole('ADMIN')")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(
            @RequestParam(defaultValue = "0") Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false,defaultValue = "id") String sortBy,
            @RequestParam(required = false,defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        log.info("/get-user");
        if (id > 0) {
            // Fetch a single user by ID
            var result = service.getUserById(id);
            return ResponseHandler.generateResponse("User get by Id", HttpStatus.OK, result);
        } else {
            // Fetch users with pagination
            var result = service.getAllUsers(page, size, sortBy, sortDir, search);
            return ResponseHandler.generateResponse("Get all user", HttpStatus.OK, result);
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/update")
    ResponseEntity<?> updateUser(@Valid @RequestBody UserDto params, @RequestParam(defaultValue = "0") Long id) {
        log.info("/update");
        var updatedUser = service.updateUser(id, params);
        return ResponseHandler.generateResponse("Update user", HttpStatus.OK, updatedUser);
    }

     @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            service.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user: " + e.getMessage());
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserPasswordDto params) {
        try {
            UserDto updatedUser = service.resetPassword(params);
            return ResponseHandler.generateResponse("Reset password successfully", HttpStatus.OK, updatedUser);
        } catch (RuntimeException e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.BAD_REQUEST, null);
        }
    }

}
