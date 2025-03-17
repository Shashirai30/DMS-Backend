package com.rkt.dms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectFilesDto {

    private Long id;
    private String name;
    private String description;
    private String fileType;
    private Double size;
}
