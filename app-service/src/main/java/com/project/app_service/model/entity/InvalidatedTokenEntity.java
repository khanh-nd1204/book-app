package com.project.app_service.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "invalidated_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidatedTokenEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  String id;

  @Column(name = "expired_at", updatable = false)
  Instant expiredAt;
}
