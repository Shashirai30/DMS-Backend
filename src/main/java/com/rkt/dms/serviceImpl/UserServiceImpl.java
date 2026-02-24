package com.rkt.dms.serviceImpl;

import com.rkt.dms.audit.*;
import com.rkt.dms.audit.Auditable;
import com.rkt.dms.dto.*;
import com.rkt.dms.entity.*;
import com.rkt.dms.exception.customexception.UserNotFoundException;
import com.rkt.dms.mapper.UserMapper;
import com.rkt.dms.repository.*;
import com.rkt.dms.service.*;
import com.rkt.dms.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
@EnableSpringDataWebSupport(
        pageSerializationMode =
                EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO
)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final EmailVerification emailVerification;
    private final PasswordForgotTokenRepository tokenRepository;
    private final ProjectFilesRepository projectFilesRepository;
    private final EmailSendService emailService;
    private final PasswordEncoder encoder;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;


    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public UserDto getUserById(Long id) {

        return userRepository.findById(id).map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public Page<UserDtoById> getAllUsers(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search) {

        Sort sort = Sort.by(sortBy);

        sort = sortDir.equalsIgnoreCase("asc")
                ? sort.ascending()
                : sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return userRepository
                .findAll(searchByEmailOrEmpCode(search), pageable)
                .map(userMapper::toDtoById);
    }

    private static Specification<UserEntity> searchByEmailOrEmpCode(String search) {

        return (root, query, cb) -> {

            if (search == null || search.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + search.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("empCode")), pattern)
            );
        };
    }

    // ================= CREATE =================

    @Override
    @Auditable(
            action = AuditAction.USER_CREATE,
            entityType = AuditEntityType.USER
    )
    public UserDto addUser(UserDto params) {

        if (userRepository.existsByEmail(params.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

//        // ---------- Validate Department ----------
//        DepartmentEntity department =
//                departmentRepository.findById(params.getDepartmentId())
//                        .orElseThrow(() ->
//                                new IllegalArgumentException("Invalid departmentId"));
//
//        // ---------- Validate Role ----------
//        RoleEntity role =
//                roleRepository.findById(params.getRoleId())
//                        .orElseThrow(() ->
//                                new IllegalArgumentException("Invalid roleId"));
//
//        // ---------- Ensure role belongs to department ----------
//        if (!role.getDepartment().getId().equals(department.getId())) {
//            throw new IllegalArgumentException(
//                    "Role does not belong to the given department");
//        }
//
//        // ---------- Map role to user ----------
//        params.setRoles(List.of(role.getName()));
        params.setPassword(encoder.encode(params.getPassword()));

        UserEntity savedUser =
                userRepository.save(userMapper.toEntity(params));

        emailVerification.verificationMail(savedUser.getEmail());

        return userMapper.toDto(savedUser);
    }




    @Override
    @Auditable(
            action = AuditAction.USER_UPDATE,
            entityType = AuditEntityType.USER,
            entityIdParam = "id"
    )
    public UserDto updateUser(Long id, UserDto params) {

        boolean isAdmin = SecurityUtils.isAdmin();

        UserEntity targetUser;

        if (id != null && id > 0) {

            targetUser = userRepository.findById(id)
                    .orElseThrow(() ->
                            new UserNotFoundException("User not found"));

            if (!isAdmin) {
                throw new SecurityException(
                        "You do not have permission to update other users.");
            }

        } else {

            targetUser = userRepository.findByEmail(
                    SecurityUtils.getCurrentUserEmail()
            );

            if (targetUser == null) {
                throw new UserNotFoundException("Current user not found");
            }
        }

        applyBasicUpdates(targetUser, params);

        if (isAdmin) {
            applyAdminUpdates(targetUser, params);
        }

        return userMapper.toDto(
                userRepository.save(targetUser)
        );
    }

    private void applyBasicUpdates(UserEntity user, UserDto params) {

        Optional.ofNullable(params.getFirstName()).ifPresent(user::setFirstName);
        Optional.ofNullable(params.getLastName()).ifPresent(user::setLastName);
        Optional.ofNullable(params.getPhoneNumber()).ifPresent(user::setPhoneNumber);
        Optional.ofNullable(params.getImage()).ifPresent(user::setImage);
    }

    private void applyAdminUpdates(UserEntity user, UserDto params) {


//        if (params.getDepartmentId() != null && params.getRoleId() != null) {
//
//            DepartmentEntity department =
//                    departmentRepository.findById(params.getDepartmentId())
//                            .orElseThrow(() ->
//                                    new IllegalArgumentException("Invalid departmentId"));
//
//            RoleEntity role =
//                    roleRepository.findById(params.getRoleId())
//                            .orElseThrow(() ->
//                                    new IllegalArgumentException("Invalid roleId"));
//
//            if (!role.getDepartment().getId().equals(department.getId())) {
//                throw new IllegalArgumentException(
//                        "Role does not belong to the given department");
//            }

//            user.setRoles(List.of(role.getName()));
//        }

        Optional.ofNullable(params.getRoles())
                .filter(roles -> !roles.isEmpty())
                .ifPresent(user::setRoles);


        Optional.ofNullable(params.getStatus())
                .filter(s -> !s.isEmpty())
                .ifPresent(user::setStatus);

        Optional.ofNullable(params.getProjectFileIds())
                .ifPresent(folderIds ->
                        user.setProjectFiles(
                                projectFilesRepository.findAllById(folderIds)
                        )
                );
    }



    @Override
    @Auditable(
            action = AuditAction.USER_DELETE,
            entityType = AuditEntityType.USER,
            entityIdParam = "id"
    )
    public void deleteUser(Long id) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        userRepository.delete(user);
    }


    @Override
    @Auditable(
            action = AuditAction.PASSWORD_RESET_SET,
            entityType = AuditEntityType.AUTH
    )
    public UserDto resetPassword(UserPasswordDto params) {

        if (!params.getNewPassword()
                .equals(params.getConfirmNewPassword())) {

            throw new IllegalArgumentException("Passwords do not match");
        }

        UserEntity currentUser = userRepository.findByEmail(
                SecurityUtils.getCurrentUserEmail()
        );

        if (currentUser == null) {
            throw new UserNotFoundException("User not found");
        }

        if (!encoder.matches(
                params.getCurrentPassword(),
                currentUser.getPassword())) {

            throw new SecurityException("Current password is incorrect");
        }

        currentUser.setPassword(
                encoder.encode(params.getNewPassword())
        );

        return userMapper.toDto(
                userRepository.save(currentUser)
        );
    }

    // ================= TOKEN RESET =================

    @Override
    @Auditable(
            action = AuditAction.PASSWORD_RESET_TOKEN,
            entityType = AuditEntityType.AUTH
    )
    public void resetForgotPassword(String token, String newPassword) {

        PasswordForgotToken resetToken =
                tokenRepository.findByToken(token)
                        .filter(t ->
                                !t.getExpiryDate()
                                        .isBefore(LocalDateTime.now()))
                        .orElseThrow(() ->
                                new IllegalArgumentException("Invalid or expired token"));

        UserEntity user = resetToken.getUser();

        user.setPassword(encoder.encode(newPassword));

        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

    // ================= FORGOT PASSWORD =================

    @Override
    @Auditable(
            action = AuditAction.PASSWORD_RESET_REQUEST,
            entityType = AuditEntityType.AUTH
    )
    public void forgotPassword(String email) {

        UserEntity user = Optional
                .ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        String token = UUID.randomUUID().toString();

        PasswordForgotToken resetToken = new PasswordForgotToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

        tokenRepository.save(resetToken);

        try {

            String resetLink =
                    "http://localhost:8081/public/reset-password?token=" + token;

            emailService.sendEmailForgotPassword(
                    user.getEmail(),
                    resetLink
            );

        } catch (Exception ex) {

            log.error("Failed to send forgot password email", ex);

            throw new IllegalStateException("Email sending failed");
        }
    }
}
