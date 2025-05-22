package com.project.app_service.service;

import java.time.Instant;

public interface EmailService {
  void saveEmailLog(String recipient, String subject, String template, Instant validity)
      throws Exception;

  void processEmails() throws Exception;

  void clear() throws Exception;
}
