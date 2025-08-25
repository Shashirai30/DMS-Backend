package com.rkt.dms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EMAIL_TEMPLATE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmailTemplateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String subject;
    private String content;
    private String send_email;
    private String to_email;
    private String cc;
    private String outgoing_mail_server;
    @Column(name = "html_content")
    @Lob
    private byte[] htmlContent;
}
