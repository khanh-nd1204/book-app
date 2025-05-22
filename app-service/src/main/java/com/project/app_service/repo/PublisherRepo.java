package com.project.app_service.repo;

import com.project.app_service.model.entity.PublisherEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PublisherRepo
    extends JpaRepository<PublisherEntity, String>, JpaSpecificationExecutor<PublisherEntity> {
  boolean existsByName(String name);

  Optional<PublisherEntity> findByName(String name);
}
