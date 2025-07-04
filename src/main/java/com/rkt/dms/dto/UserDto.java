package com.rkt.dms.dto;

import java.util.List;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private String firstName;
    private String lastName;
    private String empCode;
    private String email;
    private String phoneNumber;
    private String status;
    private List<String> roles;
    private String password;
    private boolean emailVerified;
    private List<Long> projectFileIds;
    private String image;
}

