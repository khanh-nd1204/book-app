package com.project.app_service.repo;

import com.project.app_service.model.entity.CategoryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo
    extends JpaRepository<CategoryEntity, String>, JpaSpecificationExecutor<CategoryEntity> {
  boolean existsByName(String name);

  boolean existsBySymbol(String symbol);

  Optional<CategoryEntity> findByName(String name);

  Optional<CategoryEntity> findBySymbol(String symbol);

  @Query("SELECT c.image.id FROM CategoryEntity c WHERE c.image IS NOT NULL")
  List<String> findUsedFileIdsFromCategory();
}
