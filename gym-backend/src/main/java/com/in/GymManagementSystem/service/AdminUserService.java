package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminUserService {
    Page<AdminUserDTO> getAllUsersPaged(Pageable pageable);

    List<AdminUserDTO> getAllUsers();

    AdminUserDTO verifyUser(Long id);

    AdminUserDTO unverifyUser(Long id);

    void deleteUser(Long id);
}
