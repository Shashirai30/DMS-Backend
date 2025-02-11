package com.rkt.dms.service;
import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserDtoById;

import java.util.List;

import org.springframework.data.domain.Page;

public interface UserService {
    List<UserDto> getUserById(Long id);

    Page<UserDtoById> getAllUsers(int page, int size, String sortBy, String sortDir, String search);

    UserDto addUser(UserDto params);

    UserDto updateUser(Long id,UserDto params);

    void deleteUser(Long id);
}
