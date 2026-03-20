package com.rkt.dms.controller;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.ProjectFilesService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class ProjectFilesController {

    private final ProjectFilesService service;

    // Create Folder
    @PostMapping
    public ResponseEntity<?> createProjectFile(@RequestBody ProjectFilesDto dto) {
        try {
            var createdFile = service.createFolder(dto);

            return ResponseHandler.generateResponse(
                    "Folder created successfully",
                    HttpStatus.CREATED,
                    createdFile);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to create folder: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    // Update Folder
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProjectFile(@PathVariable Long id,
            @RequestBody ProjectFilesDto dto) {
        try {

            var updatedFile = service.updateFolder(id, dto);

            return ResponseHandler.generateResponse(
                    "Folder updated successfully",
                    HttpStatus.OK,
                    updatedFile);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to update folder: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    // Delete Folder
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjectFile(@PathVariable Long id) {

        try {

            service.deleteFolder(id);

            return ResponseHandler.generateResponse(
                    "Folder deleted successfully",
                    HttpStatus.OK,
                    null);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to delete folder: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    @GetMapping("/tree")
    public ResponseEntity<?> getFolderTree(
            @RequestParam(required = false) List<Long> ids,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String search) {

        try {

            var tree = service.getFolderTree(ids, page, size, sortBy, sortDir, search);

            return ResponseHandler.generateResponse(
                    "Folder tree fetched successfully",
                    HttpStatus.OK,
                    tree);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch folders: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    @GetMapping("/children")
    public ResponseEntity<?> getChildFolders(
            @RequestParam Long parentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String search) {

        try {

            var data = service.getChildFolders(parentId, page, size, sortBy, sortDir, search);

            return ResponseHandler.generateResponse(
                    "Child folders fetched successfully",
                    HttpStatus.OK,
                    data);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch child folders: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

}