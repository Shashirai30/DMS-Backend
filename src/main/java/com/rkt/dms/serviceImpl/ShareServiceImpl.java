package com.rkt.dms.serviceImpl;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.controller.SendEmailController;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.service.ShareService;
import com.rkt.dms.utils.SecurityUtils;

import jakarta.mail.MessagingException;

@Service
public class ShareServiceImpl implements ShareService {

    @Autowired
    PermissionRepository permissionRepository;
    @Autowired
    DocumentRepository documentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    SendEmailController sendEmailController;

    public String shareDocumentViaLink(Long documentId, String role, int expiryDays, String userName) {
        DocumentEntity document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        String token = UUID.randomUUID().toString();
        UserEntity user = userRepository.findByEmail(userName);

        String userImg = "default.png"; // default image
        if (user != null && user.getImage() != null) {
            userImg = user.getImage();
        }

        Long currentUserId = SecurityUtils.getCurrentUserId();

        PermissionEntity share = PermissionEntity.builder()
                .userImg(userImg)
                .userEmail(userName)
                .userName(user.getFirstName())
                .document(document)
                .role(role)
                .shareToken(token)
                .expiryDate(LocalDateTime.now().plusDays(expiryDays))
                .isLinkShare(true)
                .sharedBy(user != null ? currentUserId : null)
                .sharedWith(user != null ? user.getId() : null) // null for link shares
                .isViewed(false)
                .sharedAt(LocalDateTime.now())  
                .build();

        try {
            sendEmailController.shareDocumentMail(userName, "http://yourdomain.com/api/share/" + token,document.getDocumentName());
        } catch (UnsupportedEncodingException | MessagingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        permissionRepository.save(share);

        System.out.println("http://yourdomain.com/api/share/" + token);

        return "http://yourdomain.com/api/share/" + token;
    }

}
