package com.rkt.dms.mapper;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import org.springframework.stereotype.Component;

@Component
public class ProjectFilesMapper {

    public ProjectFilesEntity toEntity(ProjectFilesDto dto) {
        return new ProjectFilesEntity(
                dto.getId(),
                dto.getName(), // Mapping 'name' from DTO to 'label' in Entity
                dto.getDescription(),
                dto.getFileType(),
                dto.getSize()
        );
    }

    public ProjectFilesDto toDto(ProjectFilesEntity entity) {
        return new ProjectFilesDto(
                entity.getId(),
                entity.getLabel(), // Mapping 'label' from Entity to 'name' in DTO
                entity.getDescription(),
                entity.getFileType(),
                entity.getSize()
        );
    }
}
