package com.rkt.dms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.DocumentService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ObjectMapper objectMapper; // Inject Jackson ObjectMapper

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile[] files,
            @RequestPart("documentDTO") String documentDTO) {
        try {
            DocumentDto convertedDTO = objectMapper.readValue(documentDTO, DocumentDto.class);

            List<DocumentDto> savedDocuments = new ArrayList<>();
            for (MultipartFile file : files) {
                DocumentDto savedDoc = documentService.createDocument(file, convertedDTO);
                savedDocuments.add(savedDoc);
            }

            return ResponseHandler.generateResponse("Uploaded all files successfully!", HttpStatus.OK, savedDocuments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
        DocumentEntity documentData = documentService.downloadDocument(id);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(documentData.getDocumentType()))
                .body(documentData.getFileData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        try {
            DocumentDto document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDocuments(
            @RequestParam(required = false) Long folderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String fileCategory,
            @RequestParam(required = false) String year,
            @RequestParam(name = "name",required = false) String docName) {

        // Fetch documents with pagination
        var result = documentService.getAllDocuments(folderId, page, size, sortBy, sortDir, search, fileCategory, year, docName);
        return ResponseHandler.generateResponse("All documents fetched", HttpStatus.OK, result);
    }

    @PutMapping("/rename")
    public ResponseEntity<?> getRenameDocuments(
            @RequestParam(value = "documentId", required = false) Long documentId,
            @RequestParam(value = "fileCategory", required = false) String fileCategory,
            @RequestParam(value = "newName", required = false) String newName) {
        return ResponseHandler.generateResponse("Document Updated Successfully!", HttpStatus.OK,
                documentService.getRenameDocuments(documentId, newName,fileCategory));
    }

    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
