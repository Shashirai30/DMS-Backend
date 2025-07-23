package com.rkt.dms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dms_config")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConfigDMSEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id; // Unique identifier

    @Column(name = "menu_key", nullable = false, length = 100)
    @NotBlank(message = "Key is mandatory")
    @Size(max = 100, message = "Key must not exceed 100 characters")
    private String keys;

    private String value;

    private String emailIpAddress;

    private String signInUrl;
}

