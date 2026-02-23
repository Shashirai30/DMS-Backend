package com.rkt.dms.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.repository.CategoryRepository;
import com.rkt.dms.service.CategoryDocumentCount;

@Service
public class CategoryDocumentCountsServiceImpl {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDocumentCount> getCategoryDocumentCounts(List<Long> fileIds) {
        return categoryRepository.getCategoryDocumentCount(fileIds);
    }
}
