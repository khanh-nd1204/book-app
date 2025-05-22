package com.project.app_service.model.entity;

import com.project.app_service.util.SecurityUtil;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString(exclude = {"password", "refreshToken"})
public class UserEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(name = "name", nullable = false, length = 100)
  String name;

  @Column(name = "email", nullable = false, unique = true, updatable = false, length = 100)
  String email;

  @Column(name = "password", nullable = false)
  String password;

  @Column(name = "address", length = 100)
  String address;

  @Column(name = "phone", unique = true, length = 10)
  String phone;

  @Column(name = "refresh_token", length = 1000)
  String refreshToken;

  @Column(name = "otp")
  Integer otp;

  @Column(name = "otp_validity")
  Instant otpValidity;

  @Column(name = "google_id")
  String googleId;

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "created_by", updatable = false)
  String createdBy;

  @Column(name = "updated_at")
  Instant updatedAt;

  @Column(name = "updated_by")
  String updatedBy;

  @Column(name = "active", nullable = false)
  Boolean active;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id")
  RoleEntity role;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "cart_id")
  CartEntity cart;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
    this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = Instant.now();
    this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("SYSTEM");
  }
}
