package com.rkt.dms.audit;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuditAction {

    // ================= SECURITY =================
    LOGIN_SUCCESS(Category.SECURITY, Severity.LOW),
    LOGIN_FAIL(Category.SECURITY, Severity.HIGH),
    JWT_INVALID(Category.SECURITY, Severity.CRITICAL),
    JWT_EXPIRED(Category.SECURITY, Severity.MEDIUM),
    LOGOUT(Category.SECURITY, Severity.LOW),

    PASSWORD_RESET_REQUEST(Category.SECURITY, Severity.HIGH),
    PASSWORD_RESET_SET(Category.SECURITY, Severity.CRITICAL),
    PASSWORD_RESET_TOKEN(Category.SECURITY,Severity.CRITICAL),

    EMAIL_VERIFY_SUCCESS(Category.SECURITY, Severity.LOW),
    EMAIL_VERIFY_FAIL(Category.SECURITY, Severity.MEDIUM),

    // ================= EMAIL =================
    EMAIL_SEND(Category.EMAIL, Severity.LOW),
    EMAIL_VERIFICATION_TRIGGER(Category.EMAIL, Severity.LOW),

    // ================= USER =================
    USER_CREATE(Category.USER, Severity.MEDIUM),
    USER_UPDATE(Category.USER, Severity.MEDIUM),
    USER_DELETE(Category.USER, Severity.CRITICAL),

    ROLE_ASSIGN(Category.USER, Severity.HIGH),
    ROLE_REVOKE(Category.USER, Severity.HIGH),
    ROLE_CREATE(Category.USER, Severity.CRITICAL),
    ROLE_UPDATE(Category.USER, Severity.HIGH),
    ROLE_DELETE(Category.USER, Severity.CRITICAL),
    ROLE_READ(Category.USER, Severity.LOW),

    FOLDER_ASSIGN_TO_USER(Category.USER, Severity.MEDIUM),

    // ================= DOCUMENT =================
    DOCUMENT_UPLOAD(Category.DOCUMENT, Severity.MEDIUM),
    DOCUMENT_UPDATE(Category.DOCUMENT, Severity.MEDIUM),
    DOCUMENT_DELETE(Category.DOCUMENT, Severity.CRITICAL),
    DOCUMENT_DOWNLOAD(Category.DOCUMENT, Severity.LOW),
    DOCUMENT_VIEW(Category.DOCUMENT, Severity.LOW),

    VERSION_CREATE(Category.DOCUMENT, Severity.MEDIUM),
    SHARE_GRANT(Category.DOCUMENT, Severity.HIGH),
    SHARE_REVOKE(Category.DOCUMENT, Severity.HIGH),

    // ================= SYSTEM =================
    EMAIL_CONFIG_CREATE(Category.SYSTEM, Severity.CRITICAL),
    EMAIL_CONFIG_UPDATE(Category.SYSTEM, Severity.CRITICAL),
    EMAIL_CONFIG_DELETE(Category.SYSTEM, Severity.CRITICAL),

    SYSTEM_SETTING_UPDATE(Category.SYSTEM, Severity.CRITICAL);


    private final Category category;
    private final Severity severity;

    public enum Category {
        SECURITY,
        EMAIL,
        USER,
        DOCUMENT,
        SYSTEM
    }

    public enum Severity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
