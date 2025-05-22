package com.project.app_service.mapper;

import com.project.app_service.model.dto.RoleDTO;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.request.RoleRequest;
import com.project.app_service.model.response.RoleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = PermissionMapper.class)
public interface RoleMapper extends EntityMapper<RoleEntity, RoleRequest, RoleResponse> {

  @Mapping(target = "name", ignore = true)
  void updateEntity(@MappingTarget RoleEntity roleEntity, RoleRequest roleRequest);

  RoleDTO toDTO(RoleEntity roleEntity);
}
