package com.project.app_service.repo;

import com.project.app_service.model.entity.FileEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepo extends JpaRepository<FileEntity, String> {
  @Query("SELECT f.id FROM FileEntity f WHERE f.book IS NOT NULL")
  List<String> findUsedFileIdsFromBook();
}
