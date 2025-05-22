package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.RoleMapper;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.request.RoleRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.RoleResponse;
import com.project.app_service.repo.PermissionRepo;
import com.project.app_service.repo.RoleRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.RoleService;
import com.project.app_service.util.LanguageUtil;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
  RoleRepo roleRepo;

  UserRepo userRepo;

  PermissionRepo permissionRepo;

  RoleMapper roleMapper;

  MessageSource messageSource;

  LogService logService;

  List<String> PROTECTED_ROLES =
      List.of(Role.ADMIN.getName(), Role.EMPLOYEE.getName(), Role.CUSTOMER.getName());

  @Override
  @Transactional
  public RoleResponse create(RoleRequest roleRequest) throws Exception {
    if (roleRepo.existsByName(roleRequest.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    RoleEntity role = roleMapper.toEntity(roleRequest);

    List<PermissionEntity> permissions = permissionRepo.findAllById(roleRequest.getPermissionIds());

    Set<String> foundPermissionIds =
        permissions.stream().map(PermissionEntity::getId).collect(Collectors.toSet());

    List<String> missingPermissionIds =
        roleRequest.getPermissionIds().stream()
            .filter(id -> !foundPermissionIds.contains(id))
            .collect(Collectors.toList());

    if (!missingPermissionIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.PERMISSION_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingPermissionIds));
    }

    role.setPermissions(permissions);

    try {
      roleRepo.save(role);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_ROLE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(role.getName(), Message.ACTION_CREATE.getKey(), Message.ROLE_CREATE.getKey());

    return roleMapper.toResponse(role);
  }

  @Override
  @Transactional
  public RoleResponse update(RoleRequest roleRequest) throws Exception {
    RoleEntity role =
        roleRepo
            .findById(roleRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ROLE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (role.getName().equals(PROTECTED_ROLES.get(0))) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_UPDATE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    RoleEntity existName = roleRepo.findByName(roleRequest.getName()).orElse(null);
    if (existName != null && !existName.getId().equals(role.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    roleMapper.updateEntity(role, roleRequest);

    List<PermissionEntity> permissions = permissionRepo.findAllById(roleRequest.getPermissionIds());

    Set<String> foundPermissionIds =
        permissions.stream().map(PermissionEntity::getId).collect(Collectors.toSet());

    List<String> missingPermissionIds =
        roleRequest.getPermissionIds().stream()
            .filter(id -> !foundPermissionIds.contains(id))
            .collect(Collectors.toList());

    if (!missingPermissionIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.PERMISSION_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingPermissionIds));
    }

    role.setPermissions(permissions);
    roleRepo.save(role);

    logService.create(role.getName(), Message.ACTION_UPDATE.getKey(), Message.ROLE_UPDATE.getKey());

    return roleMapper.toResponse(role);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<RoleResponse>> search(Specification<RoleEntity> spec, Pageable pageable)
      throws Exception {
    Page<RoleEntity> pageData = roleRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(roleMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public RoleResponse getById(String id) throws Exception {
    RoleEntity role =
        roleRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ROLE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return roleMapper.toResponse(role);
  }

  @Override
  @Transactional
  public String delete(String id) throws Exception {
    RoleEntity role =
        roleRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ROLE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (PROTECTED_ROLES.contains(role.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (role.getUsers() != null && !role.getUsers().isEmpty()) {
      role.getUsers().forEach(user -> user.setRole(null));
      userRepo.saveAll(role.getUsers());
    }

    try {
      roleRepo.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(role.getName(), Message.ACTION_DELETE.getKey(), Message.ROLE_DELETE.getKey());

    return role.getId();
  }
}
