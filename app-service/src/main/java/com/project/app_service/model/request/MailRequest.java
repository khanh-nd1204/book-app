package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MailRequest {
  String subject;
  Integer otp;
  String template;

  @NotBlank(message = "{validation.email.required}")
  @Email(message = "{validation.email.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String email;

  @NotNull(message = "{validation.email_type.required}")
  @Min(value = 1, message = "{validation.email_type.invalid}")
  @Max(value = 2, message = "{validation.email_type.invalid}")
  Integer type; // 1:activate, 2:reset-password
}
