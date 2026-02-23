package com.rkt.dms.controller;

import com.rkt.dms.entity.EmailConfigEntity;
import com.rkt.dms.repository.EmailConfigRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@RestController
public class SendEmailController {
    
    @SuppressWarnings("unused")
    private final TemplateEngine templateEngine;
    private final EmailConfigRepository emailRepository;

    @Autowired
    public SendEmailController(TemplateEngine templateEngine, EmailConfigRepository emailRepository) {
        this.templateEngine = templateEngine;
        this.emailRepository = emailRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestParam String to, @RequestParam String confirmationUrl) {
        try {
            EmailConfigEntity emailConfig = emailRepository.findByName("DIGI-GRN");
            JavaMailSenderImpl mailSender = configureMailSender(emailConfig);
            sendVerificationEmail(mailSender, emailConfig, to, confirmationUrl);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email sent successfully. Please check your inbox to verify your email.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send email: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

    private void sendVerificationEmail(JavaMailSenderImpl mailSender, EmailConfigEntity emailConfig, String to, String confirmationUrl) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(new InternetAddress(emailConfig.getUsername(), emailConfig.getName()));
        helper.setTo(to);
        helper.setSubject("Email Verification");
        
        Context ctx = new Context(LocaleContextHolder.getLocale());
        ctx.setVariable("email", to);
        ctx.setVariable("confirmationUrl", confirmationUrl);
        
        // String htmlContent = templateEngine.process("verify-email", ctx);
        // helper.setText(htmlContent, true);
        helper.setText("Click the link to verify: " + confirmationUrl);
        
        mailSender.send(message);
    }
}
