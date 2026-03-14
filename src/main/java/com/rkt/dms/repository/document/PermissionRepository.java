package com.rkt.dms.repository.document;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rkt.dms.dto.DocumentShareSummaryDto;
import com.rkt.dms.dto.DocumentShareUserDto;
import com.rkt.dms.dto.DocumentViewStatusCountDto;
import com.rkt.dms.dto.LinkSharedDocumentDto;
import com.rkt.dms.entity.document.PermissionEntity;

@Repository
public interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {
    Optional<PermissionEntity> findByShareToken(String token);

    // List<Long> findDocumentIdByUserNameAndIsLinkShareTrue(String userName);
    List<Long> findDocumentIdByUserName(String userName);

    @Query("SELECT p.document.id FROM PermissionEntity p WHERE p.userEmail = :userEmail AND p.isLinkShare = true")
    List<Long> getDocumentIdsByUserEmailAndLinkShareTrue(@Param("userEmail") String userEmail);

    @Query(value = """
            SELECT
                p.document_id as documentId,
                d.document_name as documentName,
                d.document_number as documentNumber,
                d.file_type as fileType,
                d.size as size,
                COUNT(*) as totalShared
            FROM permissions p
            JOIN documents d ON p.document_id = d.id
            WHERE p.is_link_share = true
            GROUP BY p.document_id, d.document_name, d.document_number
            """, nativeQuery = true)
    List<DocumentShareSummaryDto> getDocumentShareSummary();

    @Query(value = """
            SELECT
                p.document_id AS documentId,
                d.document_name AS documentName,
                CONCAT(u1.first_name,' ',u1.last_name) AS sharedByName,
                CONCAT(u2.first_name,' ',u2.last_name) AS sharedWithName,
                p.role AS role,
                p.shared_at AS sharedAt,
                p.is_viewed AS isViewed,
                p.expiry_date AS expiryDate
            FROM permissions p
            JOIN documents d ON p.document_id = d.id
            LEFT JOIN users u1 ON p.shared_by = u1.id
            LEFT JOIN users u2 ON p.shared_with = u2.id
            WHERE p.document_id = :documentId
            AND p.role = 'viewer'
            """, nativeQuery = true)
    List<DocumentShareUserDto> getDocumentViewerUsers(Long documentId);

    @Query(value = """
            SELECT
                SUM(CASE WHEN p.is_viewed = true THEN 1 ELSE 0 END) AS viewedCount,
                SUM(CASE WHEN p.is_viewed = false OR p.is_viewed IS NULL THEN 1 ELSE 0 END) AS unViewedCount
            FROM permissions p
            WHERE p.shared_with = :sharedWith
            """, nativeQuery = true)
    DocumentViewStatusCountDto getViewStatusCount(Long sharedWith);

    @Query(value = """
            SELECT
                d.document_number AS documentNumber,
                d.document_name AS documentName,
                d.size AS size,
                p.is_viewed AS IsViewed,
                SUBSTRING_INDEX(d.document_name,'.',-1) AS fileType,
                p.share_token AS shareToken,
                CONCAT(u.first_name,' ',u.last_name) AS sharedBy,
                p.expiry_date AS expiryDate
            FROM permissions p
            JOIN documents d ON p.document_id = d.id
            LEFT JOIN users u ON p.shared_by = u.id
            WHERE p.shared_with = :userId
            AND p.is_link_share = 1
            """, nativeQuery = true)
    List<LinkSharedDocumentDto> getLinkSharedDocuments(Long userId);

}
