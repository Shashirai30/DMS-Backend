package com.rkt.dms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.UserDto;
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
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        log.info("/get-user");
        if (id > 0) {
            // Fetch a single user by ID
            var result = service.getUserById(id);
            return ResponseHandler.generateResponse("User get by Id", HttpStatus.OK, result);
        } else {
            // Fetch users with pagination
            var result = service.getAllUsers(page, size, sortBy, sortDir);
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

}
