package com.project.app_service.config;

import com.project.app_service.constant.Role;
import com.project.app_service.constant.User;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.repo.PermissionRepo;
import com.project.app_service.repo.RoleRepo;
import com.project.app_service.repo.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@Slf4j(topic = "APP-CONFIG")
public class AppInitConfig {

    @Bean
    ApplicationRunner init(
            UserRepo userRepo,
            RoleRepo roleRepo,
            PermissionRepo permissionRepo,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepo.findByName(Role.ADMIN.getName()).isEmpty()) {
                RoleEntity role = new RoleEntity();
                role.setName(Role.ADMIN.getName());
                role.setDescription(Role.ADMIN.getDescription());
                List<PermissionEntity> permissions = permissionRepo.findAll();
                role.setPermissions(permissions);
                roleRepo.save(role);
                log.info("Init role success: {}", role.getName());
            }
            if (userRepo.findByEmail(User.ADMIN.getEmail()).isEmpty()) {
                UserEntity user = new UserEntity();
                user.setEmail(User.ADMIN.getEmail());
                user.setPassword(passwordEncoder.encode(User.ADMIN.getPassword()));
                user.setName(User.ADMIN.getName());
                user.setAddress(null);
                user.setPhone(null);
                user.setActive(true);
                RoleEntity role = roleRepo.findByName(Role.ADMIN.getName()).orElse(null);
                user.setRole(role);
                userRepo.save(user);
                log.info("Init user success: {}", user.getName());
            }
        };
    }
}
