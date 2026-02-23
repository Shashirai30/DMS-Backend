package com.rkt.dms.entity.document;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String img;

    @OneToOne(mappedBy = "author")
    private DocumentEntity document;
}
