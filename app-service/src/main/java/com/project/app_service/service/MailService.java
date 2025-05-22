package com.project.app_service.service;

import com.project.app_service.model.request.MailRequest;
import com.project.app_service.util.LanguageUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MailService {
  JavaMailSender javaMailSender;

  SpringTemplateEngine templateEngine;

  MessageSource messageSource;

  public boolean sendEmailSync(
      String to, String subject, String content, boolean isMultipart, boolean isHtml) {
    if (to == null || to.isBlank()) {
      log.error("Recipient email is null or empty.");
      return false;
    }
    if (subject == null || subject.isBlank()) {
      log.error("Subject is null or empty.");
      return false;
    }
    if (content == null || content.isBlank()) {
      log.error("Content is null or empty.");
      return false;
    }

    try {
      MimeMessage mimeMessage = javaMailSender.createMimeMessage();
      MimeMessageHelper message =
          new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
      message.setTo(to);
      message.setSubject(subject);
      message.setText(content, isHtml);

      javaMailSender.send(mimeMessage);
      return true;

    } catch (MailException | MessagingException e) {
      log.error(e.getMessage());
      return false;
    }
  }

  @Async
  public CompletableFuture<Boolean> sendEmailFromTemplateSync(MailRequest mailRequest)
      throws Exception {
    if (mailRequest.getEmail() == null || mailRequest.getEmail().isBlank()) {
      log.error("Email address error");
      throw new BadRequestException(
          messageSource.getMessage(
              "validation.email.invalid", null, LanguageUtil.getCurrentLocale()));
    }

    Context context = new Context();
    context.setVariable("otp", mailRequest.getOtp());
    context.setVariable("title", mailRequest.getSubject());
    context.setVariable("name", mailRequest.getEmail());

    String content = templateEngine.process(mailRequest.getTemplate(), context);

    boolean emailSent =
        sendEmailSync(mailRequest.getEmail(), mailRequest.getSubject(), content, false, true);
    if (!emailSent) {
      log.error("Failed to send email");
    }
    return CompletableFuture.completedFuture(emailSent);
  }
}
