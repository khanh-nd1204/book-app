package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.BookExportMapper;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.entity.BookExportEntity;
import com.project.app_service.model.entity.BookExportItemEntity;
import com.project.app_service.model.entity.SupplierEntity;
import com.project.app_service.model.request.BookExportItemRequest;
import com.project.app_service.model.request.BookExportRequest;
import com.project.app_service.model.response.BookExportResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.BookExportRepo;
import com.project.app_service.repo.BookRepo;
import com.project.app_service.repo.SupplierRepo;
import com.project.app_service.service.BookExportService;
import com.project.app_service.service.LogService;
import com.project.app_service.util.LanguageUtil;
import java.util.ArrayList;
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
public class BookExportServiceImpl implements BookExportService {
  BookExportRepo bookExportRepo;

  BookExportMapper bookExportMapper;

  BookRepo bookRepo;

  SupplierRepo supplierRepo;

  MessageSource messageSource;

  LogService logService;

  @Override
  @Transactional
  public BookExportResponse create(BookExportRequest bookExportRequest) throws Exception {
    if (bookExportRepo.existsById(bookExportRequest.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_EXPORT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    BookExportEntity bookExport = bookExportMapper.toEntity(bookExportRequest);

    if (!bookExportRequest.getSupplierId().isEmpty()) {
      SupplierEntity supplier =
          supplierRepo
              .findById(bookExportRequest.getSupplierId())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.SUPPLIER_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));
      bookExport.setSupplier(supplier);
    }

    List<BookExportItemEntity> bookExportItems = new ArrayList<>();

    List<BookEntity> booksToUpdate = new ArrayList<>();

    for (BookExportItemRequest bookExportItemRequest :
        bookExportRequest.getBookExportItemRequests()) {
      BookExportItemEntity bookExportItem = new BookExportItemEntity();

      BookEntity book =
          bookRepo
              .findById(bookExportItemRequest.getBookSku())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.BOOK_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      updateBookStockQuantity(book, bookExportItemRequest.getQuantity(), false);
      booksToUpdate.add(book);

      bookExportItem.setBookExport(bookExport);
      bookExportItem.setBook(book);
      bookExportItem.setQuantity(bookExportItemRequest.getQuantity());
      bookExportItem.setUnitPrice(bookExportItemRequest.getUnitPrice());
      bookExportItem.setTotalCost(
          Math.floor(bookExportItemRequest.getQuantity() * bookExportItemRequest.getUnitPrice()));

      bookExportItems.add(bookExportItem);
    }

    bookRepo.saveAll(booksToUpdate);

    bookExport.setBookExportItems(bookExportItems);
    bookExport.setTotalCost(
        bookExportItems.stream().mapToDouble(BookExportItemEntity::getTotalCost).sum());

    try {
      bookExportRepo.save(bookExport);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_CREATE_EXPORT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        bookExport.getId(), Message.ACTION_CREATE.getKey(), Message.EXPORT_CREATE.getKey());

    return bookExportMapper.toResponse(bookExport);
  }

  @Override
  @Transactional
  public BookExportResponse update(BookExportRequest bookExportRequest) throws Exception {

    BookExportEntity bookExport =
        bookExportRepo
            .findById(bookExportRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.EXPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!bookExport.getStatus()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.UPDATE_EXPORT_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    bookExportMapper.updateEntity(bookExport, bookExportRequest);

    if (!bookExportRequest.getSupplierId().isEmpty()) {
      SupplierEntity supplier =
          supplierRepo
              .findById(bookExportRequest.getSupplierId())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.SUPPLIER_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));
      bookExport.setSupplier(supplier);
    }

    bookExportRepo.save(bookExport);

    logService.create(
        bookExport.getId(), Message.ACTION_UPDATE.getKey(), Message.EXPORT_UPDATE.getKey());

    return bookExportMapper.toResponse(bookExport);
  }

  @Override
  @Transactional(readOnly = true)
  public BookExportResponse getById(String id) throws Exception {
    BookExportEntity bookExport =
        bookExportRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.EXPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return bookExportMapper.toResponse(bookExport);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<BookExportResponse>> search(
      Specification<BookExportEntity> spec, Pageable pageable) throws Exception {
    Page<BookExportEntity> pageData = bookExportRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(bookExportMapper::toResponse).toList());
  }

  @Override
  @Transactional
  public String cancel(BookExportRequest bookExportRequest) throws Exception {
    BookExportEntity bookExport =
        bookExportRepo
            .findById(bookExportRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.EXPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!bookExport.getStatus()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.CANCEL_EXPORT_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    List<BookEntity> booksToUpdate = new ArrayList<>();

    for (BookExportItemEntity bookExportItem : bookExport.getBookExportItems()) {
      BookEntity book = bookExportItem.getBook();
      updateBookStockQuantity(book, bookExportItem.getQuantity(), true);
      booksToUpdate.add(book);
    }

    bookRepo.saveAll(booksToUpdate);

    bookExport.setStatus(false);
    bookExport.setReason(bookExportRequest.getReason());

    bookExportRepo.save(bookExport);

    logService.create(
        bookExport.getId(), Message.ACTION_CANCEL.getKey(), Message.EXPORT_CANCEL.getKey());

    return bookExport.getId();
  }

  private void updateBookStockQuantity(BookEntity book, int quantityChange, boolean isCancel)
      throws Exception {
    int currentStock = book.getStockQuantity();
    int newStockQuantity =
        isCancel ? (currentStock + quantityChange) : (currentStock - quantityChange);

    if (!isCancel && newStockQuantity < 0) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXPORT_STOCK_OUT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    book.setStockQuantity(newStockQuantity);
  }
}
