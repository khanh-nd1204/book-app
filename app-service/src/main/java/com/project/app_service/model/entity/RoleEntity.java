package com.project.app_service.model.entity;

import com.project.app_service.util.SecurityUtil;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "roles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString(exclude = "permissions")
public class RoleEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(name = "name", nullable = false, unique = true, length = 100)
  String name;

  @Column(name = "description", nullable = false, length = 100)
  String description;

  @Column(name = "created_at", updatable = false)
  Instant createdAt;

  @Column(name = "created_by", updatable = false)
  String createdBy;

  @Column(name = "updated_at")
  Instant updatedAt;

  @Column(name = "updated_by")
  String updatedBy;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "role_permissions",
      joinColumns = @JoinColumn(name = "role_id"),
      inverseJoinColumns = @JoinColumn(name = "permission_id"))
  List<PermissionEntity> permissions;

  @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
  List<UserEntity> users;

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
