package com.rkt.dms.dto;

import lombok.Data;

@Data
public class NextNumberDto {
    private long id;
    private String Folder;
    private String category;
    private String process;
    private int year;
    private int currentIndex;
    private String lastNumber;
    private int length;
    private String docNumber;
    private int status;
    private String docId;
}