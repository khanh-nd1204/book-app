package com.project.app_service.repo;

import com.project.app_service.model.entity.RoleEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo
    extends JpaRepository<RoleEntity, String>, JpaSpecificationExecutor<RoleEntity> {
  boolean existsByName(String name);

  Optional<RoleEntity> findByName(String name);
}
