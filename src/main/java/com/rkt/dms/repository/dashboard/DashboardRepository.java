package com.rkt.dms.repository.dashboard;

import org.springframework.data.jpa.repository.Query;

import com.rkt.dms.dto.dashboard.DashboardStatsDto;


import com.rkt.dms.entity.document.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<DocumentEntity, Long> {

    @Query(value = """
            SELECT 
            (SELECT COUNT(*) FROM documents) AS totalDocuments,
            (SELECT COUNT(*) FROM users WHERE status = 'ACTIVE') AS activeUsers
            """, nativeQuery = true)
    DashboardStatsDto getDashboardStats();

}