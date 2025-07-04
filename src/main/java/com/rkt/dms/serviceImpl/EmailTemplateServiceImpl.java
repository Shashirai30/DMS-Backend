package com.rkt.dms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.EmailTemplateDto;
import com.rkt.dms.entity.EmailTemplateEntity;
import com.rkt.dms.repository.EmailTemplateRepository;
import com.rkt.dms.service.EmailTemplateService;


@Service
public class EmailTemplateServiceImpl implements EmailTemplateService {

    @Autowired
    private EmailTemplateRepository emailTemplateRepository;

    @Override
    public List<EmailTemplateDto> getAllEmailTemplate() {
            
        return emailTemplateRepository.findAll().stream().map(this::convertEmailTemplateEntitytoDTO).collect(Collectors.toList());

    }

    private EmailTemplateDto convertEmailTemplateEntitytoDTO(EmailTemplateEntity emailEntity){
        EmailTemplateDto emailDTO = new EmailTemplateDto();
        emailDTO.setId(emailEntity.getId());
        emailDTO.setName(emailEntity.getName());
        emailDTO.setSubject(emailEntity.getSubject());
        emailDTO.setContent(emailEntity.getContent());
        emailDTO.setCc(emailEntity.getCc());
        emailDTO.setOutgoing_mail_server(emailEntity.getOutgoing_mail_server());
        emailDTO.setSend_email(emailEntity.getSend_email());
        emailDTO.setTo_email(emailEntity.getTo_email());
        emailDTO.setHtml_content(emailEntity.getHtmlContent());
        return emailDTO;
    }

    private EmailTemplateEntity convertDTOtoEmailTemplateEntity(EmailTemplateDto emailDto){
        EmailTemplateEntity emailEntity = new EmailTemplateEntity();
        emailEntity.setName(emailDto.getName());
        emailEntity.setSubject(emailDto.getSubject());
        emailEntity.setContent(emailDto.getContent());
        emailEntity.setCc(emailDto.getCc());
        emailEntity.setOutgoing_mail_server(emailDto.getOutgoing_mail_server());
        emailEntity.setSend_email(emailDto.getSend_email());
        emailEntity.setTo_email(emailDto.getTo_email());
        emailEntity.setHtmlContent(emailDto.getHtml_content());
        return emailEntity;
    }

    @Override
    public EmailTemplateDto getEmailTemplatebyid(Long id) {
       EmailTemplateEntity emailEntity = emailTemplateRepository.findById(id).orElse(null);
        return convertEmailTemplateEntitytoDTO(emailEntity);
    }

    @Override
    public EmailTemplateDto addEmailTemplate(EmailTemplateDto params) {
       EmailTemplateEntity emailEntity = convertDTOtoEmailTemplateEntity(params);
        emailTemplateRepository.save(emailEntity);
        return convertEmailTemplateEntitytoDTO(emailEntity);
    }

    @Override
    public EmailTemplateDto updateEmailTemplate(EmailTemplateDto params, Long id) {
       EmailTemplateEntity existingEmailTemp = emailTemplateRepository.findById(id).orElse(null);

        EmailTemplateEntity paramTemp = convertDTOtoEmailTemplateEntity(params);
        existingEmailTemp.setCc(paramTemp.getCc());
        existingEmailTemp.setContent(paramTemp.getContent());
        existingEmailTemp.setName(paramTemp.getName());
        existingEmailTemp.setOutgoing_mail_server(paramTemp.getOutgoing_mail_server());
        existingEmailTemp.setSend_email(paramTemp.getSend_email());
        existingEmailTemp.setSubject(paramTemp.getSubject());
        existingEmailTemp.setTo_email(paramTemp.getTo_email());
        existingEmailTemp.setHtmlContent(paramTemp.getHtmlContent());
        emailTemplateRepository.save(existingEmailTemp);

        return convertEmailTemplateEntitytoDTO(existingEmailTemp);
    }

    @Override
    public String deleteEmailTemplate(Long id) {
        emailTemplateRepository.deleteById(id);
        return "Email Template has been Deleted";
    }
    
}
