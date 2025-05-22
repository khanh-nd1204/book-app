package com.project.app_service.model.entity;

import com.project.app_service.util.SecurityUtil;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  String id;

  @Column(name = "name", nullable = false, length = 100)
  String name;

  @Column(name = "email", length = 100)
  String email;

  @Column(name = "address", nullable = false, length = 100)
  String address;

  @Column(name = "phone", nullable = false, length = 10)
  String phone;

  @Column(name = "total_price", nullable = false)
  Double totalPrice;

  @Column(name = "method", nullable = false, length = 100)
  Integer method; // 1: Tien mat 2: Thanh toan vnpay 3: Nhan tai cua hang

  @Column(name = "is_payment")
  Boolean isPayment;

  @Column(name = "vnp_txn_ref")
  String vnpTxnRef;

  @Column(name = "status", nullable = false)
  // 1: Chờ xác nhận 2: Đã xác nhận 3: Đang giao, 4: Chờ nhận hàng 5: Đã giao
  // 0: Đã hủy -1: Từ chối
  Integer status;

  @Column(name = "confirmed_at")
  Instant confirmedAt;

  @Column(name = "delivered_at")
  Instant deliveredAt;

  @Column(name = "canceled_at")
  Instant canceledAt;

  @Column(name = "rejected_at")
  Instant rejectedAt;

  @Column(name = "note", length = 500)
  String note;

  @Column(name = "reason", length = 500)
  String reason;

  @Column(name = "invoice", nullable = false)
  Integer invoice; // 0: Không, 1: Có

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "created_by", updatable = false)
  String createdBy;

  @Column(name = "updated_by")
  String updatedBy;

  @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  List<OrderItemEntity> orderItems;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
    this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
    this.status = 1;
    this.id = generateId();
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
  }

  private String generateId() {
    String uuid = UUID.randomUUID().toString();
    return uuid.replace("-", "").substring(0, 16).toUpperCase();
  }
}
