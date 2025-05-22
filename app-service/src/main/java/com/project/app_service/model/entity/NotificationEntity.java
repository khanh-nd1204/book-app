package com.project.app_service.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(name = "user_id", nullable = false)
  String userId;

  @Column(name = "content", nullable = false)
  String content;

  @Column(name = "type", nullable = false)
  Integer type; // 1: info 2: warning 3: error

  @Column(name = "is_read", nullable = false)
  Boolean read;

  @Column(name = "created_at", nullable = false, updatable = false)
  Instant createdAt;

  @Column(name = "updated_at")
  Instant updatedAt;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
    this.read = false;
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = Instant.now();
  }
}
