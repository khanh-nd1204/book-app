package com.project.app_service.constant;

import lombok.Getter;

@Getter
public enum User {
  ADMIN("admin@gmail.com", "123456", "Admin"),
  EMPLOYEE("employee@gmail.com", "123456", "Employee"),
  CUSTOMER("customer@gmail.com", "123456", "Customer"),
  ;

  private final String email;
  private final String password;
  private final String name;

  User(String email, String password, String name) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
