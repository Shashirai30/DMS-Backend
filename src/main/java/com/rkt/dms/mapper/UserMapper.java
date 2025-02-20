package com.rkt.dms.mapper;

import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserDtoById;
import com.rkt.dms.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserEntity toEntity(UserDto dto) {
        return new UserEntity(
                null, // Assuming ID is auto-generated
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmpCode(),
                dto.getEmail(),
                dto.getPhoneNumber(),
                dto.getStatus(),
                dto.getImage(),
                dto.getRoles(),
                dto.getPassword(),
                dto.isEmailVerified());
    }

    public UserDto toDto(UserEntity entity) {
        return new UserDto(
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmpCode(),
                entity.getEmail(),
                entity.getPhoneNumber(),
                entity.getStatus(),
                entity.getImage(),
                entity.getRoles(),
                entity.getPassword(),
                entity.isEmailVerified());
    }

    public UserDtoById toDtoById(UserEntity entity) {
        return new UserDtoById(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmpCode(),
                entity.getEmail(),
                entity.getPhoneNumber(),
                entity.getStatus(),
                entity.getImage(),
                entity.getRoles(),
                entity.isEmailVerified());
                // entity.getPassword());
    }
}
