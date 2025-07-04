package com.rkt.dms.dto;

import lombok.Data;

@Data
public class EmailTemplateDto {
    private long id;
    private String name;
    private String subject;
    private String content;
    private String send_email;
    private String to_email;
    private String cc;
    private String outgoing_mail_server;
    private byte[] html_content;
}
