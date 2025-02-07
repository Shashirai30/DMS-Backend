package com.rkt.dms.service;

import com.rkt.dms.dto.UserDto;

public interface EmailVerification {
    Boolean verifyUser(String email);
    Boolean verificationMail(UserDto user);
}
