package com.rkt.dms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rkt.dms.entity.PasswordForgotToken;

@Repository
public interface PasswordForgotTokenRepository extends JpaRepository<PasswordForgotToken, Long> {
    Optional<PasswordForgotToken> findByToken(String token);
}
