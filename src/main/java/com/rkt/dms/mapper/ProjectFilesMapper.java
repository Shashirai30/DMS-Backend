package com.rkt.dms.mapper;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class ProjectFilesMapper {

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

        return new ProjectFilesDto(
                entity.getId(),
                entity.getLabel(),
                entity.getDescription(),
                entity.getFileType(),
                entity.getSize(),
                documentIds
        );
    }
}
