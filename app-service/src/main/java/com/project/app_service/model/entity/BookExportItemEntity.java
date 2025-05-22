package com.project.app_service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "book_export_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookExportItemEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_export_id", nullable = false)
  BookExportEntity bookExport;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_sku", nullable = false)
  BookEntity book;

  @Column(name = "quantity", nullable = false)
  Integer quantity;

  @Column(name = "unit_price", nullable = false)
  Double unitPrice;

  @Column(name = "total_cost", nullable = false)
  Double totalCost;
}
