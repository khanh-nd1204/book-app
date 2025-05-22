package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.BookImportMapper;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.entity.BookImportEntity;
import com.project.app_service.model.entity.BookImportItemEntity;
import com.project.app_service.model.entity.SupplierEntity;
import com.project.app_service.model.request.BookImportItemRequest;
import com.project.app_service.model.request.BookImportRequest;
import com.project.app_service.model.response.BookImportResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.BookImportRepo;
import com.project.app_service.repo.BookRepo;
import com.project.app_service.repo.SupplierRepo;
import com.project.app_service.service.BookImportService;
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
public class BookImportServiceImpl implements BookImportService {
  BookImportRepo bookImportRepo;

  BookImportMapper bookImportMapper;

  BookRepo bookRepo;

  SupplierRepo supplierRepo;

  MessageSource messageSource;

  LogService logService;

  @Override
  @Transactional
  public BookImportResponse create(BookImportRequest bookImportRequest) throws Exception {
    if (bookImportRepo.existsById(bookImportRequest.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_IMPORT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    BookImportEntity bookImport = bookImportMapper.toEntity(bookImportRequest);

    SupplierEntity supplier =
        supplierRepo
            .findById(bookImportRequest.getSupplierId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.SUPPLIER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    bookImport.setSupplier(supplier);

    List<BookImportItemEntity> bookImportItems = new ArrayList<>();

    List<BookEntity> booksToUpdate = new ArrayList<>();

    for (BookImportItemRequest bookImportItemRequest :
        bookImportRequest.getBookImportItemRequests()) {

      BookImportItemEntity bookImportItem = new BookImportItemEntity();

      BookEntity book =
          bookRepo
              .findById(bookImportItemRequest.getBookSku())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.BOOK_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      updateBookStockAndPrice(
          book, bookImportItemRequest.getQuantity(), bookImportItemRequest.getUnitPrice(), false);
      booksToUpdate.add(book);

      bookImportItem.setBookImport(bookImport);
      bookImportItem.setBook(book);
      bookImportItem.setQuantity(bookImportItemRequest.getQuantity());
      bookImportItem.setUnitPrice(bookImportItemRequest.getUnitPrice());
      bookImportItem.setTotalCost(
          Math.floor(bookImportItemRequest.getQuantity() * bookImportItemRequest.getUnitPrice()));

      bookImportItems.add(bookImportItem);
    }

    bookRepo.saveAll(booksToUpdate);

    bookImport.setBookImportItems(bookImportItems);
    bookImport.setTotalCost(
        bookImportItems.stream().mapToDouble(BookImportItemEntity::getTotalCost).sum());

    try {
      bookImportRepo.save(bookImport);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.CREATE_IMPORT_ERROR.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(
        bookImport.getId(), Message.ACTION_CREATE.getKey(), Message.IMPORT_CREATE.getKey());

    return bookImportMapper.toResponse(bookImport);
  }

  @Override
  @Transactional
  public BookImportResponse update(BookImportRequest bookImportRequest) throws Exception {
    BookImportEntity bookImport =
        bookImportRepo
            .findById(bookImportRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.IMPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!bookImport.getStatus()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.UPDATE_IMPORT_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    bookImportMapper.updateEntity(bookImport, bookImportRequest);

    SupplierEntity supplier =
        supplierRepo
            .findById(bookImportRequest.getSupplierId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.SUPPLIER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    bookImport.setSupplier(supplier);

    bookImportRepo.save(bookImport);

    logService.create(
        bookImport.getId(), Message.ACTION_UPDATE.getKey(), Message.IMPORT_UPDATE.getKey());

    return bookImportMapper.toResponse(bookImport);
  }

  @Override
  @Transactional(readOnly = true)
  public BookImportResponse getById(String id) throws Exception {
    BookImportEntity bookImport =
        bookImportRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.IMPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return bookImportMapper.toResponse(bookImport);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<BookImportResponse>> search(
      Specification<BookImportEntity> spec, Pageable pageable) throws Exception {
    Page<BookImportEntity> pageData = bookImportRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(bookImportMapper::toResponse).toList());
  }

  @Override
  @Transactional
  public String cancel(BookImportRequest bookImportRequest) throws Exception {
    BookImportEntity bookImport =
        bookImportRepo
            .findById(bookImportRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.IMPORT_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!bookImport.getStatus()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.CANCEL_IMPORT_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    List<BookEntity> booksToUpdate = new ArrayList<>();

    for (BookImportItemEntity bookImportItem : bookImport.getBookImportItems()) {
      BookEntity book = bookImportItem.getBook();
      updateBookStockAndPrice(
          book, bookImportItem.getQuantity(), bookImportItem.getUnitPrice(), true);
      booksToUpdate.add(book);
    }

    bookRepo.saveAll(booksToUpdate);

    bookImport.setStatus(false);
    bookImport.setReason(bookImportRequest.getReason());

    bookImportRepo.save(bookImport);

    logService.create(
        bookImport.getId(), Message.ACTION_CANCEL.getKey(), Message.IMPORT_CANCEL.getKey());

    return bookImport.getId();
  }

  private void updateBookStockAndPrice(
      BookEntity book, int quantityChange, double unitPrice, boolean isCancel) throws Exception {
    int currentStock = book.getStockQuantity();
    double currentImportPrice = book.getImportPrice();

    int newStockQuantity =
        isCancel ? (currentStock - quantityChange) : (currentStock + quantityChange);

    if (isCancel && newStockQuantity < 0) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.IMPORT_STOCK_OUT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (newStockQuantity == 0) {
      book.setImportPrice(0.0);
      book.setStockQuantity(0);
    } else {
      double totalCurrentValue = currentStock * currentImportPrice;
      double totalNewValue = quantityChange * unitPrice;

      double newImportPrice;
      if (isCancel) {
        newImportPrice = (totalCurrentValue - totalNewValue) / newStockQuantity;
      } else {
        newImportPrice = (totalCurrentValue + totalNewValue) / newStockQuantity;
      }

      book.setImportPrice(Math.floor(newImportPrice));
      book.setStockQuantity(newStockQuantity);
    }
  }
}
