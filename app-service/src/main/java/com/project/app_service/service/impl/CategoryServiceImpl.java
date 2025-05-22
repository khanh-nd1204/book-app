package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.CategoryMapper;
import com.project.app_service.model.entity.CategoryEntity;
import com.project.app_service.model.entity.FileEntity;
import com.project.app_service.model.request.CategoryRequest;
import com.project.app_service.model.response.CategoryResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.CategoryRepo;
import com.project.app_service.repo.FileRepo;
import com.project.app_service.service.CategoryService;
import com.project.app_service.service.LogService;
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
public class CategoryServiceImpl implements CategoryService {
  CategoryRepo categoryRepo;

  CategoryMapper categoryMapper;

  MessageSource messageSource;

  LogService logService;

  FileRepo fileRepo;

  @Override
  public CategoryResponse create(CategoryRequest categoryRequest) throws Exception {
    if (categoryRepo.existsByName(categoryRequest.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (categoryRepo.existsBySymbol(categoryRequest.getSymbol())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_SYMBOL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    CategoryEntity category = categoryMapper.toEntity(categoryRequest);

    FileEntity image =
        fileRepo
            .findById(categoryRequest.getImageId())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage(
                            Message.IMAGE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    category.setImage(image);

    try {
      categoryRepo.save(category);

    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_CATEGORY.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        category.getName(), Message.ACTION_CREATE.getKey(), Message.CATEGORY_CREATE.getKey());
    return categoryMapper.toResponse(category);
  }

  @Override
  public CategoryResponse update(CategoryRequest categoryRequest) throws Exception {
    CategoryEntity category =
        categoryRepo
            .findById(categoryRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CATEGORY_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CategoryEntity existName = categoryRepo.findByName(categoryRequest.getName()).orElse(null);
    if (existName != null && !existName.getId().equals(category.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_NAME.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    CategoryEntity existSymbol =
        categoryRepo.findBySymbol(categoryRequest.getSymbol()).orElse(null);
    if (existSymbol != null && !existSymbol.getId().equals(category.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_SYMBOL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    categoryMapper.updateEntity(category, categoryRequest);
    if (category.getImage() == null
        || !category.getImage().getId().equals(categoryRequest.getId())) {
      FileEntity image =
          fileRepo
              .findById(categoryRequest.getImageId())
              .orElseThrow(
                  () ->
                      new BadRequestException(
                          messageSource.getMessage(
                              Message.IMAGE_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      category.setImage(image);
    }

    categoryRepo.save(category);
    logService.create(
        category.getName(), Message.ACTION_UPDATE.getKey(), Message.CATEGORY_UPDATE.getKey());
    return categoryMapper.toResponse(category);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<CategoryResponse>> search(
      Specification<CategoryEntity> spec, Pageable pageable) throws Exception {
    Page<CategoryEntity> pageData = categoryRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(categoryMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public CategoryResponse getById(String id) throws Exception {
    CategoryEntity category =
        categoryRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CATEGORY_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return categoryMapper.toResponse(category);
  }

  @Override
  public String delete(String id) throws Exception {
    CategoryEntity category =
        categoryRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CATEGORY_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (category.getBooks() != null && !category.getBooks().isEmpty()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    try {
      categoryRepo.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        category.getName(), Message.ACTION_DELETE.getKey(), Message.CATEGORY_DELETE.getKey());
    return id;
  }
}
