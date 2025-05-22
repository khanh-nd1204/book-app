package com.project.app_service.service;

import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.MailRequest;
import com.project.app_service.model.request.UserRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.UserResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface UserService {
  UserResponse create(UserRequest userRequest) throws Exception;

  int createBulk(List<UserRequest> userRequests) throws Exception;

  UserResponse update(UserRequest userRequest) throws Exception;

  UserResponse getById(String id) throws Exception;

  PageResponse<List<UserResponse>> search(Specification<UserEntity> spec, Pageable pageable)
      throws Exception;

  String delete(String id) throws Exception;

  UserEntity getByEmail(String email);

  void updateToken(String id, String token);

  UserEntity getByEmailAndRefreshToken(String email, String refreshToken);

  String resetPassword(UserRequest userRequest) throws Exception;

  UserResponse changePassword(UserRequest userRequest) throws Exception;

  UserResponse register(UserRequest userRequest) throws Exception;

  String activate(UserRequest userRequest) throws Exception;

  String sendMail(MailRequest mailRequest) throws Exception;

  UserResponse getInfo() throws Exception;
}
