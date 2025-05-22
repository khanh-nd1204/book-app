package com.project.app_service.mapper;

import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.UserRequest;
import com.project.app_service.model.response.UserResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper extends EntityMapper<UserEntity, UserRequest, UserResponse> {

  @Mapping(target = "email", ignore = true)
  @Mapping(target = "password", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "otp", ignore = true)
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateEntity(@MappingTarget UserEntity userEntity, UserRequest userRequest);
}
