package com.rkt.dms.audit;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuditEvent {

    private final AuditAction action;
    private final String entityType;

    private Long actorId;
    private String actorEmail;

    private final String requestId;
    private final String httpMethod;
    private final String ipAddress;
    private final String ipNormalized;
    private final String userAgent;

    @Builder.Default
    private final boolean success = true;

    @Builder.Default
    private final long latency = 0;
}
