package com.rkt.dms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.ProjectFilesEntity;

@Repository
public interface ProjectFilesRepository extends JpaRepository<ProjectFilesEntity, Long> {
    Optional<ProjectFilesEntity> findByLabel(String name);
}
