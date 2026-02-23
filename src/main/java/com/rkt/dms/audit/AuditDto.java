package com.rkt.dms.audit;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class AuditDto {

    private Long id;
    private Instant eventTime;

    private Long actorId;
    private String actorEmail;

    private AuditAction action;
    private AuditAction.Category category;
    private String entityType;

    private String requestId;
    private String httpMethod;
    private String ipAddress;
    private String ipNormalized;
    private String userAgent;

    private Boolean success;
    private Long latencyMs;
}