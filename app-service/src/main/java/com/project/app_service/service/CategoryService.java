package com.project.app_service.service;

import com.project.app_service.model.entity.CategoryEntity;
import com.project.app_service.model.request.CategoryRequest;
import com.project.app_service.model.response.CategoryResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CategoryService {
  CategoryResponse create(CategoryRequest categoryRequest) throws Exception;

  CategoryResponse update(CategoryRequest categoryRequest) throws Exception;

  PageResponse<List<CategoryResponse>> search(Specification<CategoryEntity> spec, Pageable pageable)
      throws Exception;

  CategoryResponse getById(String id) throws Exception;

  String delete(String id) throws Exception;
}
