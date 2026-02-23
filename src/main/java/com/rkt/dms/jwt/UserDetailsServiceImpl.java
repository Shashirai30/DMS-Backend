package com.rkt.dms.jwt;

import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import com.rkt.dms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(
                    "Authentication failed");
        }

        return buildPrincipal(user);
    }

    private CustomUserPrincipal buildPrincipal(UserEntity user) {

        boolean enabled =
                "ACTIVE".equalsIgnoreCase(user.getStatus());

        return new CustomUserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
//                AuthorityUtils.createAuthorityList(
//                        user.getRoles().toArray(new String[0])
//                ),
                AuthorityUtils.createAuthorityList(
                        user.getRoles()
                                .stream()
                                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                                .toArray(String[]::new)
                ),
                enabled
        );
    }
}
