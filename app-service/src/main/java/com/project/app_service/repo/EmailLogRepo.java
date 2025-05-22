package com.project.app_service.repo;

import com.project.app_service.model.entity.EmailLogEntity;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepo extends JpaRepository<EmailLogEntity, String> {
  List<EmailLogEntity> findByStatusAndValidityIsBefore(Integer status, Instant validity);

  List<EmailLogEntity> findByStatusOrValidityIsAfter(Integer status, Instant validity);
}
