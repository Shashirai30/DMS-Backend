package com.rkt.dms.mapper;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserDtoById;
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.jwt.principal.CustomUserPrincipal;
import com.rkt.dms.repository.ProjectFilesRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    @Autowired
    private ProjectFilesRepository projectFilesRepository;

    public UserEntity toEntity(UserDto dto) {
        UserEntity user = UserEntity.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .empCode(dto.getEmpCode())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .status(dto.getStatus())
                .image(dto.getImage())
                .roles(dto.getRoles())
                .password(dto.getPassword())
                .emailVerified(dto.isEmailVerified())
                .build();

        user.setProjectFiles(new ArrayList<>()); // default
        if (dto.getProjectFileIds() != null && !dto.getProjectFileIds().isEmpty()) {
            List<ProjectFilesEntity> projectFiles = projectFilesRepository.findAllById(dto.getProjectFileIds());
            user.setProjectFiles(projectFiles);
        }

        return user;
    }

    public UserDto toDto(UserEntity entity) {
        return UserDto.builder()
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .empCode(entity.getEmpCode())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .status(entity.getStatus())
                .image(entity.getImage())
                .roles(entity.getRoles())
                .password(entity.getPassword())
                .emailVerified(entity.isEmailVerified())
                .projectFileIds(entity.getProjectFiles()
                        .stream()
                        .map(ProjectFilesEntity::getId)
                        .collect(Collectors.toList()))
                .build();
    }

    public UserDtoById toDtoById(UserEntity entity) {
        return UserDtoById.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .empCode(entity.getEmpCode())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .status(entity.getStatus())
                .roles(entity.getRoles())
                .emailVerified(entity.isEmailVerified())
                .image(entity.getImage())
                .projectFileIds(entity.getProjectFiles()
                        .stream()
                        .map(ProjectFilesEntity::getId)
                        .collect(Collectors.toList()))
                .build();
    }

//    public UserDto toDtoFromPrincipal(CustomUserPrincipal p) {
//
//        UserDto dto = new UserDto();
//        dto.setEmail(p.getEmail());
//        dto.setId(p.getUserId());
//        return dto;
//    }


}
