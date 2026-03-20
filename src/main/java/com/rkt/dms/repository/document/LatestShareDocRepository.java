package com.rkt.dms.repository.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.LatestShareDocEntity;

public interface LatestShareDocRepository extends JpaRepository<LatestShareDocEntity, Long> {
  // @Query("""
  // SELECT l.document FROM LatestShareDocEntity l
  // WHERE l.folderId = :folderId
  // AND l.sharedWith = :sharedWith
  // """)
  // Page<DocumentEntity> findDocumentsByFilter(
  // @Param("folderId") Long folderId,
  // @Param("sharedWith") Long sharedWith,
  // Pageable pageable);

  Page<LatestShareDocEntity> findByFolderIdAndSharedWithOrderBySharedAtDesc(
      Long folderId,
      Long sharedWith,
      Pageable pageable);

  @Modifying
  @Query("""
          DELETE FROM LatestShareDocEntity l
          WHERE l.folderId = :folderId
          AND (
              (:sharedWith IS NULL AND l.sharedWith IS NULL)
              OR l.sharedWith = :sharedWith
          )
      """)
  void deleteConditionally(Long folderId, Long sharedWith);


  LatestShareDocEntity findByDocumentIdAndSharedWith(Long documentId, Long sharedWith);


}