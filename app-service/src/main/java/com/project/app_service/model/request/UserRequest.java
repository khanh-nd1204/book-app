package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.group.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
  @NotBlank(
      groups = {OnUpdate.class, OnChangePassword.class},
      message = "{validation.id.required}")
  String id;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class, OnRegister.class},
      message = "{validation.name.required}")
  @Size(max = 100, message = "{validation.name.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String name;

  @NotBlank(
      groups = {OnCreate.class, OnResetPassword.class, OnActivate.class, OnRegister.class},
      message = "{validation.email.required}")
  @Email(message = "{validation.email.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String email;

  @NotBlank(
      groups = {OnCreate.class, OnResetPassword.class, OnRegister.class},
      message = "{validation.password.required}")
  @Size(min = 6, max = 50, message = "{validation.password.length}")
  String password;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class, OnRegister.class},
      message = "{validation.address.required}")
  @Size(max = 100, message = "{validation.address.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String address;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class, OnRegister.class},
      message = "{validation.phone.required}")
  @Pattern(regexp = "\\d{10}", message = "{validation.phone.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String phone;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.role.required")
  String roleId;

  String roleName;

  @NotBlank(groups = OnChangePassword.class, message = "{validation.current_password.required}")
  @Size(min = 6, max = 50, message = "{validation.password.length}")
  String currentPassword;

  @NotBlank(groups = OnChangePassword.class, message = "{validation.new_password.required}")
  @Size(min = 6, max = 50, message = "{validation.password.length}")
  String newPassword;

  @NotNull(
      groups = {OnResetPassword.class, OnActivate.class},
      message = "{validation.otp.required}")
  @Min(value = 100000, message = "{validation.otp.length}")
  @Max(value = 999999, message = "{validation.otp.length}")
  Integer otp;
}
