package com.rkt.dms.audit;

import org.springframework.data.domain.Page;

public interface AuditService {

    Page<AuditDto> getAuditLogs(int page, int size);

    void log(
            AuditAction action,
            AuditEntityType entityType,
            boolean success
    );

    void log(
            AuditAction action,
            AuditEntityType entityType,
            boolean success,
            Long actorId,
            String actorEmail
    );
}
