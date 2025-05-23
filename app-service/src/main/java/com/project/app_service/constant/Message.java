package com.project.app_service.constant;

import lombok.Getter;

@Getter
public enum Message {
  LOGIN_SUCCESS("action.login.success"),
  FETCH_SUCCESS("action.fetch.success"),
  REGISTER_SUCCESS("action.register.success"),
  ACTIVATE_SUCCESS("action.activate.success"),
  REFRESH_TOKEN_SUCCESS("action.refresh_token.success"),
  LOGOUT_SUCCESS("action.logout.success"),
  RESET_PASSWORD_SUCCESS("action.password.reset.success"),
  SEND_EMAIL_SUCCESS("action.email.send.success"),
  CREATE_SUCCESS("action.create.success"),
  UPDATE_SUCCESS("action.update.success"),
  SEARCH_SUCCESS("action.search.success"),
  DELETE_SUCCESS("action.delete.success"),
  CREATE_BULK_BOOK("book.create_bulk"),
  CANCEL_EXPORT_SUCCESS("export.cancel.success"),
  CANCEL_IMPORT_SUCCESS("import.cancel.success"),
  ADD_CART_SUCCESS("action.add_cart.success"),
  UPLOAD_SUCCESS("action.upload.success"),
  READ_SUCCESS("action.read.success"),
  ORDER_SUCCESS("action.order.success"),
  CANCEL_ORDER_SUCCESS("order.cancel.success"),
  CONFIRM_ORDER_SUCCESS("order.confirm.success"),
  REJECT_ORDER_SUCCESS("order.reject.success"),
  REQUEST_SUCCESS("action.request.success"),
  CREATE_BULK_USER("user.create_bulk"),
  CHANGE_PASSWORD_SUCCESS("action.password.change.success"),
  ERROR_SERVER("error.server"),
  ERROR_GENERAL("error.general"),
  ERROR_RESOURCE("error.resource_not_found"),
  ERROR_BAD_REQUEST("error.bad_request"),
  ERROR_UNAUTHORIZED("error.unauthorized"),
  ERROR_FORBIDDEN("error.forbidden"),
  ERROR_INVALID_PARAMETER("error.invalid_parameter"),
  ERROR_MISSING_PARAMETER("error.missing_parameter"),
  ERROR_MISSING_PART("error.missing_part"),
  ERROR_UPLOAD_FILE("error.file.upload"),
  ERROR_FILE_SIZE("error.file_size.exceeded"),
  ACCOUNT_DISABLED("auth.account.disabled"),
  ACTION_LOGIN("action.login"),
  USER_LOGIN("user.login"),
  INVALID_REFRESH_TOKEN("validation.refresh_token.invalid"),
  INVALID_TOKEN("validation.token.invalid"),
  ACTION_LOGOUT("action.logout"),
  USER_LOGOUT("user.logout"),
  EXISTS_EXPORT("validation.export_id.exists"),
  SUPPLIER_NOT_FOUND("validation.supplier.not_found"),
  BOOK_NOT_FOUND("validation.book.not_found"),
  ERROR_CREATE_EXPORT("export.create.error"),
  ACTION_CREATE("action.create"),
  EXPORT_CREATE("export.create"),
  EXPORT_NOT_FOUND("validation.export.not_found"),
  UPDATE_EXPORT_FAIL("export.update.fail"),
  ACTION_UPDATE("action.update"),
  EXPORT_UPDATE("export.update"),
  CANCEL_EXPORT_FAIL("export.cancel.fail"),
  ACTION_CANCEL("action.cancel"),
  EXPORT_CANCEL("export.cancel"),
  EXPORT_STOCK_OUT("export.stock_not_enough"),
  EXISTS_IMPORT("validation.import_id.exists"),
  CREATE_IMPORT_ERROR("import.create.error"),
  IMPORT_CREATE("import.create"),
  IMPORT_NOT_FOUND("validation.import.not_found"),
  UPDATE_IMPORT_FAIL("import.update.fail"),
  IMPORT_UPDATE("import.update"),
  CANCEL_IMPORT_FAIL("import.cancel.fail"),
  IMPORT_CANCEL("import.cancel"),
  IMPORT_STOCK_OUT("import.stock_not_enough"),
  EXISTS_TITLE("validation.title.exists"),
  EXISTS_ISBN("validation.isbn.exists"),
  PUBLISHER_NOT_FOUND("validation.publisher.not_found"),
  CATEGORY_NOT_FOUND("validation.category.not_found"),
  IMAGE_NOT_FOUND("validation.image.not_found"),
  EXISTS_BOOK("validation.book.exists"),
  BOOK_CREATE("book.create"),
  BOOK_LIST_EMPTY("validation.book_list.empty"),
  ACTION_CREATE_FAIL("action.create.fail"),
  BOOK_UPDATE("book.update"),
  ACTION_DELETE("action.delete"),
  BOOK_DELETE("book.delete"),
  NOTI_BOOK_OUT("noti.book.out"),
  USER_NOT_FOUND("validation.user.not_found"),
  ERROR_CART_ADD("cart.add.error"),
  CART_OUT("cart.stock_not_enough"),
  CART_NOT_FOUND("cart.not_found"),
  CART_ITEM_NOT_FOUND("cart.item.not_found"),
  ERROR_CART_REMOVE("cart.remove.error"),
  ERROR_CART_UPDATE("cart.update.error"),
  EXISTS_NAME("validation.name.exists"),
  EXISTS_EMAIL("validation.email.exists"),
  EXISTS_PHONE("validation.phone.exists"),
  EXISTS_SYMBOL("validation.symbol.exists"),
  EXISTS_CATEGORY("validation.category.exists"),
  CATEGORY_CREATE("category.create"),
  CATEGORY_UPDATE("category.update"),
  ACTION_DELETE_FAIL("action.delete.fail"),
  CATEGORY_DELETE("category.delete"),
  EMAIL_NOT_FOUND("validation.email.not_found"),
  ACTION_CLEAN("action.clean"),
  CLEAN_SUCCESS("clean.success"),
  FILE_NULL("file.null"),
  FOLDER_NULL("file.folder_null"),
  INVALID_FILE("file.type_invalid"),
  BOOK_OUT_STOCK("validation.book.out_of_stock"),
  NOTI_ORDER("noti.order.success"),
  NOTI_PAYMENT("noti.payment.success"),
  NOTI_STORE("noti.store.order"),
  ERROR_ORDER_CREATE("order.create.error"),
  ORDER_CREATE("order.create"),
  ORDER_NOT_FOUND("validation.order.not_found"),
  UPDATE_ORDER_FAIL("order.update.fail"),
  NOTI_SHIP("noti.ship.success"),
  NOTI_PREPARE("noti.prepare.success"),
  NOTI_FINISH("noti.finish.success"),
  ORDER_UPDATE("order.update"),
  CANCEL_ORDER_FAIL("order.cancel.fail"),
  NOTI_CANCEL("noti.cancel.success"),
  NOTI_CANCEL_STORE("noti.store.cancel"),
  ORDER_CANCEL("order.cancel"),
  CONFIRM_ORDER_FAIL("order.confirm.fail"),
  NOTI_CONFIRM("noti.confirm.success"),
  ACTION_CONFIRM("action.confirm"),
  ORDER_CONFIRM("order.confirm"),
  REJECT_ORDER_FAIL("order.reject.fail"),
  NOTI_REJECT("noti.reject.success"),
  ACTION_REJECT("action.reject"),
  ORDER_REJECT("order.reject"),
  EXISTS_PERMISSION("validation.permission.exists"),
  PERMISSION_CREATE("permission.create"),
  PERMISSION_NOT_FOUND("validation.permission.not_found"),
  PERMISSION_UPDATE("permission.update"),
  PERMISSION_DELETE("permission.delete"),
  EXISTS_PUBLISHER("validation.publisher.exists"),
  PUBLISHER_CREATE("publisher.create"),
  PUBLISHER_UPDATE("publisher.update"),
  PUBLISHER_DELETE("publisher.delete"),
  EXISTS_ROLE("validation.role.exists"),
  ROLE_CREATE("role.create"),
  ROLE_UPDATE("role.update"),
  ROLE_DELETE("role.delete"),
  ROLE_NOT_FOUND("validation.role.not_found"),
  ACTION_UPDATE_FAIL("action.update.fail"),
  ACCOUNT_INVALID("validation.account.invalid"),
  EXISTS_USER("validation.user.exists"),
  USER_LIST_EMPTY("validation.user.list.empty"),
  USER_CREATE("user.create"),
  USER_UPDATE("user.update"),
  USER_DELETE("user.delete"),
  USER_RESET_PASSWORD("user_password.reset"),
  PASSWORD_INCORRECT("validation.password.incorrect"),
  ACTION_CHANGE_PASSWORD("action.password.change"),
  USER_CHANGE_PASSWORD("user_password.change"),
  ACCOUNT_ENABLED("auth.account.enabled"),
  ACTION_ACTIVATE("action.activate"),
  USER_ACTIVATE("user.activate"),
  INVALID_OTP("validation.otp.invalid"),
  EXPIRED_OTP("validation.otp.expired"),
  ERROR_DENIED("error.access.denied"),
  ROLE_NOT_ASSIGNED("auth.role.not_assigned"),
  EXISTS_TAX("validation.tax_code.exists"),
  EXISTS_SUPPLIER("validation.supplier.exists"),
  SUPPLIER_CREATE("supplier.create"),
  SUPPLIER_UPDATE("supplier.update"),
  SUPPLIER_DELETE("supplier.delete"),
  ;

  private final String key;

  Message(String key) {
    this.key = key;
  }
}
