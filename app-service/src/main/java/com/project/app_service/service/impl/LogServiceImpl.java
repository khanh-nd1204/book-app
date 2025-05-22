package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.model.dto.LogDTO;
import com.project.app_service.model.entity.LogEntity;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.LogRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.util.LanguageUtil;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LogServiceImpl implements LogService {
  LogRepo logRepo;

  MessageSource messageSource;

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<LogDTO>> search(Specification<LogEntity> spec, Pageable pageable)
      throws Exception {
    Page<LogEntity> pageData = logRepo.findAll(spec, pageable);

    List<LogDTO> logDTOs =
        pageData.getContent().stream()
            .map(
                log -> {
                  String translatedDesc =
                      messageSource.getMessage(
                          log.getDescriptionKey(),
                          new Object[] {log.getParams()},
                          LanguageUtil.getCurrentLocale());
                  String translatedAction =
                      messageSource.getMessage(
                          log.getActionKey(), null, LanguageUtil.getCurrentLocale());

                  return LogDTO.builder()
                      .id(log.getId())
                      .action(translatedAction)
                      .description(translatedDesc)
                      .createdAt(log.getCreatedAt())
                      .createdBy(log.getCreatedBy())
                      .build();
                })
            .toList();

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        logDTOs);
  }

  @Override
  public void create(String params, String actionKey, String descKey) {
    LogEntity log = new LogEntity();
    log.setActionKey(actionKey);
    log.setParams(params);
    log.setDescriptionKey(descKey);

    logRepo.save(log);
  }

  @Override
  public void clear() {
    Instant instant = Instant.now().minus(1, ChronoUnit.DAYS);
    logRepo.deleteByCreatedAtBefore(instant);
    create("logs", Message.ACTION_CLEAN.getKey(), Message.CLEAN_SUCCESS.getKey());
  }
}
