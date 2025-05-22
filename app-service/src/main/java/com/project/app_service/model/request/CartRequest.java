package com.project.app_service.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
  @NotNull(message = "{validation.cart_item.required}")
  CartItemRequest cartItemRequest;
}
