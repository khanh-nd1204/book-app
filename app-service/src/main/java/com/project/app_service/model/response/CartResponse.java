package com.project.app_service.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.app_service.model.dto.CartItemDTO;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartResponse {
  String id;
  Double totalPrice;
  List<CartItemDTO> cartItems;
}
