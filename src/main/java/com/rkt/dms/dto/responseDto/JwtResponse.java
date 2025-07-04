package com.rkt.dms.dto.responseDto;

import com.rkt.dms.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    // String username;
    String token;
    // String refreshToken;
//    UserEntity userInfo;
    UserDto userInfo;
}