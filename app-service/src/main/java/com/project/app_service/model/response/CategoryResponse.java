package com.project.app_service.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.app_service.model.dto.FileDTO;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {
  String id;
  String name;
  String symbol;
  FileDTO image;

  @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy", timezone = "GMT+7")
  Instant createdAt;

  String createdBy;

  @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy", timezone = "GMT+7")
  Instant updatedAt;

  String updatedBy;
}
