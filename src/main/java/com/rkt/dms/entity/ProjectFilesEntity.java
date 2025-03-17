package com.rkt.dms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectFilesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "file_type", nullable = false)
    @Builder.Default
    private String fileType = "directory";

    @Column(name = "size", nullable = false)
    private Double size;
}
