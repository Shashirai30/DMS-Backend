package com.rkt.dms.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.rkt.dms.dto.ProjectFilesDto;

public interface ProjectFilesService {

    ProjectFilesDto createFolder(ProjectFilesDto dto);

    ProjectFilesDto updateFolder(Long id, ProjectFilesDto dto);

    Page<ProjectFilesDto> getFolderTree(
            List<Long> ids,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search);

    void deleteFolder(Long id);

    List<ProjectFilesDto> getChildFolders(Long parentId);

    Page<ProjectFilesDto> getChildFolders(
        Long parentId,
        int page,
        int size,
        String sortBy,
        String sortDir,
        String search);

}