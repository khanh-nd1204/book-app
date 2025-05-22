package com.project.app_service.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookDTO {
  String sku;
  String title;
  String isbn;
  String thumbnail;
  Integer stockQuantity;
  Double finalPrice;
}
