package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.BookMapper;
import com.project.app_service.model.entity.*;
import com.project.app_service.model.request.BookRequest;
import com.project.app_service.model.request.NotificationRequest;
import com.project.app_service.model.response.BookResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.*;
import com.project.app_service.service.BookService;
import com.project.app_service.service.LogService;
import com.project.app_service.service.NotificationService;
import com.project.app_service.util.LanguageUtil;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class BookServiceImpl implements BookService {
  BookRepo bookRepo;

  PublisherRepo publisherRepo;

  FileRepo fileRepo;

  CategoryRepo categoryRepo;

  BookMapper bookMapper;

  MessageSource messageSource;

  LogService logService;

  NotificationService notificationService;

  UserRepo userRepo;

  @Override
  @Transactional
  public BookResponse create(BookRequest bookRequest) throws Exception {
    if (bookRepo.existsByTitle(bookRequest.getTitle())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_TITLE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (bookRequest.getIsbn() != null && bookRepo.existsByIsbn(bookRequest.getIsbn())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_ISBN.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    BookEntity book = bookMapper.toEntity(bookRequest);

    PublisherEntity publisher =
        publisherRepo
            .findById(bookRequest.getPublisherId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PUBLISHER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    book.setPublisher(publisher);

    List<CategoryEntity> categories = categoryRepo.findAllById(bookRequest.getCategoryIds());

    Set<String> foundCategoryIds =
        categories.stream().map(CategoryEntity::getId).collect(Collectors.toSet());

    List<String> missingCategoryIds =
        bookRequest.getCategoryIds().stream()
            .filter(id -> !foundCategoryIds.contains(id))
            .collect(Collectors.toList());

    if (!missingCategoryIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.CATEGORY_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingCategoryIds));
    }

    book.setCategories(categories);

    List<FileEntity> images = fileRepo.findAllById(bookRequest.getImageIds());

    Set<String> foundImageIds = images.stream().map(FileEntity::getId).collect(Collectors.toSet());

    List<String> missingImageIds =
        bookRequest.getImageIds().stream()
            .filter(id -> !foundImageIds.contains(id))
            .collect(Collectors.toList());

    if (!missingImageIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.IMAGE_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingImageIds));
    }
    images.forEach(image -> image.setBook(book));
    book.setImages(images);

    try {
      bookRepo.save(book);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_BOOK.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(book.getSku(), Message.ACTION_CREATE.getKey(), Message.BOOK_CREATE.getKey());

    return bookMapper.toResponse(book);
  }

  @Override
  @Transactional
  public int createBulk(List<BookRequest> bookRequests) throws Exception {
    if (bookRequests == null || bookRequests.isEmpty()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.BOOK_LIST_EMPTY.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    List<BookEntity> booksToSave =
        bookMapper.toEntities(bookRequests).stream()
            .filter(book -> !bookRepo.existsByTitle(book.getTitle()))
            .toList();

    if (!booksToSave.isEmpty()) {
      try {
        List<BookEntity> booksSave = bookRepo.saveAll(booksToSave);
        logService.create(
            String.valueOf(booksSave.size()),
            Message.ACTION_CREATE.getKey(),
            Message.CREATE_BULK_BOOK.getKey());
        return booksSave.size();
      } catch (DataIntegrityViolationException e) {
        throw new DataIntegrityViolationException(
            messageSource.getMessage(
                Message.ACTION_CREATE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
      }
    }

    return 0;
  }

  @Override
  @Transactional
  public BookResponse update(BookRequest bookRequest) throws Exception {
    BookEntity book =
        bookRepo
            .findById(bookRequest.getSku())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.BOOK_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    BookEntity existTitle = bookRepo.findByTitle(bookRequest.getTitle()).orElse(null);
    if (existTitle != null && !existTitle.getSku().equals(book.getSku())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_TITLE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    BookEntity existIsbn = bookRepo.findByIsbn(bookRequest.getIsbn()).orElse(null);
    if (existIsbn != null && !existIsbn.getSku().equals(book.getSku())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_ISBN.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    bookMapper.updateEntity(book, bookRequest);

    PublisherEntity publisher =
        publisherRepo
            .findById(bookRequest.getPublisherId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.PUBLISHER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    book.setPublisher(publisher);

    List<CategoryEntity> categories = categoryRepo.findAllById(bookRequest.getCategoryIds());

    Set<String> foundCategoryIds =
        categories.stream().map(CategoryEntity::getId).collect(Collectors.toSet());

    List<String> missingCategoryIds =
        bookRequest.getCategoryIds().stream()
            .filter(id -> !foundCategoryIds.contains(id))
            .collect(Collectors.toList());

    if (!missingCategoryIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.CATEGORY_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingCategoryIds));
    }

    book.setCategories(categories);

    List<FileEntity> newImages = fileRepo.findAllById(bookRequest.getImageIds());

    Set<String> foundImageIds =
        newImages.stream().map(FileEntity::getId).collect(Collectors.toSet());

    List<String> missingImageIds =
        bookRequest.getImageIds().stream()
            .filter(id -> !foundImageIds.contains(id))
            .collect(Collectors.toList());

    if (!missingImageIds.isEmpty()) {
      throw new NotFoundException(
          String.format(
              "%s: %s",
              messageSource.getMessage(
                  Message.IMAGE_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()),
              missingImageIds));
    }

    List<FileEntity> oldImages = book.getImages();

    List<FileEntity> imagesToRemove =
        oldImages.stream()
            .filter(oldImage -> !newImages.contains(oldImage))
            .collect(Collectors.toList());

    imagesToRemove.forEach(image -> image.setBook(null));

    newImages.forEach(image -> image.setBook(book));

    book.setImages(newImages);

    bookRepo.save(book);

    logService.create(book.getSku(), Message.ACTION_UPDATE.getKey(), Message.BOOK_UPDATE.getKey());

    return bookMapper.toResponse(book);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<BookResponse>> search(Specification<BookEntity> spec, Pageable pageable)
      throws Exception {
    Page<BookEntity> pageData = bookRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(bookMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public BookResponse getBySku(String sku) throws Exception {
    BookEntity book =
        bookRepo
            .findById(sku)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.BOOK_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return bookMapper.toResponse(book);
  }

  @Override
  @Transactional
  public String delete(String sku) throws Exception {
    BookEntity book =
        bookRepo
            .findById(sku)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.BOOK_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    book.setStatus(-1);
    bookRepo.save(book);

    logService.create(book.getSku(), Message.ACTION_DELETE.getKey(), Message.BOOK_DELETE.getKey());

    return sku;
  }

  @Override
  public void alertBookOut() throws Exception {
    List<BookEntity> booksOutOfStock = bookRepo.findByStatusAndStockQuantityLessThanEqual(1, 5);

    if (booksOutOfStock.isEmpty()) {
      return;
    }

    List<UserEntity> admins =
        Stream.of(userRepo.findByRoleName(Role.ADMIN.getName()).orElse(null))
            .filter(Objects::nonNull)
            .toList();

    for (UserEntity admin : admins) {
      try {
        String content =
            messageSource.getMessage(Message.NOTI_BOOK_OUT.getKey(), null, new Locale("vi"));

        NotificationRequest notificationRequest =
            NotificationRequest.builder().userId(admin.getId()).type(2).content(content).build();

        notificationService.sendNotification(notificationRequest);
      } catch (Exception e) {
        log.error(e.getMessage());
      }
    }
  }
}
