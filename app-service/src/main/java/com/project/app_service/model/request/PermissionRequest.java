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
public class PermissionRequest {
  @NotBlank(groups = OnUpdate.class, message = "{validation.id.required}")
  String id;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.name.required}")
  @Size(max = 100, message = "{validation.name.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String name;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.api_path.required}")
  @Size(max = 100, message = "{validation.api_path.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String apiPath;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.method.required}")
  @Size(max = 100, message = "{validation.method.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String method;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.module.required}")
  @Size(max = 100, message = "{validation.module.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String module;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.desc.required}")
  @Size(max = 100, message = "{validation.desc.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String description;
}
