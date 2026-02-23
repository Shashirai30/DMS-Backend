package com.rkt.dms.dto.document;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private Long id;
    private String name;
    private String documentType;
    private String documentNumber;
    private String fileType;
    private String srcUrl;
    private String folder;
    private String fileCategory;
    private double size;
    private LocalDateTime uploadDate;
    private boolean recent;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private AuthorDTO author;

    private List<ActivityDTO> activities;
    private List<PermissionDTO> permissions;
}
