package com.rkt.dms.service;



import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.entity.document.DocumentEntity;

public interface DocumentService {
    DocumentDto createDocument(MultipartFile file, DocumentDto DocumentDto);
    DocumentEntity downloadDocument(Long documentId);
    DocumentDto getRenameDocuments(Long documentId, String newName,String fileCategory);
    
    DocumentDto getDocumentById(Long id);
    // List<DocumentDto> getAllDocuments(Long folderId);
    Page<DocumentDto> getAllDocuments(Long folderId, int page, int size, String sortBy, String sortDir, String search,String fileCategory,String year,String docName,String docNumber);

    Page<DocumentDto> getDocumentsSharedByUser(String userName,int page, int size, String sortBy, String sortDir, String search,String folder,String year,String docName);

    public void softDeleteFile(Long fileId);

    void deleteDocument(Long id);
}

