package com.rkt.dms.service;
import com.rkt.dms.dto.UserDto;
import com.rkt.dms.dto.UserDtoById;
import com.rkt.dms.dto.UserPasswordDto;

import java.util.List;

import org.springframework.data.domain.Page;

public interface UserService {
    //List<UserDto> getUserById(Long id);

    UserDto getUserById(Long id);

    Page<UserDtoById> getAllUsers(int page, int size, String sortBy, String sortDir, String search);

    UserDto resetPassword(UserPasswordDto params);

    void forgotPassword(String email);

    void resetForgotPassword(String token, String newPassword);

    UserDto addUser(UserDto params);

    UserDto updateUser(Long id,UserDto params);

    void deleteUser(Long id);
}
