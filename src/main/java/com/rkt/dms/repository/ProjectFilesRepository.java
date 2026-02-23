package com.rkt.dms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.ProjectFilesEntity;


@Repository
public interface ProjectFilesRepository extends JpaRepository<ProjectFilesEntity, Long> {
    Optional<ProjectFilesEntity> findByLabel(String name);

    @Query("SELECT SUM(d.size) FROM DocumentEntity d WHERE d.id IN :documentIds")
    Double getTotalSize(@Param("documentIds") List<Long> documentIds);

    Page<ProjectFilesEntity> findAll(Specification<ProjectFilesEntity> spec, Pageable pageable);
    //Page<ProjectFilesEntity> findAllById(Specification<ProjectFilesEntity> spec, Pageable pageable,List<Long> ids);
}
