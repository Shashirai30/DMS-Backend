package com.rkt.dms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPasswordDto {
    private String email;
    private String currentPassword;
    private String newPassword;
    private String confirmNewPassword;
}
