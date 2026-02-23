package com.rkt.dms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "next_number")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NextNumberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String Folder;
    private String category;
    private String process;
    private int year;

    @Column(name = "doc_id")
    private String docId;

    @Column(name = "current_index")
    private int currentIndex;

    @Column(name = "DOC_NUMBER")
    private String docNumber;

    @Column(name = "last_number")
    private String lastNumber;
    private int length;
    private int status;
}
