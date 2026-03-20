package com.rkt.dms.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectFilesDto {

    private Long id;

    private String name;

    private String code;

    private String description;

    private String fileType;

    private Double size;

    Boolean isNewDoc;

    private String path;

    // Parent Folder
    private Long parentId;

    // Child folders (Tree structure)
    @JsonIgnore
    private List<ProjectFilesDto> children;

}
