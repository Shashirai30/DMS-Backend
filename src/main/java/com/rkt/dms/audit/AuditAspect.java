package com.rkt.dms.audit;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final ApplicationEventPublisher publisher;

    @Around("@annotation(auditable)")
    public Object audit(
            ProceedingJoinPoint jp,
            Auditable auditable) throws Throwable {

        long start = System.currentTimeMillis();
        boolean success = true;

        try {
            return jp.proceed();
        }
        catch (Exception ex) {
            success = false;
            throw ex;
        }
        finally {

            publisher.publishEvent(
                    AuditEvent.builder()
                            .action(auditable.action())
                            .entityType(auditable.entityType().name())
                            .success(success)
                            .latency(System.currentTimeMillis() - start)
                            .build()
            );
        }
    }
}

