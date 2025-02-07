package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.rkt.dms.controller.SendEmailController;
import com.rkt.dms.dto.UserDto;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.jwt.UserDetailsServiceImpl;
import com.rkt.dms.jwt.utilis.JwtUtil;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.service.EmailVerification;


@Service
public class EmailVerificationImpl implements EmailVerification {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    SendEmailController sendEmailController;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public Boolean verifyUser(String token) {
        String email = jwtUtil.extractUsername(token);
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setEmailVerified(true);
        userRepository.save(user);
        return true;
    }

    @Override 
    public Boolean verificationMail(UserDto user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwt = jwtUtil.generateToken(userDetails.getUsername());
        String confirmationUrl = "http://localhost:8081/public/verify-email?token=" + jwt;
        sendEmailController.register(user.getEmail(), confirmationUrl);
        return true;
    }
}
