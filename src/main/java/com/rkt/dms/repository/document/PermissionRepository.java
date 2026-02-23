package com.rkt.dms.repository.document;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.document.PermissionEntity;

@Repository
public interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {
    Optional<PermissionEntity> findByShareToken(String token);

    // List<Long> findDocumentIdByUserNameAndIsLinkShareTrue(String userName);
    List<Long> findDocumentIdByUserName(String userName);

    @Query("SELECT p.document.id FROM PermissionEntity p WHERE p.userEmail = :userEmail AND p.isLinkShare = true")
    List<Long> getDocumentIdsByUserEmailAndLinkShareTrue(@Param("userEmail") String userEmail);

}
