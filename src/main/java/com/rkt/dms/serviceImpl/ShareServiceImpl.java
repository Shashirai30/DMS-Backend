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

    public List<String> shareDocumentViaLink(Long documentId,String role, List<ShareUserDto> users) {

        DocumentEntity document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        List<String> links = new ArrayList<>();

        Long currentUserId = SecurityUtils.getCurrentUserId();

        for (ShareUserDto userDto : users) {

            String token = UUID.randomUUID().toString();

            UserEntity user = userRepository.findByEmail(userDto.getUserName());

            String userImg = "default.png";
            if (user != null && user.getImage() != null) {
                userImg = user.getImage();
            }

            PermissionEntity share = PermissionEntity.builder()
                    .userImg(userImg)
                    .userEmail(userDto.getUserName())
                    .userName(user != null ? user.getFirstName() : null)
                    .document(document)
                    .role(role)
                    .shareToken(token)
                    .expiryDate(LocalDateTime.now().plusDays(userDto.getExpiryDays()))
                    .isLinkShare(true)
                    .sharedBy(currentUserId)
                    .sharedWith(user != null ? user.getId() : null)
                    .isViewed(false)
                    .sharedAt(LocalDateTime.now())
                    .build();

            String link = "http://yourdomain.com/api/share/" + token;

            try {
                sendEmailController.shareDocumentMail(
                        userDto.getUserName(),
                        link,
                        document.getDocumentName());
            } catch (UnsupportedEncodingException | MessagingException e) {
                e.printStackTrace();
            }

            permissionRepository.save(share);

            System.out.println(link);

            links.add(link);
        }

        return links;
    }

}
