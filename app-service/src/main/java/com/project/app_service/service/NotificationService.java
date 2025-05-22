package com.project.app_service.service;

import com.project.app_service.model.entity.NotificationEntity;
import com.project.app_service.model.request.NotificationRequest;
import com.project.app_service.model.response.NotificationResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface NotificationService {
  void sendNotification(NotificationRequest notificationRequest) throws Exception;

  PageResponse<List<NotificationResponse>> search(
      Specification<NotificationEntity> spec, Pageable pageable) throws Exception;

  int markAllRead() throws Exception;

  void clear() throws Exception;
}
