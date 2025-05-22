package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
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
public class RoleRequest {
  @NotBlank(groups = OnUpdate.class, message = "{validation.id.required}")
  String id;

  @NotBlank(
      groups = {OnCreate.class},
      message = "{validation.name.required}")
  @Size(max = 100, message = "{validation.name.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String name;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.desc.required}")
  @Size(max = 100, message = "{validation.desc.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String description;

  @NotEmpty(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.permission.required}")
  List<String> permissionIds;
}
