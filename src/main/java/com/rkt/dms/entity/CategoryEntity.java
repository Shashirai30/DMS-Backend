package com.rkt.dms.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "files_id", nullable = false)
    private ProjectFilesEntity filesEntity;

}
