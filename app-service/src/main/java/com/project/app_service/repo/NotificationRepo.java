package com.project.app_service.repo;

import com.project.app_service.model.entity.NotificationEntity;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NotificationRepo
    extends JpaRepository<NotificationEntity, String>,
        JpaSpecificationExecutor<NotificationEntity> {
  List<NotificationEntity> findAllByReadFalseAndUserId(String userId);

  void deleteByCreatedAtBefore(Instant instant);
}
