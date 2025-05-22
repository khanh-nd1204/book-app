package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.SupplierMapper;
import com.project.app_service.model.entity.SupplierEntity;
import com.project.app_service.model.request.SupplierRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.SupplierResponse;
import com.project.app_service.repo.SupplierRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {
  SupplierRepo supplierRepo;

  SupplierMapper supplierMapper;

  MessageSource messageSource;

  LogService logService;

  @Override
  public SupplierResponse create(SupplierRequest supplierRequest) throws Exception {
    if (supplierRepo.existsByName(supplierRequest.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (supplierRepo.existsByTaxCode(supplierRequest.getTaxCode())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_TAX.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    SupplierEntity supplier = supplierMapper.toEntity(supplierRequest);

    try {
      supplierRepo.save(supplier);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_PUBLISHER.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        supplier.getName(), Message.ACTION_CREATE.getKey(), Message.SUPPLIER_CREATE.getKey());

    return supplierMapper.toResponse(supplier);
  }

  @Override
  public SupplierResponse update(SupplierRequest supplierRequest) throws Exception {
    SupplierEntity supplier =
        supplierRepo
            .findById(supplierRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.SUPPLIER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    SupplierEntity existName = supplierRepo.findByName(supplierRequest.getName()).orElse(null);
    if (existName != null && !existName.getId().equals(supplier.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    SupplierEntity existTaxCode =
        supplierRepo.findByTaxCode(supplierRequest.getTaxCode()).orElse(null);
    if (existTaxCode != null && !existTaxCode.getId().equals(supplier.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_TAX.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    supplierMapper.updateEntity(supplier, supplierRequest);
    supplierRepo.save(supplier);
    logService.create(
        supplier.getName(), Message.ACTION_UPDATE.getKey(), Message.SUPPLIER_UPDATE.getKey());
    return supplierMapper.toResponse(supplier);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<SupplierResponse>> search(
      Specification<SupplierEntity> spec, Pageable pageable) throws Exception {
    Page<SupplierEntity> pageData = supplierRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(supplierMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public SupplierResponse getById(String id) throws Exception {
    SupplierEntity supplier =
        supplierRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.SUPPLIER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    return supplierMapper.toResponse(supplier);
  }

  @Override
  public String delete(String id) throws Exception {
    SupplierEntity supplier =
        supplierRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.SUPPLIER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (supplier.getBookImports() != null && !supplier.getBookImports().isEmpty()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    try {
      supplierRepo.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        supplier.getName(), Message.ACTION_DELETE.getKey(), Message.SUPPLIER_UPDATE.getKey());

    return id;
  }
}
