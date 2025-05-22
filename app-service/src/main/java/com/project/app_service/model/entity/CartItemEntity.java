package com.project.app_service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  String id;

  @Column(name = "quantity", nullable = false)
  Integer quantity;

  @Column(name = "unit_price", nullable = false)
  Double unitPrice;

  @Column(name = "total_price", nullable = false)
  Double totalPrice;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cart_id", nullable = false)
  CartEntity cart;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_sku", nullable = false)
  BookEntity book;
}
