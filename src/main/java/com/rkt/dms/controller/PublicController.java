package com.rkt.dms.controller;

import com.rkt.dms.audit.AuditAction;
import com.rkt.dms.audit.AuditEntityType;
import com.rkt.dms.audit.AuditService;
import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.authDto.LoginRequestDto;
import com.rkt.dms.dto.responseDto.JwtResponse;
import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import com.rkt.dms.jwt.utilis.JwtUtil;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.EmailVerification;
import com.rkt.dms.service.UserService;
import com.rkt.dms.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class PublicController {

    private final UserService service;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailVerification emailVerification;
    private final AuditService auditService;

    @GetMapping("/health-check")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto params) {

        var result = service.addUser(params);

        auditService.log(
                AuditAction.USER_CREATE,
                AuditEntityType.USER,
                true
        );

        return ResponseHandler.generateResponse(
                "User created successfully",
                HttpStatus.CREATED,
                result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            ));

            CustomUserPrincipal principal =
                    (CustomUserPrincipal) authentication.getPrincipal();

            if (!principal.isEnabled()) {

                auditService.log(
                        AuditAction.LOGIN_FAIL,
                        AuditEntityType.AUTH,
                        false,
                        principal.getUserId(),
                        request.getEmail()
                );

                return ResponseHandler.generateResponse(
                        "User disabled",
                        HttpStatus.UNAUTHORIZED,
                        null
                );
            }

            String jwt = jwtUtil.generateToken(principal);
            UserDto userDto = service.getUserById(principal.getUserId());

            auditService.log(
                    AuditAction.LOGIN_SUCCESS,
                    AuditEntityType.USER,
                    true,
                    principal.getUserId(),
                    principal.getEmail()
            );

            return ResponseEntity.ok(
                    new JwtResponse(jwt, userDto)
            );

        }
        catch (BadCredentialsException ex) {

            auditService.log(
                    AuditAction.LOGIN_FAIL,
                    AuditEntityType.AUTH,
                    false
            );

            return ResponseHandler.generateResponse(
                    "Invalid credentials",
                    HttpStatus.UNAUTHORIZED,
                    null
            );
        }
        catch (Exception ex) {

            auditService.log(
                    AuditAction.LOGIN_FAIL,
                    AuditEntityType.AUTH,
                    false
            );

            log.error("Authentication failure", ex);

            return ResponseHandler.generateResponse(
                    "Authentication failed",
                    HttpStatus.UNAUTHORIZED,
                    null
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        if (SecurityUtils.isAuthenticated()) {

            auditService.log(
                    AuditAction.LOGOUT,
                    AuditEntityType.USER_SESSION,
                    true,
                    SecurityUtils.getCurrentUserId(),
                    SecurityUtils.getCurrentUserEmail()
            );
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/verify-email")
    public String verifyEmail(
            @RequestParam String token,
            org.springframework.ui.Model model) {

        try {

            boolean result = emailVerification.verifyUser(token);

            auditService.log(
                    result
                            ? AuditAction.EMAIL_VERIFY_SUCCESS
                            : AuditAction.EMAIL_VERIFY_FAIL,
                    AuditEntityType.AUTH,
                    result
            );

            model.addAttribute(
                    "message",
                    result
                            ? "Your account has been verified successfully."
                            : "Invalid verification token."
            );

            return "verify-email";
        }
        catch (Exception ex) {

            auditService.log(
                    AuditAction.EMAIL_VERIFY_FAIL,
                    AuditEntityType.AUTH,
                    false
            );

            log.error("Email verification error", ex);

            model.addAttribute("message", "Verification failed.");

            return "verify-email";
        }
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {

        service.forgotPassword(email);

        auditService.log(
                AuditAction.PASSWORD_RESET_REQUEST,
                AuditEntityType.AUTH,
                true
        );

        return ResponseEntity.ok(
                "Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        service.resetForgotPassword(token, newPassword);

        auditService.log(
                AuditAction.PASSWORD_RESET_SET,
                AuditEntityType.AUTH,
                true
        );

        return ResponseEntity.ok("Password successfully reset.");
    }
}
