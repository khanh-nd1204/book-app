package com.project.app_service.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemDTO {
  BookDTO book;
  Integer quantity;
  Double unitPrice;
  Double totalPrice;
}
