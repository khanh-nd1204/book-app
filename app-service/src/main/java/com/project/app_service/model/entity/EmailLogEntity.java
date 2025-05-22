package com.project.app_service.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "email_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailLogEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(name = "recipient", nullable = false, length = 100)
  String recipient;

  @Column(name = "subject", nullable = false, length = 100)
  String subject;

  @Column(name = "template", nullable = false, length = 100)
  String template;

  @Column(name = "status", nullable = false)
  Integer status; // -1: fail, 0: pending, 1: send

  @Column(name = "validity")
  Instant validity;

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "updated_at")
  Instant updatedAt;

  @PrePersist
  public void prePersist() {
    this.createdAt = Instant.now();
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = Instant.now();
  }
}
