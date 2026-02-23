package com.rkt.dms.jwt.utilis;

import com.rkt.dms.cache.JWTCredential;
import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JWTCredential jwtCredential;

    private SecretKey signingKey;

    private static final long AUTH_TOKEN_EXP = 900000;      // 15 min
    private static final long VERIFY_TOKEN_EXP = 86400000;  // 24 hrs

    @PostConstruct
    public void initSigningKey() {

        String secret = jwtCredential.appCache.get("jwtSecret");

        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                    "JWT secret missing or too weak. Must be at least 32 characters.");
        }

        signingKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8));
    }

    // ================= TOKEN GENERATION =================

    public String generateToken(CustomUserPrincipal principal) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", principal.getUserId());
        claims.put("type", "AUTH");

        return createToken(claims, principal.getUsername(), AUTH_TOKEN_EXP);
    }


    public String generateVerificationToken(String email) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "VERIFY");

        return createToken(claims, email, VERIFY_TOKEN_EXP);
    }

    private String createToken(
            Map<String, Object> claims,
            String subject,
            long expirationMs) {

        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    // ================= CLAIM EXTRACTION =================

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("uid", Long.class);
    }

    public String extractTokenType(String token) {
        return extractAllClaims(token).get("type", String.class);
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ================= VALIDATION =================

    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

    private Boolean isTokenExpired(String token) {

        Date expiration = extractAllClaims(token).getExpiration();

        return expiration != null && expiration.before(new Date());
    }
}
