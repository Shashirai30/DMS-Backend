package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.EmailTemplateDto;


public interface EmailTemplateService {
    public List<EmailTemplateDto> getAllEmailTemplate();

    public EmailTemplateDto getEmailTemplatebyid(Long id);

    public EmailTemplateDto addEmailTemplate(EmailTemplateDto params);

    public EmailTemplateDto updateEmailTemplate(EmailTemplateDto params, Long id);

    public String deleteEmailTemplate(Long id);
}
