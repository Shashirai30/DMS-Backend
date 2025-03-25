package com.rkt.dms.service;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.entity.document.DocumentEntity;

public interface DocumentService {
    DocumentDto createDocument(MultipartFile file, DocumentDto DocumentDto);
    DocumentEntity downloadDocument(Long documentId);
    List<DocumentDto> getDocumentsByType(String documentType);
    
    DocumentDto getDocumentById(Long id);
    // List<DocumentDto> getAllDocuments(Long folderId);
    Page<DocumentDto> getAllDocuments(Long folderId, int page, int size, String sortBy, String sortDir, String search);
    void deleteDocument(Long id);
}

