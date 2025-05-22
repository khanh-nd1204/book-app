package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.mapper.CartMapper;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.entity.CartEntity;
import com.project.app_service.model.entity.CartItemEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.CartItemRequest;
import com.project.app_service.model.response.CartResponse;
import com.project.app_service.repo.BookRepo;
import com.project.app_service.repo.CartRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.CartService;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.util.SecurityUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
  CartRepo cartRepo;

  CartMapper cartMapper;

  MessageSource messageSource;

  BookRepo bookRepo;

  UserRepo userRepo;

  @Override
  @Transactional
  public CartResponse add(CartItemRequest cartItemRequest) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CartEntity cart = cartRepo.findByUserId(userId).orElse(null);

    if (cart == null) {
      cart = createNewCart(userId, cartItemRequest);
    } else {
      updateCart(cart, cartItemRequest);
    }

    cart.setTotalPrice(
        cart.getCartItems().stream().mapToDouble(CartItemEntity::getTotalPrice).sum());

    try {
      cartRepo.save(cart);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_CART_ADD.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return cartMapper.toResponse(cart);
  }

  private CartEntity createNewCart(String userId, CartItemRequest cartItemRequest)
      throws Exception {
    UserEntity user =
        userRepo
            .findById(userId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    BookEntity book =
        bookRepo
            .findById(cartItemRequest.getBookSku())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.BOOK_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (book.getStockQuantity() < cartItemRequest.getQuantity()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.CART_OUT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    CartEntity cart = new CartEntity();
    cart.setUser(user);

    CartItemEntity cartItem = new CartItemEntity();
    cartItem.setCart(cart);
    cartItem.setBook(book);
    cartItem.setQuantity(cartItemRequest.getQuantity());
    cartItem.setUnitPrice(cartItemRequest.getUnitPrice());
    cartItem.setTotalPrice(
        Math.floor(cartItemRequest.getQuantity() * cartItemRequest.getUnitPrice()));

    cart.setCartItems(new ArrayList<>(List.of(cartItem)));

    return cart;
  }

  private void updateCart(CartEntity cart, CartItemRequest cartItemRequest) throws Exception {
    List<CartItemEntity> cartItems = cart.getCartItems();
    boolean itemExists = false;

    for (CartItemEntity item : cartItems) {
      if (item.getBook().getSku().equals(cartItemRequest.getBookSku())) {
        item.setQuantity(item.getQuantity() + cartItemRequest.getQuantity());
        if (item.getBook().getStockQuantity() < item.getQuantity()) {
          throw new BadRequestException(
              messageSource.getMessage(
                  Message.CART_OUT.getKey(), null, LanguageUtil.getCurrentLocale()));
        }
        item.setTotalPrice(Math.floor(item.getQuantity() * item.getUnitPrice()));
        itemExists = true;
        break;
      }
    }

    if (!itemExists) {
      BookEntity book =
          bookRepo
              .findById(cartItemRequest.getBookSku())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.BOOK_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));

      if (book.getStockQuantity() < cartItemRequest.getQuantity()) {
        throw new BadRequestException(
            messageSource.getMessage(
                Message.CART_OUT.getKey(), null, LanguageUtil.getCurrentLocale()));
      }

      CartItemEntity newItem = new CartItemEntity();
      newItem.setCart(cart);
      newItem.setBook(book);
      newItem.setQuantity(cartItemRequest.getQuantity());
      newItem.setUnitPrice(cartItemRequest.getUnitPrice());
      newItem.setTotalPrice(
          Math.floor(cartItemRequest.getQuantity() * cartItemRequest.getUnitPrice()));

      cartItems.add(newItem);
    }

    cart.setCartItems(cartItems);
  }

  @Override
  @Transactional
  public CartResponse remove(CartItemRequest cartItemRequest) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CartEntity cart =
        cartRepo
            .findByUserId(userId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CART_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    List<CartItemEntity> cartItems = cart.getCartItems();
    boolean removed = cartItems.removeIf(item -> item.getId().equals(cartItemRequest.getId()));

    if (!removed) {
      throw new NotFoundException(
          messageSource.getMessage(
              Message.CART_ITEM_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    cart.setCartItems(cartItems);

    cart.setTotalPrice(
        cart.getCartItems().stream().mapToDouble(CartItemEntity::getTotalPrice).sum());

    try {
      cartRepo.save(cart);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_CART_REMOVE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return cartMapper.toResponse(cart);
  }

  @Override
  @Transactional
  public CartResponse update(CartItemRequest cartItemRequest) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CartEntity cart =
        cartRepo
            .findByUserId(userId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CART_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    updateCartItemQuantity(cart, cartItemRequest);

    cart.setTotalPrice(
        cart.getCartItems().stream().mapToDouble(CartItemEntity::getTotalPrice).sum());

    try {
      cartRepo.save(cart);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_CART_UPDATE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return cartMapper.toResponse(cart);
  }

  private void updateCartItemQuantity(CartEntity cart, CartItemRequest cartItemRequest) {
    List<CartItemEntity> cartItems = cart.getCartItems();
    Optional<CartItemEntity> optionalItem =
        cartItems.stream()
            .filter(item -> item.getBook().getSku().equals(cartItemRequest.getBookSku()))
            .findFirst();

    if (optionalItem.isEmpty()) {
      throw new NotFoundException(
          messageSource.getMessage(
              Message.CART_ITEM_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    CartItemEntity item = optionalItem.get();

    int newQuantity = cartItemRequest.getQuantity();

    if (newQuantity <= 0) {
      cartItems.remove(item);
    } else {
      item.setQuantity(newQuantity);
      item.setTotalPrice(Math.floor(newQuantity * item.getUnitPrice()));
    }

    cart.setCartItems(cartItems);
  }

  @Override
  @Transactional(readOnly = true)
  public CartResponse get() throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CartEntity cart =
        cartRepo
            .findByUserId(userId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CART_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    return cartMapper.toResponse(cart);
  }

  @Override
  @Transactional
  public CartResponse reset(List<CartItemRequest> cartItemRequests) throws Exception {
    String userId =
        SecurityUtil.getCurrentUserId()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    CartEntity cart =
        cartRepo
            .findByUserId(userId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.CART_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    List<CartItemEntity> cartItems = cart.getCartItems();

    List<String> orderedItemIds =
        cartItemRequests.stream().map(CartItemRequest::getId).collect(Collectors.toList());

    boolean removedAny = cartItems.removeIf(item -> orderedItemIds.contains(item.getId()));

    if (!removedAny) {
      throw new NotFoundException(
          messageSource.getMessage(
              Message.CART_ITEM_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    cart.setCartItems(cartItems);

    cart.setTotalPrice(
        cart.getCartItems().stream().mapToDouble(CartItemEntity::getTotalPrice).sum());

    try {
      cartRepo.save(cart);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.ERROR_CART_REMOVE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return cartMapper.toResponse(cart);
  }
}
