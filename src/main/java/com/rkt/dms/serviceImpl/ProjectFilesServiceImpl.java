package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.ProjectFilesDto;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.mapper.ProjectFilesMapper;
import com.rkt.dms.repository.ProjectFilesRepository;
import com.rkt.dms.service.ProjectFilesService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectFilesServiceImpl implements ProjectFilesService {

    @Autowired
    private ProjectFilesRepository repository;

    @Autowired
    private ProjectFilesMapper mapper;

    @Override
    public ProjectFilesDto createProjectFile(ProjectFilesDto dto) {
        ProjectFilesEntity entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public List<ProjectFilesDto> getProjectFiles(Long id) {
        if (id > 0) {
            return repository.findById(id)
                    .map(file -> List.of(mapper.toDto(file)))
                    .orElseThrow(() -> new RuntimeException("Project File not found"));
        } else {
            List<ProjectFilesEntity> entities = repository.findAll();

            // Print total size at runtime
            // Long totalSize = repository.getTotalSize(entities.stream()
            //         .map(ProjectFilesEntity::getId)
            //         .collect(Collectors.toList()));
            // System.out.println("Total size of all files: " + (totalSize != null ? totalSize : 0L));

            return entities.stream()
                    .map(mapper::toDto) // This will now include dynamically set size
                    .collect(Collectors.toList());
        }
    }

    @Override
    public ProjectFilesDto updateProjectFile(Long id, ProjectFilesDto dto) {
        ProjectFilesEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project File not found"));

        entity.setLabel(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setFileType(dto.getFileType());
        entity.setSize(dto.getSize());

        return mapper.toDto(repository.save(entity));
    }

    @Override
    public void deleteProjectFile(Long id) {
        repository.deleteById(id);
    }
}
