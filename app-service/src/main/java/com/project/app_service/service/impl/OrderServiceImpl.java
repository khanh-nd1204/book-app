package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.OrderMapper;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.entity.OrderEntity;
import com.project.app_service.model.entity.OrderItemEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.NotificationRequest;
import com.project.app_service.model.request.OrderItemRequest;
import com.project.app_service.model.request.OrderRequest;
import com.project.app_service.model.response.OrderResponse;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.repo.BookRepo;
import com.project.app_service.repo.OrderRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.LogService;
import com.project.app_service.service.NotificationService;
import com.project.app_service.service.OrderService;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.util.SecurityUtil;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
  OrderRepo orderRepo;

  BookRepo bookRepo;

  OrderMapper orderMapper;

  LogService logService;

  MessageSource messageSource;

  NotificationService notificationService;

  UserRepo userRepo;

  @Override
  @Transactional
  public OrderResponse create(OrderRequest orderRequest) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    OrderEntity order = orderMapper.toEntity(orderRequest);

    List<OrderItemEntity> orderItems = new ArrayList<>();

    List<BookEntity> booksToUpdate = new ArrayList<>();

    for (OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
      OrderItemEntity orderItem = new OrderItemEntity();
      BookEntity book =
          bookRepo
              .findById(orderItemRequest.getBookSku())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.BOOK_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      if (book.getStockQuantity() < orderItemRequest.getQuantity()) {
        throw new BadRequestException(
            messageSource.getMessage(
                Message.BOOK_OUT_STOCK.getKey(), null, LanguageUtil.getCurrentLocale()));
      }

      book.setStockQuantity(book.getStockQuantity() - orderItemRequest.getQuantity());
      book.setSoldQuantity(book.getSoldQuantity() + orderItemRequest.getQuantity());
      booksToUpdate.add(book);

      orderItem.setOrder(order);
      orderItem.setBook(book);
      orderItem.setQuantity(orderItemRequest.getQuantity());
      orderItem.setUnitPrice(book.getFinalPrice());
      orderItem.setTotalPrice(Math.floor(book.getFinalPrice() * orderItemRequest.getQuantity()));

      orderItems.add(orderItem);
    }

    bookRepo.saveAll(booksToUpdate);

    order.setOrderItems(orderItems);
    order.setTotalPrice(orderItems.stream().mapToDouble(OrderItemEntity::getTotalPrice).sum());

    order.setIsPayment(
        orderRequest.getVnpTxnRef() != null && !orderRequest.getVnpTxnRef().isEmpty());

    try {
      orderRepo.save(order);

      Thread.sleep(500);

      sendNotificationToUser(Message.NOTI_ORDER.getKey(), null, userId, 1);

      if (order.getIsPayment()) {
        sendNotificationToUser(Message.NOTI_PAYMENT.getKey(), order.getId(), userId, 1);
      }

      sendNotificationToAdminAndEmployee(Message.NOTI_STORE.getKey(), null, 1);

    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_ORDER_CREATE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(order.getId(), Message.ACTION_CREATE.getKey(), Message.ORDER_CREATE.getKey());

    return orderMapper.toResponse(order);
  }

  @Override
  @Transactional
  public OrderResponse update(OrderRequest orderRequest) throws Exception {
    OrderEntity order =
        orderRepo
            .findById(orderRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ORDER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (order.getStatus().equals(0) || order.getStatus().equals(-1)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.UPDATE_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (orderRequest.getStatus() < order.getStatus()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.UPDATE_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (order.getStatus().equals(5)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.UPDATE_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    orderMapper.updateEntity(order, orderRequest);

    if (orderRequest.getStatus().equals(5)) {
      order.setIsPayment(true);
      order.setDeliveredAt(Instant.now());
    }

    orderRepo.save(order);

    UserEntity user =
        userRepo
            .findByEmail(order.getCreatedBy())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (order.getStatus().equals(3)) {
      sendNotificationToUser(Message.NOTI_SHIP.getKey(), order.getId(), user.getId(), 1);
    }

    if (order.getStatus().equals(4)) {
      sendNotificationToUser(Message.NOTI_PREPARE.getKey(), order.getId(), user.getId(), 1);
    }

    if (order.getStatus().equals(5)) {
      sendNotificationToUser(Message.NOTI_FINISH.getKey(), order.getId(), user.getId(), 1);
    }

    logService.create(order.getId(), Message.ACTION_UPDATE.getKey(), Message.ORDER_UPDATE.getKey());

    return orderMapper.toResponse(order);
  }

  @Override
  @Transactional(readOnly = true)
  public OrderResponse getById(String id) throws Exception {
    OrderEntity order =
        orderRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ORDER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    return orderMapper.toResponse(order);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<OrderResponse>> search(
      Specification<OrderEntity> spec, Pageable pageable) throws Exception {
    Page<OrderEntity> pageData = orderRepo.findAll(spec, pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(orderMapper::toResponse).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<OrderResponse>> searchByUser(
      Specification<OrderEntity> spec, Pageable pageable) throws Exception {
    String currentUser =
        SecurityUtil.getCurrentUserLogin()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    Specification<OrderEntity> ordersByUser =
        (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("createdBy"), currentUser);

    Page<OrderEntity> pageData = orderRepo.findAll(spec.and(ordersByUser), pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(orderMapper::toResponse).toList());
  }

  @Override
  @Transactional
  @PostAuthorize("returnObject.createdBy == authentication.name")
  public OrderResponse cancel(OrderRequest orderRequest) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    OrderEntity order =
        orderRepo
            .findById(orderRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ORDER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!order.getStatus().equals(1)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.CANCEL_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    for (OrderItemEntity orderItem : order.getOrderItems()) {
      BookEntity book = orderItem.getBook();
      book.setStockQuantity(book.getStockQuantity() + orderItem.getQuantity());
      book.setSoldQuantity(book.getSoldQuantity() - orderItem.getQuantity());
      bookRepo.save(book);
    }

    order.setStatus(0);
    order.setReason(orderRequest.getReason());
    order.setCanceledAt(Instant.now());
    orderRepo.save(order);

    sendNotificationToUser(Message.NOTI_CANCEL.getKey(), order.getId(), userId, 3);

    sendNotificationToAdminAndEmployee(Message.NOTI_CANCEL_STORE.getKey(), order.getId(), 3);

    logService.create(order.getId(), Message.ACTION_CANCEL.getKey(), Message.ORDER_CANCEL.getKey());

    return orderMapper.toResponse(order);
  }

  @Override
  @Transactional
  public String confirm(String id) throws Exception {
    OrderEntity order =
        orderRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ORDER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!order.getStatus().equals(1)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.CONFIRM_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    order.setStatus(2);
    order.setConfirmedAt(Instant.now());
    orderRepo.save(order);

    UserEntity user =
        userRepo
            .findByEmail(order.getCreatedBy())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    sendNotificationToUser(Message.NOTI_CONFIRM.getKey(), order.getId(), user.getId(), 1);

    logService.create(
        order.getId(), Message.ACTION_CONFIRM.getKey(), Message.ORDER_CONFIRM.getKey());
    return order.getId();
  }

  @Override
  @Transactional
  public String reject(OrderRequest orderRequest) throws Exception {
    OrderEntity order =
        orderRepo
            .findById(orderRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ORDER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!order.getStatus().equals(1)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.REJECT_ORDER_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    for (OrderItemEntity orderItem : order.getOrderItems()) {
      BookEntity book = orderItem.getBook();
      book.setStockQuantity(book.getStockQuantity() + orderItem.getQuantity());
      book.setSoldQuantity(book.getSoldQuantity() - orderItem.getQuantity());
      bookRepo.save(book);
    }

    order.setStatus(-1);
    order.setReason(orderRequest.getReason());
    order.setRejectedAt(Instant.now());
    orderRepo.save(order);

    UserEntity user =
        userRepo
            .findByEmail(order.getCreatedBy())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    sendNotificationToUser(Message.NOTI_REJECT.getKey(), order.getId(), user.getId(), 3);

    logService.create(order.getId(), Message.ACTION_REJECT.getKey(), Message.ORDER_REJECT.getKey());

    return order.getId();
  }

  private void sendNotificationToUser(String messageKey, String orderId, String userId, int type) {
    try {
      String content =
          messageSource.getMessage(
              messageKey, new Object[] {orderId}, LanguageUtil.getCurrentLocale());
      NotificationRequest notificationRequest =
          NotificationRequest.builder().userId(userId).type(type).content(content).build();
      notificationService.sendNotification(notificationRequest);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  private void sendNotificationToAdminAndEmployee(String messageKey, String orderId, int type) {
    List<UserEntity> users =
        Stream.of(
                userRepo.findByRoleName(Role.ADMIN.getName()).orElse(null),
                userRepo.findByRoleName(Role.EMPLOYEE.getName()).orElse(null))
            .filter(Objects::nonNull)
            .toList();

    for (UserEntity user : users) {
      try {
        String content =
            messageSource.getMessage(
                messageKey, new Object[] {orderId}, LanguageUtil.getCurrentLocale());

        NotificationRequest notificationRequest =
            NotificationRequest.builder().userId(user.getId()).type(type).content(content).build();

        notificationService.sendNotification(notificationRequest);
      } catch (Exception e) {
        log.error(e.getMessage());
      }
    }
  }
}
