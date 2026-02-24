package com.rkt.dms.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

//    @JsonIgnore
//    private Long id;

    private String firstName;
    private String lastName;
    private String empCode;
    private String email;
    private String phoneNumber;
    private String status;

    private List<String> roles;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private boolean emailVerified;
    private List<Long> projectFileIds;
    private String image;

//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
//    private Long departmentId;
//
//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
//    private Long roleId;
}
