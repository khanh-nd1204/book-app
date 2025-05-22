package com.project.app_service.service.scheduler;

import com.project.app_service.constant.Message;
import com.project.app_service.repo.InvalidatedTokenRepo;
import com.project.app_service.service.FileService;
import com.project.app_service.service.LogService;
import com.project.app_service.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataScheduler {
  InvalidatedTokenRepo invalidatedTokenRepo;

  FileService fileService;

  LogService logService;

  NotificationService notificationService;

  @Scheduled(cron = "0 0 * * * *")
  @Transactional
  public void clearInvalidatedTokens() throws Exception {
    invalidatedTokenRepo.deleteAll();
    logService.create("tokens", Message.ACTION_CLEAN.getKey(), Message.CLEAN_SUCCESS.getKey());
  }

  @Scheduled(cron = "0 0 * * * *")
  @Transactional
  public void clearLogs() throws Exception {
    logService.clear();
  }

  @Scheduled(cron = "0 0 * * * *")
  @Transactional
  public void clearFiles() throws Exception {
    fileService.clear();
  }

  @Scheduled(cron = "0 0 * * * *")
  @Transactional
  public void clearNotifications() throws Exception {
    notificationService.clear();
  }
}
