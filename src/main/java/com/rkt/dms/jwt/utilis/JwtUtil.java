package com.rkt.dms.jwt.utilis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.rkt.dms.cache.JWTCredential;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Autowired
    private JWTCredential jwtCredential;
    // private String SECRET_KEY = "TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V";

    // private SecretKey getSigningKey() {
    //     return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    // }

    private String getSecretKey() {
        return jwtCredential.appCache.get("jwtSecret"); // Retrieve dynamically
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(getSecretKey().getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Use setSigningKey here
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    

    private Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        if (expiration == null) {
            return false; // If there is no expiration, consider it non-expired
        }
        return expiration.before(new Date());
    }
    

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // Add claims
                .setSubject(subject) // Set subject
                .setHeaderParam("typ", "JWT") // Set the "typ" header parameter explicitly
                .setIssuedAt(new Date(System.currentTimeMillis())) // Set issued date
                // .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiration time
                .signWith(getSigningKey()) // Sign with the signing key
                .compact(); // Build the token
    }
    

    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }


}
