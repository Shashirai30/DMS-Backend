package com.rkt.dms.controller;

import com.rkt.dms.dto.DepartmentDto;
import com.rkt.dms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dms/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class DepartmentController {

    private final DepartmentService departmentService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(
            @RequestBody DepartmentDto dto) {

        return ResponseEntity.ok(
                departmentService.createDepartment(dto)
        );
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }
}

