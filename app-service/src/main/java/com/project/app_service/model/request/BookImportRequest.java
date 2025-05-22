package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.OnCancel;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookImportRequest {
  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class, OnCancel.class},
      message = "{validation.import_id.required}")
  @Size(max = 20, message = "{validation.import_id.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String id;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.supplier.required}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String supplierId;

  @Size(max = 200, message = "{validation.import_note.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String note;

  @NotBlank(
      groups = {OnCancel.class},
      message = "{validation.import_reason.required}")
  @Size(max = 200, message = "{validation.import_reason.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String reason;

  @NotEmpty(
      groups = {OnCreate.class},
      message = "{validation.import_item.required}")
  List<BookImportItemRequest> bookImportItemRequests;
}
