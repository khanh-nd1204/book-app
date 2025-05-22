package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.model.entity.EmailLogEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.MailRequest;
import com.project.app_service.repo.EmailLogRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.EmailService;
import com.project.app_service.service.LogService;
import com.project.app_service.service.MailService;
import com.project.app_service.util.LanguageUtil;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Future;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
  MailService mailService;

  EmailLogRepo emailLogRepo;

  UserRepo userRepo;

  MessageSource messageSource;

  LogService logService;

  @Override
  public void saveEmailLog(String recipient, String subject, String template, Instant validity)
      throws Exception {
    EmailLogEntity emailLog =
        EmailLogEntity.builder()
            .recipient(recipient)
            .subject(subject)
            .template(template)
            .status(0)
            .validity(validity)
            .build();
    emailLogRepo.save(emailLog);
  }

  @Override
  public void processEmails() throws Exception {
    List<EmailLogEntity> pendingEmails =
        emailLogRepo.findByStatusAndValidityIsBefore(0, Instant.now());
    for (EmailLogEntity email : pendingEmails) {
      UserEntity user =
          userRepo
              .findByEmail(email.getRecipient())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.EMAIL_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      MailRequest mailRequest =
          MailRequest.builder()
              .email(email.getRecipient())
              .subject(email.getSubject())
              .otp(user.getOtp())
              .template(email.getTemplate())
              .build();

      Future<Boolean> emailSent = mailService.sendEmailFromTemplateSync(mailRequest);
      email.setStatus(emailSent.get() ? 1 : 0);
      emailLogRepo.save(email);
    }
  }

  @Override
  public void clear() throws Exception {
    List<EmailLogEntity> sentEmails = emailLogRepo.findByStatusOrValidityIsAfter(1, Instant.now());
    emailLogRepo.deleteAll(sentEmails);
    logService.create("email logs", Message.ACTION_CLEAN.getKey(), Message.CLEAN_SUCCESS.getKey());
  }
}
