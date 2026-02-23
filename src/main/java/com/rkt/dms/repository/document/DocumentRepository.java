package com.rkt.dms.repository.document;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.document.DocumentEntity;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    // Ensure this method returns a List<DocumentEntity>
    List<DocumentEntity> findByFileType(String fileType);

    List<DocumentEntity> findByProjectFileId(Long folderId);

    // Page<DocumentEntity> findByIdIn(Specification<DocumentEntity> spec,List<Long> ids,Pageable pageable);
    Page<DocumentEntity> findByIdIn(List<Long> ids,Pageable pageable);

    Page<DocumentEntity> findByProjectFileIdAndFileCategory(Long projectFileId, Pageable pageable, String fileCategory);

    Page<DocumentEntity> findByProjectFileId(Long projectFileId, Pageable pageable);

    Page<DocumentEntity> findByProjectFileIdAndDocumentNameContainingIgnoreCase(Long projectFileId, Pageable pageable, String documentName);

    Page<DocumentEntity> findByProjectFileIdAndDocumentNumberContainingIgnoreCase(Long projectFileId, Pageable pageable, String documentNumber);

    // Page<DocumentEntity> findByProjectFileIdAndYear(Long folderId,Pageable
    // pageable,String year);

    @Query("SELECT d FROM DocumentEntity d WHERE d.projectFile.id = :folderId AND FUNCTION('YEAR', d.uploadDate) = :year")
    Page<DocumentEntity> findByProjectFileIdAndYear(@Param("folderId") Long folderId,
            @Param("year") String year,
            Pageable pageable);

    @Query("SELECT COUNT(*) > 0 FROM DocumentEntity WHERE fileCategory = :fileCategory")
    boolean existsByFileCategory(@Param("fileCategory") String name);

}
