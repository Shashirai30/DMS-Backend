package com.rkt.dms.entity.document;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "latest_share_doc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LatestShareDocEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role; // owner, editor, viewer

    private boolean isLinkShare;

    private Long sharedBy;
    private Long sharedWith;
    private LocalDateTime sharedAt;

    private Boolean isViewed;
    private Long  folderId;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private DocumentEntity document;
}