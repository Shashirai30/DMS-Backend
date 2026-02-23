package com.rkt.dms.repository;

import com.rkt.dms.audit.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface AuditRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByEventTimeDesc(Pageable pageable);

}
