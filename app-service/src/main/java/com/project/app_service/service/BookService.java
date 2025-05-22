package com.project.app_service.service;

import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.request.BookRequest;
import com.project.app_service.model.response.BookResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BookService {
  BookResponse create(BookRequest bookRequest) throws Exception;

  int createBulk(List<BookRequest> bookRequests) throws Exception;

  BookResponse update(BookRequest bookRequest) throws Exception;

  PageResponse<List<BookResponse>> search(Specification<BookEntity> spec, Pageable pageable)
      throws Exception;

  BookResponse getBySku(String sku) throws Exception;

  String delete(String sku) throws Exception;

  void alertBookOut() throws Exception;
}
