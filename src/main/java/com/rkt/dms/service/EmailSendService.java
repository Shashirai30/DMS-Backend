package com.rkt.dms.service;

import java.io.UnsupportedEncodingException;

import jakarta.mail.MessagingException;

public interface EmailSendService {
    void sendEmail(String to, String confirmationUrl) throws MessagingException, UnsupportedEncodingException;
    void sendEmailForgotPassword(String to, String confirmationUrl) throws MessagingException, UnsupportedEncodingException;
}