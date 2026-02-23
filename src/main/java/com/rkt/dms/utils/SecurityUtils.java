package com.rkt.dms.utils;

import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.Collections;

public final class SecurityUtils {

    private SecurityUtils() {

    }

    private static Authentication getAuthentication() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication();
    }


    private static CustomUserPrincipal getPrincipal() {

        Authentication auth = getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();

        return (principal instanceof CustomUserPrincipal user)
                ? user
                : null;
    }


    public static String getCurrentUsername() {

        CustomUserPrincipal principal = getPrincipal();

        if (principal != null) {
            return principal.getUsername();
        }

        Authentication auth = getAuthentication();

        return (auth != null) ? auth.getName() : null;
    }

    public static Collection<? extends GrantedAuthority> getCurrentUserRoles() {

        Authentication auth = getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return Collections.emptyList();
        }

        return auth.getAuthorities();
    }

    public static boolean isAdmin() {

        Authentication auth = getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return auth.getAuthorities()
                .stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }


    public static Long getCurrentUserId() {

        CustomUserPrincipal principal = getPrincipal();

        return principal != null
                ? principal.getUserId()
                : null;
    }

    public static String getCurrentUserEmail() {

        CustomUserPrincipal principal = getPrincipal();

        if (principal != null) {
            return principal.getEmail();
        }

        return "SYSTEM";
    }

    public static boolean isAuthenticated() {

        return getPrincipal() != null;
    }

    public static String getActor() {

        CustomUserPrincipal principal = getPrincipal();

        return principal != null
                ? principal.getUserId() + " | " + principal.getEmail()
                : "SYSTEM";
    }

}
