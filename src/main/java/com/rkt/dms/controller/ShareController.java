package com.rkt.dms.controller;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.DocumentService;
import com.rkt.dms.service.ShareService;

@RestController
@RequestMapping("/api/share")
public class ShareController {

    @Autowired
    ShareService shareService;

    @Autowired
    PermissionRepository permissionRepository;

    @Autowired
    DocumentService documentService;

    @PostMapping
    public ResponseEntity<?> generateShareLink(
            @RequestParam Long documentId,
            @RequestParam String userName,
            @RequestParam(defaultValue = "viewer") String role,
            @RequestParam(defaultValue = "7") int expiryDays) {
        try {
            String link = shareService.shareDocumentViaLink(documentId, role, expiryDays, userName);
            return ResponseHandler.generateResponse("Share link generated successfully", HttpStatus.OK, link);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to generate share link: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> accessSharedDocument(@PathVariable String token) {
        try {
            PermissionEntity share = permissionRepository.findByShareToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid or expired link"));

            if (share.getExpiryDate() != null && share.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseHandler.generateResponse("The link has expired.", HttpStatus.FORBIDDEN, null);
            }

            DocumentEntity doc = share.getDocument();
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(doc.getDocumentType()))
                    .body(doc.getFileData());
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Unable to access document: " + e.getMessage(), HttpStatus.BAD_REQUEST, null);
        }
    }

    @GetMapping("/document")
    public ResponseEntity<?> getDocumentById(
            @RequestParam String userEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String folder,
            @RequestParam(required = false) String year,
            @RequestParam(name = "name", required = false) String docName) {
        try {
            var sharedDocs = documentService.getDocumentsSharedByUser(userEmail, page, size, sortBy, sortDir, search, folder, year, docName);
            if (sharedDocs.isEmpty()) {
                return ResponseHandler.generateResponse("No documents found for the user.", HttpStatus.NOT_FOUND, null);
            }
            return ResponseHandler.generateResponse("Documents fetched successfully", HttpStatus.OK, sharedDocs);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to fetch documents: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}

