package com.project.app_service.repo;

import com.project.app_service.model.entity.LogEntity;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepo
    extends JpaRepository<LogEntity, String>, JpaSpecificationExecutor<LogEntity> {
  void deleteByCreatedAtBefore(Instant instant);
}
