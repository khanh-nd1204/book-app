package com.project.app_service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Entity
@Table(name = "files")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Component
public class FileEntity {
  @Id
  @Column(name = "id", nullable = false, unique = true, updatable = false)
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(name = "url", nullable = false)
  String url;

  @Column(name = "folder", nullable = false)
  String folder;

  @ManyToOne
  @JoinColumn(name = "book_sku")
  BookEntity book;

  @OneToOne
  @JoinColumn(name = "category_id")
  CategoryEntity category;
}
