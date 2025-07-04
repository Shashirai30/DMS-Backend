package com.rkt.dms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.authDto.LoginRequestDto;
import com.rkt.dms.dto.responseDto.JwtResponse;
import com.rkt.dms.jwt.UserDetailsServiceImpl;
import com.rkt.dms.jwt.utilis.JwtUtil;
import com.rkt.dms.mapper.UserMapper;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.EmailVerification;
import com.rkt.dms.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/public")
@Slf4j
public class PublicController {

    @Autowired
    UserService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailVerification emailVerificationl;

    @GetMapping("/health-check")
    public ResponseEntity<?> healthCheck() {
        log.info("/health-check");
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto params) {
        log.info("/create-user");
        var result = service.addUser(params); // Save user logic
        return ResponseHandler.generateResponse("User created successfully",
                HttpStatus.CREATED, result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto user) {
        log.info("/login");
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

            var ckeckUser = userRepository.findByEmail(user.getEmail());
            if (!ckeckUser.isEmailVerified()) {
                return ResponseHandler.generateResponse("Please verifiy Email", HttpStatus.UNAUTHORIZED, null);
            }
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            return ResponseEntity
                    .ok(new JwtResponse(jwt, userMapper.toDto(userRepository.findByEmail(user.getEmail()))));
        } catch (BadCredentialsException e) {
            log.error("User not found: " + e);
            return ResponseHandler.generateResponse("Incorrect username or password", HttpStatus.UNAUTHORIZED, null);
        } catch (DisabledException e) {
            log.error("User is disabled: " + e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, null);
        } catch (Exception e) {
            log.error("Exception occurred while createAuthenticationToken ", e);
            return ResponseHandler.generateResponse("Incorrect username or password", HttpStatus.UNAUTHORIZED, null);
        }
    }

    @GetMapping("/verify-email")
    public String verifyEmail(@RequestParam String token, Model model) {
        log.info("/verify-email");
        try {
            // Mark user as verified in DB
            var result = emailVerificationl.verifyUser(token);
            if (result) {
                model.addAttribute("message", "Your account has been verified successfully.");
            } else {
                model.addAttribute("message", "Invalid verification token.");
            }
            return "verify-email";
        } catch (Exception e) {
            log.info("Exception occurred while verify-email", e);
            return e.getMessage();
        }
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        service.forgotPassword(email);
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        service.resetForgotPassword(token, newPassword);
        return ResponseEntity.ok("Password successfully reset.");
    }

}
