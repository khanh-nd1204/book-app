package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.PublisherMapper;
import com.project.app_service.model.entity.PublisherEntity;
import com.project.app_service.model.request.PublisherRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.PublisherResponse;
import com.project.app_service.repo.PublisherRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.PublisherService;
import com.project.app_service.util.LanguageUtil;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherServiceImpl implements PublisherService {
  PublisherRepo publisherRepo;

  PublisherMapper publisherMapper;

  MessageSource messageSource;

  LogService logService;

  @Override
  public PublisherResponse create(PublisherRequest publisherRequest) throws Exception {
    if (publisherRepo.existsByName(publisherRequest.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    PublisherEntity publisher = publisherMapper.toEntity(publisherRequest);

    try {
      publisherRepo.save(publisher);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_PUBLISHER.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        publisher.getName(), Message.ACTION_CREATE.getKey(), Message.PUBLISHER_CREATE.getKey());

    return publisherMapper.toResponse(publisher);
  }

  @Override
  public PublisherResponse update(PublisherRequest publisherRequest) throws Exception {
    PublisherEntity publisher =
        publisherRepo
            .findById(publisherRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PUBLISHER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    PublisherEntity existName = publisherRepo.findByName(publisherRequest.getName()).orElse(null);
    if (existName != null && !existName.getId().equals(publisher.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    publisherMapper.updateEntity(publisher, publisherRequest);
    publisherRepo.save(publisher);

    logService.create(
        publisher.getName(), Message.ACTION_UPDATE.getKey(), Message.PERMISSION_UPDATE.getKey());

    return publisherMapper.toResponse(publisher);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<PublisherResponse>> search(
      Specification<PublisherEntity> spec, Pageable pageable) throws Exception {
    Page<PublisherEntity> pageData = publisherRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(publisherMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public PublisherResponse getById(String id) throws Exception {
    PublisherEntity publisher =
        publisherRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PUBLISHER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    return publisherMapper.toResponse(publisher);
  }

  @Override
  public String delete(String id) throws Exception {
    PublisherEntity publisher =
        publisherRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PUBLISHER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (publisher.getBooks() != null && !publisher.getBooks().isEmpty()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    try {
      publisherRepo.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        publisher.getName(), Message.ACTION_DELETE.getKey(), Message.PERMISSION_DELETE.getKey());

    return id;
  }
}
