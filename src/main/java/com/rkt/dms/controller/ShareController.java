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
import com.rkt.dms.service.ShareService;

@RestController
@RequestMapping("/api/share")
public class ShareController {

    @Autowired
    ShareService shareService;
    @Autowired
    PermissionRepository permissionRepository;

    @PostMapping("/{documentId}")
    public ResponseEntity<String> generateShareLink(
            @PathVariable Long documentId,
            @RequestParam(defaultValue = "viewer") String role,
            @RequestParam(defaultValue = "7") int expiryDays) {
        String link = shareService.shareDocumentViaLink(documentId, role, expiryDays);
        return ResponseEntity.ok(link);
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> accessSharedDocument(@PathVariable String token) {
        PermissionEntity share = permissionRepository.findByShareToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired link"));

        if (share.getExpiryDate() != null && share.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Link expired");
        }

        DocumentEntity doc = share.getDocument();

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(doc.getDocumentType()))
                .body(doc.getFileData());

        // return ResponseEntity.ok()
        //         .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getDocumentName() + "\"")
        //         .contentType(MediaType.APPLICATION_OCTET_STREAM)
        //         .body(doc.getFileData());
    }
}
