package com.rkt.dms.dto;

import lombok.Data;

@Data
public class EmailConfigDto {
    private long id;
    private String name;
    private int priority;
    private String connection;
    private Boolean debugging;
    private String smtp_server;
    private int smtp_port;
    private String username;
    private String password;
}
