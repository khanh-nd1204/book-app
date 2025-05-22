package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.PermissionMapper;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.request.PermissionRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.PermissionResponse;
import com.project.app_service.repo.PermissionRepo;
import com.project.app_service.repo.RoleRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.PermissionService;
import com.project.app_service.util.LanguageUtil;
import java.util.List;
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
public class PermissionServiceImpl implements PermissionService {
  PermissionRepo permissionRepo;

  RoleRepo roleRepo;

  PermissionMapper permissionMapper;

  MessageSource messageSource;

  LogService logService;

  @Override
  @Transactional
  public PermissionResponse create(PermissionRequest permissionRequest) throws Exception {
    if (permissionRepo.existsByName(permissionRequest.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (permissionRepo.existsByApiPathAndMethodAndModule(
        permissionRequest.getApiPath(),
        permissionRequest.getMethod(),
        permissionRequest.getModule())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_PERMISSION.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    PermissionEntity permission = permissionMapper.toEntity(permissionRequest);

    try {
      permissionRepo.save(permission);

      RoleEntity roleAdmin = roleRepo.findByName(Role.ADMIN.getName()).orElse(null);
      if (roleAdmin != null) {
        List<PermissionEntity> permissions = roleAdmin.getPermissions();
        permissions.add(permission);
        roleAdmin.setPermissions(permissions);
        roleRepo.save(roleAdmin);
      }
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_PERMISSION.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        permission.getName(), Message.ACTION_CREATE.getKey(), Message.PERMISSION_CREATE.getKey());

    return permissionMapper.toResponse(permission);
  }

  @Override
  @Transactional
  public PermissionResponse update(PermissionRequest permissionRequest) throws Exception {
    PermissionEntity permission =
        permissionRepo
            .findById(permissionRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PERMISSION_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    PermissionEntity existName =
        permissionRepo.findByName(permissionRequest.getName()).orElse(null);
    if (existName != null && !existName.getId().equals(permission.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    PermissionEntity existPermission =
        permissionRepo
            .findByApiPathAndMethodAndModule(
                permissionRequest.getApiPath(),
                permissionRequest.getMethod(),
                permissionRequest.getModule())
            .orElse(null);
    if (existPermission != null && !existPermission.getId().equals(permission.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_PERMISSION.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    permissionMapper.updateEntity(permission, permissionRequest);
    permissionRepo.save(permission);

    logService.create(
        permission.getName(), Message.ACTION_UPDATE.getKey(), Message.PERMISSION_UPDATE.getKey());

    return permissionMapper.toResponse(permission);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<PermissionResponse>> search(
      Specification<PermissionEntity> spec, Pageable pageable) throws Exception {
    Page<PermissionEntity> pageData = permissionRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(permissionMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public PermissionResponse getById(String id) throws Exception {
    PermissionEntity permission =
        permissionRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PERMISSION_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return permissionMapper.toResponse(permission);
  }

  @Override
  @Transactional
  public String delete(String id) throws Exception {
    PermissionEntity permission =
        permissionRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PERMISSION_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (permission.getRoles() != null && !permission.getRoles().isEmpty()) {
      permission.getRoles().forEach(role -> role.getPermissions().remove(permission));
    }

    try {
      permissionRepo.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        permission.getName(), Message.ACTION_DELETE.getKey(), Message.PERMISSION_DELETE.getKey());

    return permission.getId();
  }
}
