package com.project.app_service.mapper;

import com.project.app_service.model.dto.PermissionDTO;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.request.PermissionRequest;
import com.project.app_service.model.response.PermissionResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper
    extends EntityMapper<PermissionEntity, PermissionRequest, PermissionResponse> {

  PermissionDTO toDTO(PermissionEntity permissionEntity);
}
