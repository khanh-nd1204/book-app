package com.project.app_service.repo;

import com.project.app_service.model.entity.InvalidatedTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepo extends JpaRepository<InvalidatedTokenEntity, String> {}
