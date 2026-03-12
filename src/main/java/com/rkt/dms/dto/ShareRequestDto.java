package com.rkt.dms.dto;

import java.util.List;

import lombok.Data;

@Data
public class ShareRequestDto {

    private Long documentId;
    private String role;
    private List<ShareUserDto> users;

    // getters setters
}
