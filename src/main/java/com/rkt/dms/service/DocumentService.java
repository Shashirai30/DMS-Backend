// package com.rkt.dms.service;

// import org.springframework.web.multipart.MultipartFile;

// import com.rkt.dms.dto.document.DocumentDto;

// import java.io.IOException;
// import java.util.List;

// public interface DocumentService {
//     DocumentDto uploadDocument(MultipartFile file, String documentType) throws IOException;
//     List<DocumentDto> getDocumentsByType(String documentType);
//     byte[] downloadDocument(Long documentId);
// }

package com.rkt.dms.service;


import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.entity.document.DocumentEntity;

public interface DocumentService {
    DocumentDto createDocument(MultipartFile file, DocumentDto DocumentDto);
    DocumentEntity downloadDocument(Long documentId);
    List<DocumentDto> getDocumentsByType(String documentType);
    
    DocumentDto getDocumentById(Long id);
    List<DocumentDto> getAllDocuments(Long folderId);
    void deleteDocument(Long id);
}

