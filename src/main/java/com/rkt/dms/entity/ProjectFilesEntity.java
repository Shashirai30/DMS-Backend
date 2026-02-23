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

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "size")
    private Double size;

    @OneToMany(mappedBy = "projectFile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DocumentEntity> documents = new ArrayList<>(); // ✅ Initialize List

    @OneToMany(mappedBy = "filesEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoryEntity> categories;

    @ManyToMany(mappedBy = "projectFiles")
    private List<UserEntity> users = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.fileType == null) {
            this.fileType = "directory";
        }
    }
}
