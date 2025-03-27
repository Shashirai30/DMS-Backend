package com.rkt.dms.mapper;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.repository.ProjectFilesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Component
public class ProjectFilesMapper {

    @Autowired
    private ProjectFilesRepository repository;

    public ProjectFilesEntity toEntity(ProjectFilesDto dto) {
        return ProjectFilesEntity.builder()
                .id(dto.getId())
                .label(dto.getName())
                .description(dto.getDescription())
                .fileType(dto.getFileType())
                .size(dto.getSize())
                .build();
    }

    public ProjectFilesDto toDto(ProjectFilesEntity entity) {
        List<Long> documentIds = Optional.ofNullable(entity.getDocuments())
                .orElse(Collections.emptyList()) // Prevents NullPointerException
                .stream()
                .map(DocumentEntity::getId)
                .toList();

        // Calculate total size from associated documents
        // Double totalSize = Optional.ofNullable(entity.getDocuments())
        //         .orElse(Collections.emptyList())
        //         .stream()
        //         .map(DocumentEntity::getSize)
        //         .filter(Objects::nonNull) // Avoid null sizes
        //         .mapToDouble(Double::doubleValue) // Convert to double
        //         .sum();
        Double totalSize = repository.getTotalSize(documentIds);

        return new ProjectFilesDto(
                entity.getId(),
                entity.getLabel(),
                entity.getDescription(),
                entity.getFileType(),
                totalSize,
                documentIds);
    }
}
