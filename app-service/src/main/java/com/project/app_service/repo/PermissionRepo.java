package com.project.app_service.repo;

import com.project.app_service.model.entity.PermissionEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepo
    extends JpaRepository<PermissionEntity, String>, JpaSpecificationExecutor<PermissionEntity> {
  boolean existsByApiPathAndMethodAndModule(String apiPath, String method, String module);

  boolean existsByName(String name);

  Optional<PermissionEntity> findByName(String name);

  Optional<PermissionEntity> findByApiPathAndMethodAndModule(
      String apiPath, String method, String module);
}
