package com.rkt.dms.controller;

import com.rkt.dms.audit.AuditDto;
import com.rkt.dms.audit.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/audits")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<AuditDto>> getAuditLogs(
            @RequestParam(defaultValue = "0",required = false) int page,
            @RequestParam(defaultValue = "20",required = false) int size) {

        return ResponseEntity.ok(
                auditService.getAuditLogs(page, size)
        );
    }
}

