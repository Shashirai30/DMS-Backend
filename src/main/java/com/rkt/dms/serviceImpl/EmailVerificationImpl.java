package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.rkt.dms.cache.SystemInformation;
import com.rkt.dms.controller.SendEmailController;
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

    @Autowired
    SystemInformation information;

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
    public Boolean verificationMail(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwt = jwtUtil.generateToken(userDetails.getUsername());
        String confirmationUrl = "http://"+information.getSystemInfo.get("ip")+":"+"8008"+"/public/verify-email?token=" + jwt;
        var check=sendEmailController.register(email, confirmationUrl);
        System.out.println(check);
        return true;
    }
}
