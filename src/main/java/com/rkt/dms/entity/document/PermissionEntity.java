package com.rkt.dms.entity.document;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String userImg;
    private String role; // owner, editor, viewer

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private DocumentEntity document;
}
