package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.CategoryDto;
import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.entity.CategoryEntity;
import com.rkt.dms.mapper.ProjectFilesMapper;
import com.rkt.dms.repository.ProjectFilesRepository;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.service.ProjectFilesService;
import com.rkt.dms.utils.SecurityUtils;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
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
    public Page<ProjectFilesDto> getProjectFiles(
            List<Long> ids,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search) {

        boolean isAdmin = SecurityUtils.isAdmin();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<ProjectFilesEntity> spec = searchByCode(search);

        // Restrict non-admin users
        if (!isAdmin && ids != null && !ids.isEmpty()) {

            spec = spec.and(
                    (root, query, cb) -> root.get("id").in(ids));
        }

        Page<ProjectFilesEntity> entities =
                repository.findAll(spec, pageable);

        return entities.map(mapper::toDto);
    }

    /**
     * Returns a Specification to filter users by email or empCode using a
     * case-insensitive search.
     *
     * @param search The keyword to search in email or empCode (partial match).
     * @return A Specification for filtering users based on the search keyword.
     */
    public static Specification<ProjectFilesEntity> searchByCode(String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchPattern)));
                        // criteriaBuilder.like(criteriaBuilder.lower(root.get("empCode")), searchPattern)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
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
