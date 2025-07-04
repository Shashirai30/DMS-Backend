package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.ProjectFilesService;

@RestController
@RequestMapping("/project-files")
public class ProjectFilesController {

    @Autowired
    private ProjectFilesService service;

    @PostMapping
    public ResponseEntity<?> createProjectFile(@RequestBody ProjectFilesDto dto) {
        try {
            var createdFile = service.createProjectFile(dto);
            return ResponseHandler.generateResponse("Folder created successfully", HttpStatus.CREATED, createdFile);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to create folder: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllProjectFiles(
            @RequestParam(required = false) List<Long> ids,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        try {
            var projectFiles = service.getProjectFiles(ids, page, size, sortBy, sortDir, search);
            return ResponseHandler.generateResponse("Folders fetched successfully", HttpStatus.OK, projectFiles);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to fetch folders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProjectFile(
            @RequestParam(defaultValue = "0", required = false) Long id,
            @RequestBody ProjectFilesDto dto) {
        try {
            var updatedFile = service.updateProjectFile(id, dto);
            return ResponseHandler.generateResponse("Folder updated successfully", HttpStatus.OK, updatedFile);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to update folder: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteProjectFile(@RequestParam(defaultValue = "0", required = false) Long id) {
        try {
            service.deleteProjectFile(id);
            return ResponseHandler.generateResponse("Folder deleted successfully", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to delete folder: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}
