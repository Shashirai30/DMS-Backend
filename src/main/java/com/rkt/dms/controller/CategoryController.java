package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.service.CategoryDocumentCount;
import com.rkt.dms.serviceImpl.CategoryDocumentCountsServiceImpl;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryDocumentCountsServiceImpl categoryService;

    @GetMapping("/document-count")
    public ResponseEntity<List<CategoryDocumentCount>> getDocumentCountByCategory(
            @RequestParam List<Long> fileIds) {
        List<CategoryDocumentCount> data = categoryService.getCategoryDocumentCounts(fileIds);
        return ResponseEntity.ok(data);
    }
}
