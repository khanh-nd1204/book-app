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
public class PublisherRequest {
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
      message = "{validation.address.required}")
  @Size(max = 100, message = "{validation.address.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String address;

  @Size(max = 500, message = "{validation.note.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String note;
}
