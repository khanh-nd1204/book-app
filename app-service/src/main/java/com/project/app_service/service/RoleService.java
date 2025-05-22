package com.project.app_service.service;

import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.request.RoleRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.RoleResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface RoleService {
  RoleResponse create(RoleRequest roleRequest) throws Exception;

  RoleResponse update(RoleRequest roleRequest) throws Exception;

  PageResponse<List<RoleResponse>> search(Specification<RoleEntity> spec, Pageable pageable)
      throws Exception;

  RoleResponse getById(String id) throws Exception;

  String delete(String id) throws Exception;
}
