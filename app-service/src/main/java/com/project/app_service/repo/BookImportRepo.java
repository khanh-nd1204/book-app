package com.project.app_service.repo;

import com.project.app_service.model.entity.BookImportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookImportRepo
    extends JpaRepository<BookImportEntity, String>, JpaSpecificationExecutor<BookImportEntity> {}
