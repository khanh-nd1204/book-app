package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.OnAddCart;
import com.project.app_service.validation.group.OnRemoveCart;
import com.project.app_service.validation.group.OnUpdateCart;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {
  @NotBlank(
      groups = {OnRemoveCart.class},
      message = "validation.id.required")
  String id;

  @NotNull(
      groups = {OnAddCart.class, OnUpdateCart.class},
      message = "{validation.quantity.required}")
  @Min(value = 1, message = "{validation.quantity.invalid}")
  Integer quantity;

  @NotNull(
      groups = {OnAddCart.class},
      message = "{validation.unit_price.required}")
  @Min(value = 1, message = "{validation.unit_price.invalid}")
  Double unitPrice;

  @NotBlank(
      groups = {OnAddCart.class, OnUpdateCart.class},
      message = "{validation.sku.required}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String bookSku;
}
