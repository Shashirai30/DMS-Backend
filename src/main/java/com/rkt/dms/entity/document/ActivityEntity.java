package com.rkt.dms.entity.document;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String userImg;
    private String actionType; // EDIT, CREATE, DELETE, etc.
    private Instant timestamp;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private DocumentEntity document;
}
