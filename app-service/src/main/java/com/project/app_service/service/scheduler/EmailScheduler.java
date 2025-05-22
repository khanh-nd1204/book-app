package com.project.app_service.service.scheduler;

import com.project.app_service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailScheduler {
  EmailService emailService;

  @Scheduled(fixedRate = 30000)
  public void processEmails() throws Exception {
    emailService.processEmails();
  }

  @Scheduled(cron = "0 0 0 * * *")
  public void clearEmails() throws Exception {
    emailService.clear();
  }
}
