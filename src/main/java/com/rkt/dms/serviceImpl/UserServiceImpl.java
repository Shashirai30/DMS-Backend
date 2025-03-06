package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserDtoById;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.exception.customexception.UserNotFoundException;
import com.rkt.dms.mapper.UserMapper;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.service.EmailVerification;
import com.rkt.dms.service.UserService;
import com.rkt.dms.utils.SecurityUtils;

import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    EmailVerification emailVerification;

    @Override
    public List<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .stream()
                .toList(); // Convert single result to a list
    }

    @Override
    public Page<UserDtoById> getAllUsers(int page, int size, String sortBy, String sortDir, String search) {
        // Create Sort object based on sort direction
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // Create Pageable object
        Pageable pageable = PageRequest.of(page, size, sort);

        // Build Specification for filtering
        Specification<UserEntity> spec = searchByEmailOrEmpCode(search);

        // Fetch filtered and paginated data from repository
        Page<UserEntity> userEntities = userRepository.findAll(spec, pageable);

        // Map UserEntity to UserDto using Page.map()
        return userEntities.map(userMapper::toDtoById);
    }

    /**
     * Returns a Specification to filter users by email or empCode using a
     * case-insensitive search.
     *
     * @param search The keyword to search in email or empCode (partial match).
     * @return A Specification for filtering users based on the search keyword.
     */
    public static Specification<UserEntity> searchByEmailOrEmpCode(String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("empCode")), searchPattern)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    public UserDto addUser(UserDto params) {
        if (userRepository.existsByEmail(params.getEmail())) {
            log.error("Email already exists!");
            throw new RuntimeException("Email already exists!");
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        // params.setStatus("ACTIVE");
        params.setPassword(encoder.encode(params.getPassword()));
        UserEntity savedUser = userRepository.save(userMapper.toEntity(params));
        // emailVerification.verificationMail(params);
        return userMapper.toDto(savedUser);
    }

    @Override
    public UserDto updateUser(Long id, UserDto params) {
        String currentUsername = SecurityUtils.getCurrentUsername(); // Retrieve the current user's username
        boolean isAdmin = SecurityUtils.isAdmin(); // Check if the current user has ADMIN role

        System.out.println(params.getImage());
        if (id > 0) {
            // Admin case: Fetch the user to be updated by ID
            UserEntity userToUpdate = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found."));

            if (isAdmin) {
                // Admin updates any user's data (including their own)
                updateAdminFields(userToUpdate, params);
                updateBasicInfo(userToUpdate, params);
            } else {
                throw new UserNotFoundException("You do not have permission to update other users' data.");
            }

            return userMapper.toDto(userRepository.save(userToUpdate));
        } else {
            // User case: Fetch the current user's entity
            UserEntity currentUser = userRepository.findByEmail(currentUsername);
            if (currentUser == null) {
                throw new UserNotFoundException("Current user not found.");
            }

            // Allow user to update only their own basic information
            updateBasicInfo(currentUser, params);
            if (isAdmin) {
                // Admin updates any user's data (including their own)
                updateAdminFields(currentUser, params);
            }

            return userMapper.toDto(userRepository.save(currentUser));
        }
    }

    private void updateBasicInfo(UserEntity user, UserDto params) {
        Optional.ofNullable(params.getFirstName()).ifPresent(user::setFirstName);
        Optional.ofNullable(params.getLastName()).ifPresent(user::setLastName);
        Optional.ofNullable(params.getPhoneNumber()).ifPresent(user::setPhoneNumber);
        Optional.ofNullable(params.getImage()).ifPresent(user::setImage);
    }

    private void updateAdminFields(UserEntity user, UserDto params) {
        // BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Optional.ofNullable(params.getPassword())
        // .filter(password -> !password.isEmpty())
        // .ifPresent(password -> user.setPassword(passwordEncoder.encode(password)));

        Optional.ofNullable(params.getRoles())
                .filter(roles -> !roles.isEmpty())
                .ifPresent(user::setRoles);

        Optional.ofNullable(params.getStatus())
                .filter(status -> !status.isEmpty())
                .ifPresent(user::setStatus);
    }

    @Override
    public void deleteUser(Long id) {

    }
}
