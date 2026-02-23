package com.rkt.dms.dto;
import java.util.List;


import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDtoById {
    private Long id;
    private String firstName;
    private String lastName;
    private String empCode;
    private String email;
    private String phoneNumber;
    private String status;
    private List<String> roles;
    private boolean emailVerified;
    private List<Long> projectFileIds;
    private String image;

    // private String password;
}
