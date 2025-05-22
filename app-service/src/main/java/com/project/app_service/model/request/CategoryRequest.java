package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
  @NotBlank(
      groups = {OnUpdate.class},
      message = "{validation.id.required}")
  String id;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.name.required}")
  @Size(max = 100, message = "{validation.name.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String name;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.symbol.required}")
  @Size(max = 10, message = "{validation.symbol.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String symbol;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.category_image.required}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String imageId;
}
