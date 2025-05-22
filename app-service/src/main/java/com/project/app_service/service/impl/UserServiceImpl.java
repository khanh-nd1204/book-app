package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.constant.User;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.exception.UnauthorizedException;
import com.project.app_service.mapper.UserMapper;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.MailRequest;
import com.project.app_service.model.request.UserRequest;
import com.project.app_service.model.response.PageResponse;
import com.project.app_service.model.response.UserResponse;
import com.project.app_service.repo.RoleRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.EmailService;
import com.project.app_service.service.LogService;
import com.project.app_service.service.UserService;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.util.SecurityUtil;
import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceImpl implements UserService {

  UserRepo userRepo;

  UserMapper userMapper;

  RoleRepo roleRepo;

  BCryptPasswordEncoder passwordEncoder;

  EmailService emailService;

  MessageSource messageSource;

  LogService logService;

  @Value("${spring.mail.expiry-validity-in-seconds}")
  @NonFinal
  int expiryValidityInSeconds;

  @Override
  @Transactional
  public UserResponse create(UserRequest userRequest) throws Exception {
    if (userRepo.existsByEmail(userRequest.getEmail())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_EMAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (userRepo.existsByPhone(userRequest.getPhone())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_PHONE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    UserEntity user = userMapper.toEntity(userRequest);
    user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
    RoleEntity role =
        roleRepo
            .findById(userRequest.getRoleId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ROLE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    user.setRole(role);
    user.setActive(true);

    try {
      userRepo.save(user);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_USER.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    logService.create(user.getName(), Message.ACTION_CREATE.getKey(), Message.USER_CREATE.getKey());

    return userMapper.toResponse(user);
  }

  @Override
  @Transactional
  public int createBulk(List<UserRequest> userRequests) throws Exception {
    if (userRequests == null || userRequests.isEmpty()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.USER_LIST_EMPTY.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    List<UserEntity> usersToSave =
        userRequests.stream()
            .filter(
                userRequest ->
                    !userRepo.existsByEmail(userRequest.getEmail())
                        && !userRepo.existsByPhone(userRequest.getPhone()))
            .map(
                userRequest -> {
                  UserEntity user = userMapper.toEntity(userRequest);
                  user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
                  user.setActive(true);
                  RoleEntity role = roleRepo.findByName(userRequest.getRoleName()).orElse(null);
                  user.setRole(role);
                  return user;
                })
            .collect(Collectors.toList());

    if (!usersToSave.isEmpty()) {
      try {
        List<UserEntity> usersSave = userRepo.saveAll(usersToSave);
        logService.create(
            String.valueOf(usersSave.size()),
            Message.ACTION_CREATE.getKey(),
            Message.CREATE_BULK_USER.getKey());
        return usersSave.size();
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
  public UserResponse update(UserRequest userRequest) throws Exception {
    UserEntity user =
        userRepo
            .findById(userRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    UserEntity existPhone = userRepo.findByPhone(userRequest.getPhone()).orElse(null);
    if (existPhone != null && !existPhone.getId().equals(user.getId())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_PHONE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    userMapper.updateEntity(user, userRequest);
    if (!user.getEmail().equals(User.ADMIN.getEmail())) {
      RoleEntity role =
          roleRepo
              .findById(userRequest.getRoleId())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          messageSource.getMessage(
                              Message.ROLE_NOT_FOUND.getKey(),
                              null,
                              LanguageUtil.getCurrentLocale())));
      user.setRole(role);
    }
    userRepo.save(user);
    logService.create(user.getName(), Message.ACTION_UPDATE.getKey(), Message.USER_UPDATE.getKey());
    return userMapper.toResponse(user);
  }

  @Override
  @Transactional(readOnly = true)
  //    @PreAuthorize("hasRole('ADMIN') or hasRole('USES')") ==
  //    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  //    @PreAuthorize("hasAuthority('GET_USER')")
  //    @PostAuthorize("returnObject.email == authentication.name")
  public UserResponse getById(String id) throws Exception {
    UserEntity user =
        userRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    return userMapper.toResponse(user);
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<List<UserResponse>> search(Specification<UserEntity> spec, Pageable pageable)
      throws Exception {
    Specification<UserEntity> activeUsers =
        (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("active"));
    Page<UserEntity> pageData = userRepo.findAll(spec.and(activeUsers), pageable);

    return new PageResponse<>(
        pageable.getPageNumber() + 1,
        pageable.getPageSize(),
        pageData.getTotalElements(),
        pageData.getTotalPages(),
        pageData.getContent().stream().map(userMapper::toResponse).toList());
  }

  @Override
  @Transactional
  public String delete(String id) throws Exception {
    UserEntity user =
        userRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (user.getRole() != null && user.getRole().getName().equals(Role.ADMIN.getName())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACTION_DELETE_FAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    user.setActive(false);
    userRepo.save(user);
    logService.create(user.getName(), Message.ACTION_DELETE.getKey(), Message.USER_DELETE.getKey());
    return user.getId();
  }

  @Override
  public UserEntity getByEmail(String email) {
    return userRepo
        .findByEmail(email)
        .orElseThrow(
            () ->
                new NotFoundException(
                    messageSource.getMessage(
                        Message.USER_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale())));
  }

  @Override
  public void updateToken(String id, String token) {
    UserEntity user =
        userRepo
            .findById(id)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    user.setRefreshToken(token);
    userRepo.save(user);
  }

  @Override
  public UserEntity getByEmailAndRefreshToken(String email, String refreshToken) {
    return userRepo
        .findByEmailAndRefreshToken(email, refreshToken)
        .orElseThrow(
            () ->
                new NotFoundException(
                    messageSource.getMessage(
                        Message.USER_NOT_FOUND.getKey(), null, LanguageUtil.getCurrentLocale())));
  }

  @Override
  @Transactional
  public String resetPassword(UserRequest userRequest) throws Exception {
    UserEntity user =
        userRepo
            .findByEmail(userRequest.getEmail())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!user.getActive()) {
      throw new DisabledException(
          messageSource.getMessage(
              Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    verifyOtp(user, userRequest.getOtp());

    user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
    userRepo.save(user);

    logService.create(
        user.getName(),
        Message.RESET_PASSWORD_SUCCESS.getKey(),
        Message.USER_RESET_PASSWORD.getKey());

    return user.getId();
  }

  @Override
  @Transactional
  @PostAuthorize("returnObject.email == authentication.name")
  public UserResponse changePassword(UserRequest userRequest) throws Exception {
    UserEntity user =
        userRepo
            .findById(userRequest.getId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!passwordEncoder.matches(userRequest.getCurrentPassword(), user.getPassword())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.PASSWORD_INCORRECT.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    String newPassword = passwordEncoder.encode(userRequest.getNewPassword());
    user.setPassword(newPassword);
    userRepo.save(user);

    logService.create(
        user.getName(),
        Message.ACTION_CHANGE_PASSWORD.getKey(),
        Message.USER_CHANGE_PASSWORD.getKey());

    return userMapper.toResponse(user);
  }

  @Override
  @Transactional
  public UserResponse register(UserRequest userRequest) throws Exception {
    if (userRepo.existsByEmail(userRequest.getEmail())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_EMAIL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (userRepo.existsByPhone(userRequest.getPhone())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXISTS_PHONE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    UserEntity user = userMapper.toEntity(userRequest);
    user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
    user.setActive(false);

    RoleEntity role =
        roleRepo
            .findByName(Role.CUSTOMER.getName())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.ROLE_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));
    user.setRole(role);

    try {
      userRepo.save(user);
    } catch (DataIntegrityViolationException e) {
      throw new DataIntegrityViolationException(
          messageSource.getMessage(
              Message.EXISTS_USER.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    generateOTPAndEmailLog(user);

    return userMapper.toResponse(user);
  }

  @Override
  @Transactional
  public String activate(UserRequest userRequest) throws Exception {
    UserEntity user =
        userRepo
            .findByEmail(userRequest.getEmail())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.USER_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (user.getActive()) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACCOUNT_ENABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    verifyOtp(user, userRequest.getOtp());

    user.setActive(true);
    userRepo.save(user);

    logService.create(
        user.getName(), Message.ACTION_ACTIVATE.getKey(), Message.USER_ACTIVATE.getKey());

    return user.getId();
  }

  @Override
  @Transactional
  public String sendMail(MailRequest mailRequest) throws Exception {
    UserEntity user =
        userRepo
            .findByEmail(mailRequest.getEmail())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        messageSource.getMessage(
                            Message.EMAIL_NOT_FOUND.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (user.getActive() && mailRequest.getType().equals(1)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.ACCOUNT_ENABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (!user.getActive() && mailRequest.getType().equals(2)) {
      throw new DisabledException(
          messageSource.getMessage(
              Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    generateOTPAndEmailLog(user);

    return user.getId();
  }

  @Override
  public UserResponse getInfo() throws Exception {
    String email =
        SecurityUtil.getCurrentUserLogin()
            .orElseThrow(
                () ->
                    new UnauthorizedException(
                        messageSource.getMessage(
                            Message.INVALID_TOKEN.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    UserEntity user = getByEmail(email);

    if (!user.getActive()) {
      throw new DisabledException(
          messageSource.getMessage(
              Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return userMapper.toResponse(user);
  }

  @Transactional
  public void generateOTPAndEmailLog(UserEntity user) throws Exception {
    int otp = new Random().nextInt(900000) + 100000;
    Instant otpExpiry = Instant.now().plusSeconds(expiryValidityInSeconds);

    emailService.saveEmailLog(user.getEmail(), "OTP Authentication", "otp-template", otpExpiry);

    user.setOtp(otp);
    user.setOtpValidity(otpExpiry);
    userRepo.save(user);
  }

  private void verifyOtp(UserEntity user, int enteredOtp) throws Exception {
    if (user.getOtp() == null || !user.getOtp().equals(enteredOtp)) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.INVALID_OTP.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (user.getOtpValidity().isBefore(Instant.now())) {
      throw new BadRequestException(
          messageSource.getMessage(
              Message.EXPIRED_OTP.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    user.setOtp(null);
    user.setOtpValidity(null);
    userRepo.save(user);
  }
}
