package com.project.app_service.model.entity;

import com.project.app_service.util.SecurityUtil;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "books")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookEntity {
  @Id
  @Column(name = "sku", nullable = false, unique = true, updatable = false, length = 20)
  String sku;

  @Column(name = "title", nullable = false, unique = true, length = 100)
  String title;

  @Column(name = "import_price", nullable = false)
  Double importPrice;

  @Column(name = "selling_price", nullable = false)
  Double sellingPrice;

  @Column(name = "final_price", nullable = false)
  Double finalPrice;

  @Column(name = "profit", nullable = false)
  Integer profit;

  @Column(name = "discount", nullable = false)
  Integer discount;

  @Column(name = "publish_year", nullable = false)
  Integer publishYear;

  @Column(name = "stock_quantity", nullable = false)
  Integer stockQuantity;

  @Column(name = "sold_quantity", nullable = false)
  Integer soldQuantity;

  @Column(name = "weight", nullable = false)
  Integer weight;

  @Column(name = "page_number", nullable = false)
  Integer pageNumber;

  @Column(name = "form", nullable = false) // 1:bia cung, 2:bia mem
  Integer form;

  @Column(name = "description", length = 2000)
  String description;

  @Column(name = "authors", nullable = false)
  String authors;

  @Column(name = "isbn", unique = true, length = 13)
  String isbn;

  @Column(name = "status", nullable = false) // 0:het hang, 1:con hang, -1: ngung kinh doanh
  Integer status;

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "created_by", updatable = false)
  String createdBy;

  @Column(name = "updated_at")
  Instant updatedAt;

  @Column(name = "updated_by")
  String updatedBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "publisher_id")
  PublisherEntity publisher;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "book_categories",
      joinColumns = @JoinColumn(name = "book_sku"),
      inverseJoinColumns = @JoinColumn(name = "category_id"))
  List<CategoryEntity> categories;

  @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  List<FileEntity> images;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
  List<OrderItemEntity> orderItems;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
  List<BookImportItemEntity> bookImportItems;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
  List<BookExportItemEntity> bookExportItems;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
  List<CartItemEntity> cartItems;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
    this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
    this.status = -1;
    this.discount = 0;
    this.sellingPrice = 0.0;
    this.finalPrice = 0.0;
    this.profit = 0;
    this.sku = generateSku();
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = Instant.now();
    this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
    this.updatePrice();
  }

  private String generateSku() {
    String uuid = UUID.randomUUID().toString();
    return "BOOK-" + uuid.replace("-", "").substring(0, 12).toUpperCase();
  }

  private void updatePrice() {
    this.sellingPrice = Math.floor(this.importPrice * (1 + (double) this.profit / 100));
    this.finalPrice = Math.floor(this.sellingPrice - (this.sellingPrice * this.discount / 100));
  }
}
