package com.rkt.dms.mapper;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.dto.CategoryDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.CategoryEntity;
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

    public ProjectFilesEntity toEntity(ProjectFilesDto dto) {
        return ProjectFilesEntity.builder()
                .id(dto.getId())
                .label(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .fileType(dto.getFileType())
                .size(dto.getSize())
                .categories(mapCategoriesToEntity(dto.getCategories()))
                .build();
    }

    public ProjectFilesDto toDto(ProjectFilesEntity entity) {
        List<Long> documentIds = Optional.ofNullable(entity.getDocuments())
                .orElse(Collections.emptyList())
                .stream()
                .map(DocumentEntity::getId)
                .collect(Collectors.toList());

        Double totalSize = repository.getTotalSize(documentIds);

        List<CategoryDto> categories = Optional.ofNullable(entity.getCategories())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());

        return ProjectFilesDto.builder()
                .id(entity.getId())
                .name(entity.getLabel())
                .code(entity.getCode())
                .description(entity.getDescription())
                .fileType(entity.getFileType())
                .size(totalSize)
                // .documentIds(documentIds)
                .categories(categories)
                .build();
    }

    private List<CategoryEntity> mapCategoriesToEntity(List<CategoryDto> categoryDtos) {
        if (categoryDtos == null) {
            return Collections.emptyList();
        }
        return categoryDtos.stream()
                .map(dto -> new CategoryEntity(dto.getId(), dto.getName(), null ,null)) // Null for ProjectFilesEntity
                .collect(Collectors.toList());
    }

    private CategoryDto mapCategoryToDto(CategoryEntity categoryEntity) {
        return new CategoryDto(categoryEntity.getId(), categoryEntity.getName()+"-"+categoryEntity.getCode());
    }
}