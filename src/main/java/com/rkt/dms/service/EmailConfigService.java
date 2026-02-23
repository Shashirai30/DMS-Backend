package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.EmailConfigDto;


public interface EmailConfigService {
    
    public List<EmailConfigDto> getEmail(Long id);

    public EmailConfigDto addEmail(EmailConfigDto params);

    public EmailConfigDto updateEmail(EmailConfigDto params, Long id);

    public String deleteEmail(Long id);
}
