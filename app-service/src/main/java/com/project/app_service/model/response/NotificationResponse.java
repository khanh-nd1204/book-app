package com.project.app_service.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponse {
  String id;
  String userId;
  String content;
  int type;
  boolean read;

  @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy", timezone = "GMT+7")
  Instant createdAt;
}
