package com.rkt.dms.audit;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {

    AuditAction action();

    AuditEntityType entityType();

    String entityIdParam() default "";

    String entityIdField() default "";

}
