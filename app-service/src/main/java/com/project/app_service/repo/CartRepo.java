package com.project.app_service.repo;

import com.project.app_service.model.entity.CartEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<CartEntity, String> {
  Optional<CartEntity> findByUserId(String userId);
}
