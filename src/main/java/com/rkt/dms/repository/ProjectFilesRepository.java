package com.rkt.dms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.rkt.dms.dto.FolderFlagProjection;
import com.rkt.dms.dto.FolderStatsProjection;
import com.rkt.dms.entity.ProjectFilesEntity;

public interface ProjectFilesRepository extends
        JpaRepository<ProjectFilesEntity, Long>,
        JpaSpecificationExecutor<ProjectFilesEntity> {

    List<ProjectFilesEntity> findByParentId(Long parentId);

    List<ProjectFilesEntity> findByParentIsNull();

    Page<ProjectFilesEntity> findByParentId(Long parentId, Pageable pageable);

    Page<ProjectFilesEntity> findByParentIdAndCodeContainingIgnoreCase(
            Long parentId, String code, Pageable pageable);

    // Optional<DocumentEntity> findByLabel(String folder);

    @Query(value = """
                SELECT
                    pf.id as id,
                    COALESCE(SUM(d.size), 0) as totalSize,
                    COUNT(d.id) as totalCount
                FROM project_files pf
                LEFT JOIN documents d
                    ON d.project_file_id = pf.id
                WHERE pf.parent_id IS NULL
                GROUP BY pf.id
            """, nativeQuery = true)
    List<FolderStatsProjection> getFolderStats();

    @Query(value = """
                SELECT DISTINCT lsd.folder_id
                FROM latest_share_doc lsd
                WHERE lsd.shared_with = :userId
                  AND lsd.is_viewed = false
            """, nativeQuery = true)
    List<Long> getFoldersWithUnseenDocs(Long userId);
}