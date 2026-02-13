package com.koreanit.spring.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.user.UserMapper;
import com.koreanit.spring.user.UserService;
import com.koreanit.spring.user.dto.request.UserLoginRequest;
import com.koreanit.spring.user.dto.response.UserResponse;

import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Tag(name = "Auth", description = "로그인/로그아웃/내 정보")
@RestController
@RequestMapping("/api")
public class AuthController {

    public static final String SESSION_USER_ID = "LOGIN_USER_ID";

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ApiResponse<Long> login(@Valid @RequestBody UserLoginRequest req, HttpSession session) {
      Long userId = userService.login(req.getUsername(), req.getPassword());
      session.setAttribute(SESSION_USER_ID, userId);
      return ApiResponse.ok(userId);
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok();
    }

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public ApiResponse<UserResponse> me(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다");
        }
        return ApiResponse.ok(UserMapper.toResponse(userService.get(userId)));
    }
}
