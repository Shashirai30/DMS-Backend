package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.FolderFlagProjection;
import com.rkt.dms.dto.FolderStatsProjection;
import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.repository.ProjectFilesRepository;
import com.rkt.dms.service.ProjectFilesService;
import com.rkt.dms.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectFilesServiceImpl implements ProjectFilesService {

    private final ProjectFilesRepository repository;

    @Override
    public ProjectFilesDto createFolder(ProjectFilesDto dto) {

        ProjectFilesEntity entity = new ProjectFilesEntity();

        entity.setLabel(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setFileType("directory");

        if (dto.getParentId() != null) {

            ProjectFilesEntity parent = repository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));

            entity.setParent(parent);
        }

        ProjectFilesEntity saved = repository.save(entity);

        return mapToDto(saved);
    }

    @Override
    public ProjectFilesDto updateFolder(Long id, ProjectFilesDto dto) {

        ProjectFilesEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        entity.setLabel(dto.getName());
        entity.setDescription(dto.getDescription());

        return mapToDto(repository.save(entity));
    }

    @Override
    public void deleteFolder(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Page<ProjectFilesDto> getFolderTree(
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

        // Only root folders
        spec = spec.and((root, query, cb) -> cb.isNull(root.get("parent")));

        // Restrict non-admin users
        if (!isAdmin && ids != null && !ids.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("id").in(ids));
        }

        // STEP 1: Fetch aggregation in ONE query
        List<FolderStatsProjection> statsList = repository.getFolderStats();

        // STEP 2: Convert to Map (O(1) lookup)
        Map<Long, FolderStatsProjection> statsMap = statsList.stream()
                .collect(Collectors.toMap(FolderStatsProjection::getId, Function.identity()));

        // STEP 3: Fetch flagged folders for current user
        Set<Long> flaggedFolders = new HashSet<>(repository.getFoldersWithUnseenDocs(SecurityUtils.getCurrentUserId()));

        // STEP 3: Fetch folders
        Page<ProjectFilesEntity> entities = repository.findAll(spec, pageable);

        // STEP 4: Build tree with stats (NO EXTRA QUERY)
        return entities.map(entity -> buildTree(entity, statsMap, flaggedFolders));
    }

    private ProjectFilesDto buildTree(ProjectFilesEntity entity,
            Map<Long, FolderStatsProjection> statsMap,
            Set<Long> flaggedFolders) {

        ProjectFilesDto dto = new ProjectFilesDto();
        dto.setId(entity.getId());
        dto.setName(entity.getLabel());
        dto.setDescription(entity.getDescription());
        dto.setFileType(entity.getFileType());
        dto.setCode(entity.getCode());

        //  size
        FolderStatsProjection stats = statsMap.get(entity.getId());
        dto.setSize(stats != null ? stats.getTotalSize() : 0.0);

        //  STEP 1: check self
        boolean isNew = flaggedFolders.contains(entity.getId());

        //  STEP 2: check children recursively
        if (entity.getChildren() != null && !entity.getChildren().isEmpty()) {

            List<ProjectFilesDto> children = new ArrayList<>();

            for (ProjectFilesEntity child : entity.getChildren()) {
                ProjectFilesDto childDto = buildTree(child, statsMap, flaggedFolders);

                //  if any child has unseen doc → parent true
                if (childDto.getIsNewDoc()) {
                    isNew = true;
                }

                children.add(childDto);
            }

            dto.setChildren(children);
        }

        //  FINAL FLAG
        dto.setIsNewDoc(isNew);

        return dto;
    }

    public static Specification<ProjectFilesEntity> searchByCode(String search) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {

                String searchPattern = "%" + search.toLowerCase() + "%";

                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("code")),
                                        searchPattern),

                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("label")),
                                        searchPattern)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    public List<ProjectFilesDto> getChildFolders(Long parentId) {

        return repository.findByParentId(parentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProjectFilesDto buildTree(ProjectFilesEntity entity) {

        ProjectFilesDto dto = mapToDto(entity);

        List<ProjectFilesDto> children = repository.findByParentId(entity.getId())
                .stream()
                .map(this::buildTree)
                .collect(Collectors.toList());

        dto.setChildren(children);

        return dto;
    }

    private ProjectFilesDto mapToDto(ProjectFilesEntity entity) {

        return ProjectFilesDto.builder()
                .id(entity.getId())
                .name(entity.getLabel())
                .code(entity.getCode())
                .description(entity.getDescription())
                .fileType(entity.getFileType())
                .size(entity.getSize())
                .parentId(entity.getParent() != null ? entity.getParent().getId() : null)
                .build();
    }

    @Override
    public Page<ProjectFilesDto> getChildFolders(
            Long parentId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search) {

        Sort sort = sortDir.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProjectFilesEntity> folderPage;

        if (search != null && !search.isEmpty()) {
            folderPage = repository
                    .findByParentIdAndCodeContainingIgnoreCase(parentId, search, pageable);
        } else {
            folderPage = repository.findByParentId(parentId, pageable);
        }

        //  STEP 1: get user
        Long userId = SecurityUtils.getCurrentUserId();

        //  STEP 2: fetch all flagged folders (single query)
        Set<Long> flaggedFolders = new HashSet<>(
                repository.getFoldersWithUnseenDocs(userId));

        //  STEP 3: map with recursive flag logic
        return folderPage.map(entity -> buildChildTree(entity, flaggedFolders));
    }

    private ProjectFilesDto buildChildTree(ProjectFilesEntity entity,
            Set<Long> flaggedFolders) {

        ProjectFilesDto dto = new ProjectFilesDto();
        dto.setId(entity.getId());
        dto.setName(entity.getLabel());
        dto.setDescription(entity.getDescription());
        dto.setFileType(entity.getFileType());
        dto.setCode(entity.getCode());

        //  STEP 1: self check
        boolean isNew = flaggedFolders.contains(entity.getId());

        //  STEP 2: children recursion
        if (entity.getChildren() != null && !entity.getChildren().isEmpty()) {

            List<ProjectFilesDto> children = new ArrayList<>();

            for (ProjectFilesEntity child : entity.getChildren()) {
                ProjectFilesDto childDto = buildChildTree(child, flaggedFolders);

                //  propagate flag upward
                if (childDto.getIsNewDoc()) {
                    isNew = true;
                }

                children.add(childDto);
            }

            dto.setChildren(children);
        }

        //  FINAL FLAG
        dto.setIsNewDoc(isNew);

        return dto;
    }
}