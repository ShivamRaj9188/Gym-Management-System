package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import java.util.List;

public interface AdminUserService {
    List<AdminUserDTO> getAllUsers();
    AdminUserDTO verifyUser(Long id);
    AdminUserDTO unverifyUser(Long id);
    void deleteUser(Long id);
}
