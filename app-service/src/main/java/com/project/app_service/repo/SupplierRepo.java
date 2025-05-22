package com.project.app_service.repo;

import com.project.app_service.model.entity.SupplierEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepo
    extends JpaRepository<SupplierEntity, String>, JpaSpecificationExecutor<SupplierEntity> {
  boolean existsByName(String name);

  boolean existsByTaxCode(String taxCode);

  Optional<SupplierEntity> findByName(String name);

  Optional<SupplierEntity> findByTaxCode(String taxCode);
}
