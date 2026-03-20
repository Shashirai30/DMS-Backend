package com.rkt.dms.serviceImpl;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.controller.SendEmailController;
import com.rkt.dms.dto.ShareUserDto;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.LatestShareDocEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.LatestShareDocRepository;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.service.ShareService;
import com.rkt.dms.utils.SecurityUtils;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

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
    @Autowired
    LatestShareDocRepository latestShareDocRepository;

    @Transactional
    @Override
    public List<String> shareDocumentViaLink(Long documentId, String role, Long folderId, List<ShareUserDto> users,String subject , String body) throws UnsupportedEncodingException, MessagingException {

        DocumentEntity document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        List<String> links = new ArrayList<>();
        Long currentUserId = SecurityUtils.getCurrentUserId();

        for (ShareUserDto userDto : users) {

            String token = UUID.randomUUID().toString();
            LocalDateTime now = LocalDateTime.now();

            // Fetch user
            UserEntity user = userRepository.findByEmail(userDto.getUserName());
            Long sharedWith = (user != null) ? user.getId() : null;

            String userImg = (user != null && user.getImage() != null)
                    ? user.getImage()
                    : "default.png";

            // STEP 1: DELETE old entry (safe even if not exists)
            latestShareDocRepository.deleteConditionally(folderId, sharedWith);

            // STEP 2: INSERT new latest share
            LatestShareDocEntity latest = LatestShareDocEntity.builder()
                    .role(role)
                    .isLinkShare(true)
                    .sharedBy(currentUserId)
                    .sharedWith(sharedWith)
                    .sharedAt(now)
                    .isViewed(false)
                    .folderId(folderId)
                    .document(document)
                    .build();

            latestShareDocRepository.save(latest);

            // STEP 3: Create permission entry
            PermissionEntity permission = PermissionEntity.builder()
                    .userImg(userImg)
                    .userEmail(userDto.getUserName())
                    .userName(user != null ? user.getFirstName() : null)
                    .document(document)
                    .folderId(folderId)
                    .role(role)
                    .shareToken(token)
                    // .expiryDate(now.plusDays(userDto.getExpiryDays()))
                    .isLinkShare(true)
                    .sharedBy(currentUserId)
                    .sharedWith(sharedWith)
                    .isViewed(false)
                    .sharedAt(now)
                    .build();

            permissionRepository.save(permission);

            // STEP 4: Generate link
            String link = "http://yourdomain.com/api/share/" + token;
            links.add(link);

            // STEP 5: Send email (non-blocking preferred)
            try {
                sendEmailController.shareDocumentMail(
                        userDto.getUserName(),
                        link,
                        document.getDocumentName(),
                        subject,
                        body);
            } catch (Exception e) {
                System.out.println("Email failed for: " + userDto.getUserName());
            }
        }

        return links;
    }

}
