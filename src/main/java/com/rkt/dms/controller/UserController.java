package com.rkt.dms.controller;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserPasswordDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService service;

    // ---------------- GET USERS ----------------

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getUser(
            @RequestParam(defaultValue = "0") Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

//        if (id > 0) {
//
//            var result = service.getUserById(id);
//
//            return ResponseHandler.generateResponse(
//                    "User fetched successfully",
//                    HttpStatus.OK,
//                    result);
//        }

        var result = service.getAllUsers(page, size, sortBy, sortDir, search);

        return ResponseHandler.generateResponse(
                "Users fetched successfully",
                HttpStatus.OK,
                result);
    }

    @GetMapping("/get-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@RequestParam(defaultValue = "0") Long id)
    {
        return ResponseHandler.generateResponse(
                "Users fetched successfully",
                HttpStatus.OK,
                service.getUserById(id));
    }


    // ---------------- UPDATE ----------------

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UserDto params,
            @RequestParam(defaultValue = "0") Long id) {

        var updatedUser = service.updateUser(id, params);

        return ResponseHandler.generateResponse(
                "User updated successfully",
                HttpStatus.OK,
                updatedUser);
    }

    // ---------------- DELETE (ADMIN ONLY) ----------------

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        service.deleteUser(id);

        return ResponseHandler.generateResponse(
                "User deleted successfully",
                HttpStatus.OK,
                null);
    }

    // ---------------- RESET PASSWORD ----------------

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody UserPasswordDto params) {

        UserDto updatedUser = service.resetPassword(params);

        return ResponseHandler.generateResponse(
                "Password reset successfully",
                HttpStatus.OK,
                updatedUser);
    }
}
