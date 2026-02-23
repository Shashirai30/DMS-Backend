package com.rkt.dms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "email_config")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmailConfigEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "Name is mandatory")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Column(name = "priority", nullable = false)
    @Min(value = 1, message = "Priority must be at least 1")
    private int priority;

    @Column(name = "connection", length = 255)
    private String connection;

    @Column(name = "debugging")
    private Boolean debugging;

    @Column(name = "smtp_server", nullable = false, length = 200)
    @NotBlank(message = "SMTP Server is mandatory")
    @Size(max = 200, message = "SMTP Server must not exceed 200 characters")
    private String smtp_server;

    @Column(name = "smtp_port", nullable = false)
    @Min(value = 1, message = "SMTP Port must be a positive number")
    private int smtp_port;

    @Column(name = "username", nullable = false, length = 150)
    @NotBlank(message = "Username is mandatory")
    @Size(max = 150, message = "Username must not exceed 150 characters")
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    @NotBlank(message = "Password is mandatory")
    @Size(max = 255, message = "Password must not exceed 255 characters")
    private String password;

}
