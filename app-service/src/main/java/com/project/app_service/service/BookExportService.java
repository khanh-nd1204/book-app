package com.project.app_service.service;

import com.project.app_service.model.entity.BookExportEntity;
import com.project.app_service.model.request.BookExportRequest;
import com.project.app_service.model.response.BookExportResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BookExportService {
  BookExportResponse create(BookExportRequest bookExportRequest) throws Exception;

  BookExportResponse update(BookExportRequest bookExportRequest) throws Exception;

  BookExportResponse getById(String id) throws Exception;

  PageResponse<List<BookExportResponse>> search(
      Specification<BookExportEntity> spec, Pageable pageable) throws Exception;

  String cancel(BookExportRequest bookExportRequest) throws Exception;
}
