package com.rkt.dms.jwt.filter;

import com.rkt.dms.audit.AuditAction;
import com.rkt.dms.audit.AuditEntityType;
import com.rkt.dms.audit.AuditService;
import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import com.rkt.dms.jwt.utilis.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final AuditService auditService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String jwt = header.substring(7);

        try {

            if (!jwtUtil.validateToken(jwt)) {
                throw new AuthenticationServiceException("Invalid token");
            }

            String username = jwtUtil.extractUsername(jwt);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                CustomUserPrincipal principal =
                        (CustomUserPrincipal)
                                userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                principal.getAuthorities()
                        );

                auth.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(auth);
            }

            chain.doFilter(request, response);

        }
        catch (ExpiredJwtException ex) {

            auditService.log(
                    AuditAction.JWT_EXPIRED,
                    AuditEntityType.AUTH,
                    false
            );

            throw new AuthenticationServiceException("Token expired", ex);
        }
        catch (Exception ex) {

            auditService.log(
                    AuditAction.JWT_INVALID,
                    AuditEntityType.AUTH,
                    false
            );

            throw new AuthenticationServiceException("Invalid token", ex);
        }
    }
}
