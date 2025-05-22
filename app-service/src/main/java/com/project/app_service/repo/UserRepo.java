package com.project.app_service.repo;

import com.project.app_service.model.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo
    extends JpaRepository<UserEntity, String>, JpaSpecificationExecutor<UserEntity> {
  boolean existsByEmail(String email);

  boolean existsByPhone(String phone);

  Optional<UserEntity> findByEmail(String email);

  Optional<UserEntity> findByPhone(String phone);

  Optional<UserEntity> findByEmailAndRefreshToken(String email, String refreshToken);

  Optional<UserEntity> findByRoleName(String roleName);
}
