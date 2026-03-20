package com.rkt.dms.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.ShareRequestDto;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.LatestShareDocEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.LatestShareDocRepository;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.DocumentService;
import com.rkt.dms.service.ShareService;
import com.rkt.dms.utils.FileUtils;
import com.rkt.dms.utils.SecurityUtils;

@RestController
@RequestMapping("/api/share")
public class ShareController {

    @Autowired
    ShareService shareService;

    @Autowired
    PermissionRepository permissionRepository;

    @Autowired
    DocumentService documentService;

    @Autowired
    LatestShareDocRepository latestShareDocRepository;

    @Autowired
    DocumentRepository documentRepository;

    @PostMapping
    ResponseEntity<?> generateShareLink(@RequestBody ShareRequestDto request) {
        try {
            List<String> links = shareService.shareDocumentViaLink(
                    request.getDocumentId(),
                    request.getRole(),
                    request.getFolderId(),
                    request.getUsers(), request.getSubject(),
                    request.getBody());
            return ResponseHandler.generateResponse("Share link generated successfully", HttpStatus.OK, links);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Failed to generate share link: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> accessSharedDocument(@PathVariable Long id) {
        try {

            // // Step 1: Get latest share entry
            LatestShareDocEntity share = latestShareDocRepository
                    .findByDocumentIdAndSharedWith(id, SecurityUtils.getCurrentUserId());

            // Step 2: Get document using documentId
            // Long documentId = share.getDocument().getId();

            DocumentEntity documentData = documentService.downloadDocument(id);

            // Step 3: Mark as viewed
            share.setIsViewed(true);
            latestShareDocRepository.save(share);

            System.out.println("Document accessed: " + MediaType.valueOf(documentData.getDocumentType()));

            // Step 4: Return file
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(documentData.getDocumentType()))
                    .body(FileUtils.decompressFile(documentData.getFileData()));

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Unable to access document: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    null);
        }
    }

    @GetMapping("/filtered-documents")
    public ResponseEntity<?> getFilteredDocuments(
            @RequestParam Long folderId,
            // @RequestParam Long sharedWith,
            // @RequestParam Long documentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {

            var data = documentService.getFilteredDocuments(folderId, SecurityUtils.getCurrentUserId(), page, size);

            if (data.isEmpty()) {
                return ResponseHandler.generateResponse(
                        "No documents found",
                        HttpStatus.NOT_FOUND,
                        null);
            }

            return ResponseHandler.generateResponse(
                    "Documents fetched successfully",
                    HttpStatus.OK,
                    data);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch documents: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }
}
