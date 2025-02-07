package com.rkt.dms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.EmailConfigDto;
import com.rkt.dms.entity.EmailConfigEntity;
import com.rkt.dms.repository.EmailConfigRepository;
import com.rkt.dms.service.EmailConfigService;



@Service
public class EmailConfigServiceImpl implements EmailConfigService{

    @Autowired
    private EmailConfigRepository emailRepository;


    @Override
    public List<EmailConfigDto> getEmail(Long id) {
      if (id != null && id > 0) {
        return emailRepository.findById(id).stream().map(this::convertEmailConfigEntitytoDTO).collect(Collectors.toList());
      }
      return emailRepository.findAll().stream().map(this::convertEmailConfigEntitytoDTO).collect(Collectors.toList());
    }

    private EmailConfigDto convertEmailConfigEntitytoDTO(EmailConfigEntity emailEntity){
        EmailConfigDto emailDTO = new EmailConfigDto();
        emailDTO.setId(emailEntity.getId());
        emailDTO.setName(emailEntity.getName());
        emailDTO.setConnection(emailEntity.getConnection());
        emailDTO.setDebugging(emailEntity.getDebugging());
        emailDTO.setUsername(emailEntity.getUsername());
        emailDTO.setPassword(emailEntity.getPassword());
        emailDTO.setSmtp_port(emailEntity.getSmtp_port());
        emailDTO.setPriority(emailEntity.getPriority());
        emailDTO.setSmtp_server(emailEntity.getSmtp_server());
        return emailDTO;
    }

    private EmailConfigEntity convertDTOtoEmailConfigEntity(EmailConfigDto emailDto){
        EmailConfigEntity emailEntity = new EmailConfigEntity();
        emailEntity.setName(emailDto.getName());
        emailEntity.setConnection(emailDto.getConnection());
        emailEntity.setDebugging(emailDto.getDebugging());
        emailEntity.setUsername(emailDto.getUsername());
        emailEntity.setPassword(emailDto.getPassword());
        emailEntity.setSmtp_port(emailDto.getSmtp_port());
        emailEntity.setPriority(emailDto.getPriority());
        emailEntity.setSmtp_server(emailDto.getSmtp_server());
        return emailEntity;
    }

    @Override
    public EmailConfigDto addEmail(EmailConfigDto params) {
        EmailConfigEntity emailEntity = convertDTOtoEmailConfigEntity(params);
        emailRepository.save(emailEntity);
        return convertEmailConfigEntitytoDTO(emailEntity);
    }

    @Override
    public EmailConfigDto updateEmail(EmailConfigDto params, Long id) {
        EmailConfigEntity existingEmail = emailRepository.findById(id).orElse(null);

        EmailConfigEntity paramConfig = convertDTOtoEmailConfigEntity(params);
        existingEmail.setConnection(paramConfig.getConnection());
        existingEmail.setDebugging(paramConfig.getDebugging());
        existingEmail.setName(paramConfig.getName());
        existingEmail.setUsername(paramConfig.getUsername());
        existingEmail.setSmtp_port(paramConfig.getSmtp_port());
        existingEmail.setPriority(paramConfig.getPriority());
        existingEmail.setSmtp_server(paramConfig.getSmtp_server());
        emailRepository.save(existingEmail);

        return convertEmailConfigEntitytoDTO(existingEmail);
    }

    @Override
    public String deleteEmail(Long id) {
        emailRepository.deleteById(id);
        return "Email Config has been Deleted";
    }

    
}
