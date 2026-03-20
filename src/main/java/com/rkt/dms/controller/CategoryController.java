package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.CategoryDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.CategoryDocumentCount;
import com.rkt.dms.service.CategoryService;
import com.rkt.dms.serviceImpl.CategoryDocumentCountsServiceImpl;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryDocumentCountsServiceImpl categoryCountService;
    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/document-count")
    public ResponseEntity<?> getDocumentCountByCategory(@RequestParam List<Long> fileIds) {
        try {
            List<CategoryDocumentCount> data = categoryCountService.getCategoryDocumentCounts(fileIds);
            return ResponseHandler.generateResponse("Document counts by category fetched successfully", HttpStatus.OK,
                    data);
        } catch (IllegalArgumentException e) {
            return ResponseHandler.generateResponse("Invalid request: " + e.getMessage(), HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to fetch document counts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    // Create Category
    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto dto) {
        try {

            CategoryDto data = categoryService.create(dto);

            return ResponseHandler.generateResponse(
                    "Category created successfully",
                    HttpStatus.CREATED,
                    data
            );

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to create category: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // Get All Categories
    @GetMapping("/all")
    public ResponseEntity<?> getAllCategories() {
        try {

            List<CategoryDto> data = categoryService.getAll();

            return ResponseHandler.generateResponse(
                    "Categories fetched successfully",
                    HttpStatus.OK,
                    data
            );

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch categories: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // Get Category By Id
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {

            CategoryDto data = categoryService.getById(id);

            return ResponseHandler.generateResponse(
                    "Category fetched successfully",
                    HttpStatus.OK,
                    data
            );

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch category: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // Update Category
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                            @RequestBody CategoryDto dto) {
        try {

            CategoryDto data = categoryService.update(id, dto);

            return ResponseHandler.generateResponse(
                    "Category updated successfully",
                    HttpStatus.OK,
                    data
            );

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to update category: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // Delete Category
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {

            categoryService.delete(id);

            return ResponseHandler.generateResponse(
                    "Category deleted successfully",
                    HttpStatus.OK,
                    null
            );

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to delete category: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

}
