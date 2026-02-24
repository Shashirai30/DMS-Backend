package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.CategoryDocumentCount;
import com.rkt.dms.serviceImpl.CategoryDocumentCountsServiceImpl;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryDocumentCountsServiceImpl categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/document-count")
    public ResponseEntity<?> getDocumentCountByCategory(@RequestParam List<Long> fileIds) {
        try {
            List<CategoryDocumentCount> data = categoryService.getCategoryDocumentCounts(fileIds);
            return ResponseHandler.generateResponse("Document counts by category fetched successfully", HttpStatus.OK,
                    data);
        } catch (IllegalArgumentException e) {
            return ResponseHandler.generateResponse("Invalid request: " + e.getMessage(), HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to fetch document counts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}
