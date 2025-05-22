package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.OnCancel;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnReject;
import com.project.app_service.validation.group.OnUpdate;
import jakarta.validation.constraints.*;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
  @NotBlank(
      groups = {OnUpdate.class, OnCancel.class, OnReject.class},
      message = "{validation.id.required}")
  String id;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.name.required}")
  @Size(max = 100, message = "{validation.name.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String name;

  @Email(message = "{validation.email.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String email;

  @Size(max = 500, message = "{validation.note.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String note;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.address.required}")
  @Size(max = 100, message = "{validation.address.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String address;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.phone.required}")
  @Pattern(regexp = "\\d{10}", message = "{validation.phone.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String phone;

  @NotNull(
      groups = {OnUpdate.class},
      message = "{validation.status.required}")
  @Min(value = -2, message = "{validation.status.invalid}")
  @Max(value = 5, message = "{validation.status.invalid}")
  Integer status;

  @NotNull(
      groups = {OnUpdate.class},
      message = "{validation.order_method.required}")
  @Min(value = 1, message = "{validation.order_method.invalid}")
  @Max(value = 3, message = "{validation.order_method.invalid}")
  Integer method;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.invoice.required}")
  @Min(value = 0, message = "{validation.invoice.invalid}")
  @Max(value = 1, message = "{validation.invoice.invalid}")
  Integer invoice;

  @NotBlank(
      groups = {OnCancel.class, OnReject.class},
      message = "{validation.reason.required}")
  @Size(max = 100, message = "{validation.reason.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String reason;

  @NotEmpty(
      groups = {OnCreate.class},
      message = "{validation.order_item.required}")
  List<OrderItemRequest> orderItems;

  @JsonDeserialize(using = StringTrimDeserializer.class)
  String vnpTxnRef;
}
