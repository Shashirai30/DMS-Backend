package com.rkt.dms.repository.document;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.document.DocumentEntity;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    // Ensure this method returns a List<DocumentEntity>
    List<DocumentEntity> findByFileType(String fileType);
    List<DocumentEntity> findByProjectFileId(Long folderId);
    Page<DocumentEntity> findByProjectFileId(Long projectFileId, Pageable pageable);


}
