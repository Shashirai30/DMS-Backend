package com.rkt.dms.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.rkt.dms.dto.ProjectFilesDto;

public interface ProjectFilesService {
    ProjectFilesDto createProjectFile(ProjectFilesDto dto);
    Page<ProjectFilesDto> getProjectFiles(List<Long> ids,int page, int size, String sortBy, String sortDir, String search);
    ProjectFilesDto updateProjectFile(Long id, ProjectFilesDto dto);
    void deleteProjectFile(Long id);
    
}
