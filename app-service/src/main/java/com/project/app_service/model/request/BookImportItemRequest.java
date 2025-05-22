package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
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
public class BookImportItemRequest {
  @NotNull(message = "{validation.quantity.required}")
  @Min(value = 1, message = "{validation.quantity.invalid}")
  Integer quantity;

  @NotNull(message = "{validation.unit_price.required}")
  @Min(value = 1, message = "{validation.unit_price.invalid}")
  Double unitPrice;

  @NotBlank(message = "{validation.sku.required}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String bookSku;
}
