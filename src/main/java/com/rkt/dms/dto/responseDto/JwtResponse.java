package com.rkt.dms.dto.responseDto;

import com.rkt.dms.dto.UserDto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponse {
    // String username;
    String token;
    // String refreshToken;
//    UserEntity userInfo;
    UserDto userInfo;
}