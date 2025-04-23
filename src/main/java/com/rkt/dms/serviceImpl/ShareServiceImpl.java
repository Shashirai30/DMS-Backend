package com.rkt.dms.serviceImpl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.service.ShareService;


@Service
public class ShareServiceImpl implements ShareService {
    
    @Autowired
    PermissionRepository permissionRepository;
    @Autowired
    DocumentRepository documentRepository;

    public String shareDocumentViaLink(Long documentId, String role, int expiryDays) {
        DocumentEntity document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        String token = UUID.randomUUID().toString();

        PermissionEntity share = PermissionEntity.builder()
                .document(document)
                .role(role)
                .shareToken(token)
                .expiryDate(LocalDateTime.now().plusDays(expiryDays))
                .isLinkShare(true)
                .build();

        permissionRepository.save(share);

        System.out.println("http://yourdomain.com/api/share/" + token);

        return "http://yourdomain.com/api/share/" + token;
    }
    
}
