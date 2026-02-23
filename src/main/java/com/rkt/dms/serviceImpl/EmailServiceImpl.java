package com.rkt.dms.serviceImpl;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.rkt.dms.entity.EmailConfigEntity;
import com.rkt.dms.repository.EmailConfigRepository;
import com.rkt.dms.service.EmailSendService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailSendService {
    
    @SuppressWarnings("unused")
    @Autowired
    private TemplateEngine templateEngine;
    
    @Autowired
    private EmailConfigRepository emailRepository;
    
    private JavaMailSenderImpl configureMailSender(EmailConfigEntity emailConfig) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(emailConfig.getSmtp_server());
        mailSender.setPort(emailConfig.getSmtp_port());
        mailSender.setProtocol("smtp");
        mailSender.setUsername(emailConfig.getUsername());
        mailSender.setPassword(emailConfig.getPassword());
        
        Properties properties = new Properties();
        properties.put("mail.debug", emailConfig.getDebugging());
        properties.put("mail.smtp.starttls.enable", true);
        properties.put("mail.smtp.starttls.required", true);
        properties.put("mail.smtp.auth", true);
        properties.put("mail.smtp.ssl.trust", emailConfig.getSmtp_server());
        mailSender.setJavaMailProperties(properties);
        
        return mailSender;
    }
    
    private void sendEmailTemplate(JavaMailSenderImpl mailSender, EmailConfigEntity emailConfig, String to, String subject, String confirmationUrl) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(new InternetAddress(emailConfig.getUsername(), emailConfig.getName()));
        helper.setTo(to);
        helper.setSubject(subject);
        
        Context ctx = new Context(LocaleContextHolder.getLocale());
        ctx.setVariable("email", to);
        ctx.setVariable("confirmationUrl", confirmationUrl);
        
        helper.setText("Click the link to verify: " + confirmationUrl);
        
        mailSender.send(message);
    }
    
    @Override
    public void sendEmail(String to, String confirmationUrl) throws MessagingException, UnsupportedEncodingException {
        EmailConfigEntity emailConfig = emailRepository.findByName("DIGI-GRN");
        JavaMailSenderImpl mailSender = configureMailSender(emailConfig);
        sendEmailTemplate(mailSender, emailConfig, to, "Email Verification", confirmationUrl);
    }

    @Override
    public void sendEmailForgotPassword(String to, String confirmationUrl) throws MessagingException, UnsupportedEncodingException {
        EmailConfigEntity emailConfig = emailRepository.findByName("DIGI-GRN");
        JavaMailSenderImpl mailSender = configureMailSender(emailConfig);
        sendEmailTemplate(mailSender, emailConfig, to, "Set Forgot Password", confirmationUrl);
    }
}
