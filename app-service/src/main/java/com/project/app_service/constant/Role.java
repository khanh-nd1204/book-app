package com.project.app_service.constant;

import lombok.Getter;

@Getter
public enum Role {
  ADMIN("ADMIN", "Admin role"),
  EMPLOYEE("EMPLOYEE", "Employee role"),
  CUSTOMER("CUSTOMER", "Customer role");

  private final String name;
  private final String description;

  Role(String name, String description) {
    this.name = name;
    this.description = description;
  }
}
