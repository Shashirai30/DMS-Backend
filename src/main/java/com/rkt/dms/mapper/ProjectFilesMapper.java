package com.rkt.dms.mapper;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.repository.ProjectFilesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProjectFilesMapper {

    @Autowired
    private ProjectFilesRepository repository;

    // DTO → Entity
    public ProjectFilesEntity toEntity(ProjectFilesDto dto) {

        ProjectFilesEntity entity = ProjectFilesEntity.builder()
                .id(dto.getId())
                .label(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .fileType(dto.getFileType())
                .size(dto.getSize())
                .path(dto.getPath())
                .build();

        // parent mapping
        if (dto.getParentId() != null) {

            ProjectFilesEntity parent = repository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));

            entity.setParent(parent);
        }

        return entity;
    }

    // Entity → DTO
    public ProjectFilesDto toDto(ProjectFilesEntity entity) {

        List<ProjectFilesDto> children = Optional.ofNullable(entity.getChildren())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ProjectFilesDto.builder()
                .id(entity.getId())
                .name(entity.getLabel())
                .code(entity.getCode())
                .description(entity.getDescription())
                .fileType(entity.getFileType())
                .size(entity.getSize())
                .path(entity.getPath())
                .parentId(entity.getParent() != null ? entity.getParent().getId() : null)
                .children(children)
                .build();
    }
}