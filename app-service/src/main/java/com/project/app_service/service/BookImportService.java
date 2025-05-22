package com.project.app_service.service;

import com.project.app_service.model.entity.BookImportEntity;
import com.project.app_service.model.request.BookImportRequest;
import com.project.app_service.model.response.BookImportResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BookImportService {
  BookImportResponse create(BookImportRequest bookImportRequest) throws Exception;

  BookImportResponse update(BookImportRequest bookImportRequest) throws Exception;

  BookImportResponse getById(String id) throws Exception;

  PageResponse<List<BookImportResponse>> search(
      Specification<BookImportEntity> spec, Pageable pageable) throws Exception;

  String cancel(BookImportRequest bookImportRequest) throws Exception;
}
