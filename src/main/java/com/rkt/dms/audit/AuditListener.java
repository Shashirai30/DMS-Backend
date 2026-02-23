package com.rkt.dms.audit;

import com.rkt.dms.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class AuditListener {

    private final AuditRepository repo;

    @Async("auditExecutor")
    @EventListener
    public void onAudit(AuditEvent e) {

        AuditLog log = new AuditLog();

        log.setEventTime(Instant.now());

        log.setActorId(e.getActorId());
        log.setActorEmail(
                e.getActorEmail() != null
                        ? e.getActorEmail()
                        : "SYSTEM"
        );

        log.setAction(e.getAction());
        log.setCategory(e.getAction().getCategory());
        log.setEntityType(e.getEntityType());

        log.setRequestId(e.getRequestId());
        log.setHttpMethod(e.getHttpMethod());
        log.setIpAddress(e.getIpAddress());
        log.setIpNormalized(e.getIpNormalized());
        log.setUserAgent(e.getUserAgent());

        log.setLatencyMs(e.getLatency());
        log.setSuccess(e.isSuccess());

        repo.save(log);
    }
}
