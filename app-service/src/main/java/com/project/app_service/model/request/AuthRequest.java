package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthRequest {

  @NotBlank(message = "{validation.email.required}")
  @Email(message = "{validation.email.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String username;

  @NotBlank(message = "{validation.password.required}")
  @Size(min = 6, max = 50, message = "{validation.password.length}")
  String password;
}
