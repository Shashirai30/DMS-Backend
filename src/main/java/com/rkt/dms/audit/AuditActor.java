package com.rkt.dms.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuditActor {

    private final Long actorId;
    private final String actorEmail;

    public static AuditActor system() {
        return new AuditActor(null, "SYSTEM");
    }

    public static AuditActor user(Long actorId, String actorEmail) {
        return new AuditActor(actorId, actorEmail);
    }
}
