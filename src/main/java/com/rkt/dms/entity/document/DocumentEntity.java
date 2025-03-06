package com.rkt.dms.entity.document;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String documentName;
    private String fileType; // pdf, docx, etc.
    private String srcUrl;
    private double size;
    private LocalDateTime uploadDate;
    private boolean recent;

    @Lob
    @Column(columnDefinition = "LONGBLOB") // Store file as BLOB
    private byte[] fileData;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private AuthorEntity author;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityEntity> activities;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PermissionEntity> permissions;
}
