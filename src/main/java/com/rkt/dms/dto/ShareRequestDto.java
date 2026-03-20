package com.rkt.dms.dto;

import java.util.List;

import lombok.Data;

@Data
public class ShareRequestDto {

    private Long documentId;
    private Long folderId;
    private String role;
    private String subject;
    private String body;
    private List<ShareUserDto> users;

    // getters setters
}
