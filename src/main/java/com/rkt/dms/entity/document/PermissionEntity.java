package com.rkt.dms.entity.document;

import java.time.LocalDateTime;

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

    private String userEmail; // for future use

    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String userImg;

    private String role; // owner, editor, viewer

    private String shareToken; // for public sharing
    private LocalDateTime expiryDate; // link validity
    private boolean isLinkShare;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private DocumentEntity document;
}
