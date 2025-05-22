package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.OnCancel;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookExportRequest {
  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class, OnCancel.class},
      message = "{validation.import_id.required}")
  @Size(max = 20, message = "{validation.export_id.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String id;

  @JsonDeserialize(using = StringTrimDeserializer.class)
  String supplierId;

  @Size(max = 200, message = "{validation.export_note.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String note;

  @NotBlank(
      groups = {OnCancel.class},
      message = "{validation.export_reason.required}")
  @Size(max = 200, message = "{validation.export_reason.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String reason;

  @NotEmpty(
      groups = {OnCreate.class},
      message = "{validation.export_item.required}")
  List<BookExportItemRequest> bookExportItemRequests;
}
