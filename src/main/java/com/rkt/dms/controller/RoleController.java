package com.rkt.dms.controller;

import com.rkt.dms.dto.RoleDto;
import com.rkt.dms.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dms/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class RoleController {

    private final RoleService roleService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RoleDto> createRole(
            @RequestBody RoleDto dto) {

        return ResponseEntity.ok(
                roleService.createRole(dto)
        );
    }

    @GetMapping("/by-department/{departmentId}")
    public ResponseEntity<List<RoleDto>> getRolesByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                roleService.getRolesByDepartment(departmentId)
        );
    }
}
