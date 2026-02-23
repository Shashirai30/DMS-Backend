package com.rkt.dms.repository;

import com.rkt.dms.entity.UserEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // Custom query methods
    Optional<UserEntity> findByEmpCode(String empCode); // Find user by employee code

    UserEntity findByEmail(String email); // Find user by email

    boolean existsByEmail(String email); // Check if email already exists

    Page<UserEntity> findAll(Specification<UserEntity> spec, Pageable pageable);
}