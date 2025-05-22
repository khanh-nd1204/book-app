package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.NotificationMapper;
import com.project.app_service.model.entity.NotificationEntity;
import com.project.app_service.model.request.NotificationRequest;
import com.project.app_service.model.response.NotificationResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.NotificationRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.NotificationService;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.util.SecurityUtil;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

  SimpMessagingTemplate messagingTemplate;

  NotificationMapper notificationMapper;

  NotificationRepo notificationRepo;

  MessageSource messageSource;

  LogService logService;

  @Override
  public void sendNotification(NotificationRequest notificationRequest) throws Exception {
    NotificationEntity notification = notificationMapper.toEntity(notificationRequest);

    notificationRepo.save(notification);

    messagingTemplate.convertAndSend(
        "/topic/notifications/" + notification.getUserId(),
        notificationMapper.toResponse(notification));
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<NotificationResponse>> search(
      Specification<NotificationEntity> spec, Pageable pageable) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    Specification<NotificationEntity> notificationByUser =
        (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("userId"), userId);

    Page<NotificationEntity> pageData =
        notificationRepo.findAll(spec.and(notificationByUser), pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(notificationMapper::toResponse).toList());
  }

  @Override
  public int markAllRead() throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    List<NotificationEntity> notifications = notificationRepo.findAllByReadFalseAndUserId(userId);

    if (notifications.isEmpty()) {
      return 0;
    }

    for (NotificationEntity notification : notifications) notification.setRead(true);
    notificationRepo.saveAll(notifications);

    return notifications.size();
  }

  @Override
  public void clear() throws Exception {
    Instant instant = Instant.now().minus(7, ChronoUnit.DAYS);
    notificationRepo.deleteByCreatedAtBefore(instant);
    logService.create(
        "notifications", Message.ACTION_CLEAN.getKey(), Message.CLEAN_SUCCESS.getKey());
  }
}
