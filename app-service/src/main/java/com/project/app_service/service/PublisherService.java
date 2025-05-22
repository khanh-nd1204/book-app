package com.project.app_service.service;

import com.project.app_service.model.entity.PublisherEntity;
import com.project.app_service.model.request.PublisherRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.PublisherResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface PublisherService {
  PublisherResponse create(PublisherRequest publisherRequest) throws Exception;

  PublisherResponse update(PublisherRequest publisherRequest) throws Exception;

  PageResponse<List<PublisherResponse>> search(
      Specification<PublisherEntity> spec, Pageable pageable) throws Exception;

  PublisherResponse getById(String id) throws Exception;

  String delete(String id) throws Exception;
}
