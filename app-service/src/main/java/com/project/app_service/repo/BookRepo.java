package com.project.app_service.repo;

import com.project.app_service.model.entity.BookEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepo
    extends JpaRepository<BookEntity, String>, JpaSpecificationExecutor<BookEntity> {
  boolean existsByTitle(String title);

  boolean existsByIsbn(String isbn);

  Optional<BookEntity> findByTitle(String title);

  Optional<BookEntity> findByIsbn(String isbn);

  List<BookEntity> findByStatusAndStockQuantityLessThanEqual(int status, int stockQuantity);
}
