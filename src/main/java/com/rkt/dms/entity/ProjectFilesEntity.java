package com.rkt.dms.entity;

import com.rkt.dms.entity.document.DocumentEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.ArrayList;

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

    private String label;

    private String code;

    private String description;

    private String fileType;

    private Double size;

    //  Parent Folder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProjectFilesEntity parent;

    //  Child Folders
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProjectFilesEntity> children = new ArrayList<>();

    //  Folder Path (for fast search)
    @Column(name = "path")
    private String path;

}
