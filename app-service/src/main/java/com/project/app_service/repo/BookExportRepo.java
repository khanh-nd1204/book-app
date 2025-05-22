package com.project.app_service.repo;

import com.project.app_service.model.entity.BookExportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookExportRepo
    extends JpaRepository<BookExportEntity, String>, JpaSpecificationExecutor<BookExportEntity> {}
