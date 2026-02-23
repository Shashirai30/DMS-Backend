package com.rkt.dms.audit;

import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import com.rkt.dms.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final ApplicationEventPublisher publisher;
    private final AuditRepository auditRepository;

    @Override
    public Page<AuditDto> getAuditLogs(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "eventTime")
        );

        return auditRepository.findAllByOrderByEventTimeDesc(pageable)
                .map(this::toDto);
    }

    private AuditDto toDto(AuditLog log) {

        return AuditDto.builder()
                .id(log.getId())
                .eventTime(log.getEventTime())
                .actorId(log.getActorId())
                .actorEmail(log.getActorEmail())
                .action(log.getAction())
                .category(log.getCategory())
                .entityType(log.getEntityType())
                .requestId(log.getRequestId())
                .httpMethod(log.getHttpMethod())
                .ipAddress(log.getIpAddress())
                .ipNormalized(log.getIpNormalized())
                .userAgent(log.getUserAgent())
                .success(log.getSuccess())
                .latencyMs(log.getLatencyMs())
                .build();
    }

    @Override
    public void log(
            AuditAction action,
            AuditEntityType entityType,
            boolean success) {

        AuditActor actor = resolveActor();

        log(action, entityType, success,
                actor.getActorId(),
                actor.getActorEmail());
    }

    @Override
    public void log(
            AuditAction action,
            AuditEntityType entityType,
            boolean success,
            Long actorId,
            String actorEmail) {

        publisher.publishEvent(
                AuditEvent.builder()
                        .action(action)
                        .entityType(entityType != null ? entityType.name() : null)
                        .actorId(actorId)
                        .actorEmail(actorEmail)
                        .requestId(MDC.get("requestId"))
                        .httpMethod(MDC.get("method"))
                        .ipAddress(MDC.get("ip"))
                        .ipNormalized(MDC.get("ipNormalized"))
                        .userAgent(MDC.get("ua"))
                        .latency(parseLatency())
                        .success(success)
                        .build()
        );
    }

    private AuditActor resolveActor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal() instanceof String) {

            return AuditActor.system();
        }

        CustomUserPrincipal principal =
                (CustomUserPrincipal) authentication.getPrincipal();

        return AuditActor.user(
                principal.getUserId(),
                principal.getEmail()
        );
    }

    private long parseLatency() {
        String latency = MDC.get("latency");
        if (latency == null) return 0;
        try { return Long.parseLong(latency); }
        catch (Exception ex) { return 0; }
    }
}
