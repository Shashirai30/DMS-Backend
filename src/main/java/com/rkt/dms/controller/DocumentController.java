package com.rkt.dms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.DocumentService;

import jakarta.persistence.EntityNotFoundException;

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

            if (files == null || files.length == 0) {
                return ResponseHandler.generateResponse("No files provided for upload", HttpStatus.BAD_REQUEST, null);
            }

            List<DocumentDto> savedDocuments = new ArrayList<>();
            for (MultipartFile file : files) {
                DocumentDto savedDoc = documentService.createDocument(file, convertedDTO);
                savedDocuments.add(savedDoc);
            }

            return ResponseHandler.generateResponse("Uploaded all files successfully!", HttpStatus.OK, savedDocuments);

        } catch (JsonProcessingException e) {
            return ResponseHandler.generateResponse("Invalid document metadata (documentDTO): " + e.getMessage(),
                    HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to upload documents: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
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
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        try {
            DocumentDto document = documentService.getDocumentById(id);
            return ResponseHandler.generateResponse("Document fetched successfully", HttpStatus.OK, document);
        } catch (EntityNotFoundException e) {
            return ResponseHandler.generateResponse("Document not found with ID: " + id, HttpStatus.NOT_FOUND, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
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
            @RequestParam(name = "docNumber", required = false) String docNumber,
            @RequestParam(name = "name", required = false) String docName) {
        try {
            var result = documentService.getAllDocuments(folderId, page, size, sortBy, sortDir, search, fileCategory,
                    year, docName,docNumber);
            return ResponseHandler.generateResponse("Documents fetched successfully", HttpStatus.OK, result);
        } catch (IllegalArgumentException e) {
            return ResponseHandler.generateResponse("Invalid request parameters: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<?> renameDocument(
            @RequestParam(value = "documentId") Long documentId,
            @RequestParam(value = "fileCategory", required = false) String fileCategory,
            @RequestParam(value = "newName") String newName) {
        try {
            var updatedDocument = documentService.getRenameDocuments(documentId, newName, fileCategory);
            return ResponseHandler.generateResponse("Document renamed successfully!", HttpStatus.OK, updatedDocument);
        } catch (EntityNotFoundException e) {
            return ResponseHandler.generateResponse("Document not found with ID: " + documentId, HttpStatus.NOT_FOUND,
                    null);
        } catch (IllegalArgumentException e) {
            return ResponseHandler.generateResponse("Invalid input: " + e.getMessage(), HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to rename document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseHandler.generateResponse("Document deleted successfully", HttpStatus.OK, null);
        } catch (EntityNotFoundException e) {
            return ResponseHandler.generateResponse("Document not found with ID: " + id, HttpStatus.NOT_FOUND, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to delete document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}
