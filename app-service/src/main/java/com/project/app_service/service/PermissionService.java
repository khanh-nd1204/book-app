package com.project.app_service.service;

import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.request.PermissionRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.PermissionResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface PermissionService {
  PermissionResponse create(PermissionRequest permissionRequest) throws Exception;

  PermissionResponse update(PermissionRequest permissionRequest) throws Exception;

  PageResponse<List<PermissionResponse>> search(
      Specification<PermissionEntity> spec, Pageable pageable) throws Exception;

  PermissionResponse getById(String id) throws Exception;

  String delete(String id) throws Exception;
}
