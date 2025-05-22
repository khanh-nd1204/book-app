package com.project.app_service.service;

import com.project.app_service.model.dto.LogDTO;
import com.project.app_service.model.entity.LogEntity;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface LogService {

  PageResponse<List<LogDTO>> search(Specification<LogEntity> spec, Pageable pageable)
      throws Exception;

  void create(String params, String actionKey, String descKey) throws Exception;

  void clear() throws Exception;
}
