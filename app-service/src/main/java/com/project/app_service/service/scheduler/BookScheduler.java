package com.project.app_service.service.scheduler;

import com.project.app_service.service.BookService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookScheduler {
  BookService bookService;

  @Scheduled(cron = "0 0 0 * * *")
  @Transactional
  public void alertBookOut() throws Exception {
    bookService.alertBookOut();
  }
}
