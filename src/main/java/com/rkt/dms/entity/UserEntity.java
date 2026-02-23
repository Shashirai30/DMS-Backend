package com.rkt.dms.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key (optional, for internal purposes)

    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank(message = "First name is mandatory")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    @NotBlank(message = "Last name is mandatory")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Column(name = "emp_code", unique = true, nullable = false, length = 50)
    @NotBlank(message = "Employee code is mandatory")
    @Size(max = 50, message = "Employee code must not exceed 50 characters")
    private String empCode;

    @Column(name = "email", unique = true, nullable = false, length = 150)
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Column(name = "phone_number", length = 15)
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phoneNumber;

    @Column(name = "status", nullable = false, length = 20)
    @NotBlank(message = "Status is mandatory")
    @Size(max = 20, message = "Status must not exceed 20 characters")
    @Builder.Default
    private String status = "ACTIVE";

    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image; // Base64-encoded image data

    @ElementCollection(fetch = FetchType.EAGER) // Map the roles as a collection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role") // Column name for each role in the collection
    private List<String> roles;


    // @Transient
    @Size(min = 3, message = "Password must be at least 3 characters long")
    @Column(name = "password")
    private String password; // Password stored as a char array

    @Column(name = "emailVerified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false; // Default value

    @ManyToMany
    @JoinTable(name = "user_project_files", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "project_file_id"))
    private List<ProjectFilesEntity> projectFiles = new ArrayList<>();




}
