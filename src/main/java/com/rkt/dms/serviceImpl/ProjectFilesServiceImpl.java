package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.CategoryDto;
import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.CategoryEntity;
import com.rkt.dms.mapper.ProjectFilesMapper;
import com.rkt.dms.repository.ProjectFilesRepository;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.service.ProjectFilesService;
import com.rkt.dms.utils.SecurityUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectFilesServiceImpl implements ProjectFilesService {

    @Autowired
    private ProjectFilesRepository repository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ProjectFilesMapper mapper;

    @Override
    public ProjectFilesDto createProjectFile(ProjectFilesDto dto) {
        ProjectFilesEntity entity = mapper.toEntity(dto);

        // Set categories with managed entities
        if (dto.getCategories() != null) {
            List<CategoryEntity> categories = dto.getCategories().stream()
                    .map(categoryDto -> {
                        CategoryEntity category = new CategoryEntity();
                        category.setId(categoryDto.getId()); // Retain existing ID

                        String name = categoryDto.getName();
                        if (name != null && name.contains("-")) {
                            String[] parts = name.split("-", 2);
                            category.setName(parts[0].trim()); // e.g., "Payroll"

                            // Optional: set a separate field for the code, e.g., "100"
                            category.setCode(parts[1].trim()); // Ensure you have a `code` field
                        } else {
                            category.setName(name);
                        }

                        category.setFilesEntity(entity); // Link to parent
                        return category;
                    })
                    .collect(Collectors.toList());

            entity.setCategories(categories);
        }

        return mapper.toDto(repository.save(entity));
    }

    @Override
    public List<ProjectFilesDto> getProjectFiles(List<Long> ids) {
        System.out.println("Check Role : " + SecurityUtils.isAdmin());
        List<ProjectFilesEntity> entities = null;

        if (!SecurityUtils.isAdmin()) {
            if (ids != null && !ids.isEmpty()) {
                entities = repository.findAllById(ids);
            }
        } else {
            entities = repository.findAll();
        }

        return entities.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectFilesDto updateProjectFile(Long id, ProjectFilesDto dto) {
        ProjectFilesEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project File not found"));

        entity.setLabel(dto.getName());
        entity.setDescription(dto.getDescription());
        // entity.setFileType(dto.getFileType());
        // entity.setSize(dto.getSize());

        // Manage categories correctly to avoid orphan deletion issue
        if (dto.getCategories() != null) {
            // Remove categories that are no longer in the DTO
            entity.getCategories().removeIf(existingCategory -> dto.getCategories().stream()
                    .noneMatch(c -> c.getId() != null && c.getId().equals(existingCategory.getId())));

            // Add or update categories
            for (CategoryDto categoryDto : dto.getCategories()) {

                // Check if category name exists in another document
                if (categoryDto.getName() != null &&
                        documentRepository.existsByFileCategory(categoryDto.getName())) {
                    throw new RuntimeException(
                            "Category name '" + categoryDto.getName() + "' is already assigned to another document");
                }

                if (categoryDto.getId() == null) {
                    // New category, create and add it
                    CategoryEntity newCategory = new CategoryEntity();
                    newCategory.setName(categoryDto.getName());
                    newCategory.setFilesEntity(entity);
                    entity.getCategories().add(newCategory);
                } else {
                    // Existing category, update it
                    entity.getCategories().stream()
                            .filter(c -> c.getId().equals(categoryDto.getId()))
                            .findFirst()
                            .ifPresent(existingCategory -> existingCategory.setName(categoryDto.getName()));
                }
            }
        }

        return mapper.toDto(repository.save(entity));
    }

    @Override
    public void deleteProjectFile(Long id) {
        repository.deleteById(id);
    }
}
