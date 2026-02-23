package com.rkt.dms.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "audit_logs",
        indexes = {

                @Index(name="idx_actor_time",
                        columnList="actorId,eventTime"),

                @Index(name="idx_action",
                        columnList="action"),

        })
@Getter
@Setter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant eventTime;

    private Long actorId;
    private String actorEmail;

    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Enumerated(EnumType.STRING)
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

