package com.rkt.dms.serviceImpl;

import com.rkt.dms.audit.*;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.jwt.utilis.JwtUtil;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.service.EmailSendService;
import com.rkt.dms.service.EmailVerification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationImpl implements EmailVerification {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailSendService emailService;

    @Value("${app.url.verify-email}")
    private String verifyEmailUrl;

    // ================= VERIFY =================

    @Override
    @Auditable(
            action = AuditAction.EMAIL_VERIFY_SUCCESS,
            entityType = AuditEntityType.USER,
            entityIdField = "id"
    )
    public Boolean verifyUser(String token) {

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        if (!"VERIFY".equals(jwtUtil.extractTokenType(token))) {
            throw new RuntimeException("Invalid token type");
        }

        String email = jwtUtil.extractUsername(token);

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setEmailVerified(true);

        userRepository.save(user);

        return true;
    }

    // ================= SEND =================

    @Override
    @Auditable(
            action = AuditAction.EMAIL_VERIFICATION_TRIGGER,
            entityType = AuditEntityType.AUTH
    )
    public Boolean verificationMail(String email) {

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            return true; // prevent enumeration
        }

        String jwt = jwtUtil.generateVerificationToken(email);

        String confirmationUrl = verifyEmailUrl + jwt;

        try {
            emailService.sendEmail(user.getEmail(), confirmationUrl);
        }
        catch (Exception ex) {
            log.error("Email send failed", ex);
            throw new RuntimeException("Email dispatch failed");
        }

        log.info("Verification email sent to {}", email);

        return true;
    }
}
