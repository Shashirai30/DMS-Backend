package com.rkt.dms.service;


public interface EmailVerification {
    Boolean verifyUser(String email);
    Boolean verificationMail(String email);
}
