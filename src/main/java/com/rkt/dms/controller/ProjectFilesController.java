package com.rkt.dms.controller;

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
        var createdFile = service.createProjectFile(dto);
        return ResponseHandler.generateResponse("Folder created successfully", HttpStatus.CREATED, createdFile);
    }

    @GetMapping
    public ResponseEntity<?> getAllProjectFiles(@RequestParam(defaultValue = "0", required = false) Long id) {
        var projectFiles = service.getProjectFiles(id);
        return ResponseHandler.generateResponse("Folders fetched successfully", HttpStatus.OK, projectFiles);
    }

    @PutMapping
    public ResponseEntity<?> updateProjectFile(@RequestParam(defaultValue = "0", required = false) Long id, 
                                               @RequestBody ProjectFilesDto dto) {
        var updatedFile = service.updateProjectFile(id, dto);
        return ResponseHandler.generateResponse("Folder updated successfully", HttpStatus.OK, updatedFile);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteProjectFile(@RequestParam(defaultValue = "0", required = false) Long id) {
        service.deleteProjectFile(id);
        return ResponseHandler.generateResponse("Folder deleted successfully", HttpStatus.NO_CONTENT, null);
    }
}
