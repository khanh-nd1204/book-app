package com.project.app_service.model.entity;

import com.project.app_service.util.SecurityUtil;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "book_exports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookExportEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false, length = 20)
  String id;

  @Column(name = "total_cost", nullable = false)
  Double totalCost;

  @Column(name = "note", length = 200)
  String note;

  @Column(name = "reason", length = 200)
  String reason;

  @Column(name = "status", nullable = false)
  Boolean status;

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "created_by", updatable = false)
  String createdBy;

  @Column(name = "updated_at")
  Instant updatedAt;

  @Column(name = "updated_by")
  String updatedBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "supplier_id")
  SupplierEntity supplier;

  @OneToMany(mappedBy = "bookExport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  List<BookExportItemEntity> BookExportItems;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
    this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
    this.status = true;
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = Instant.now();
    this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
  }
}
