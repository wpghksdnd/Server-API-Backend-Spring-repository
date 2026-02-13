package com.koreanit.spring.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

//현재 로그인 사용자 id 유틸
public class SecurityUtils {

  private SecurityUtils() {}

  public static Long currentUserId() {
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    if (a == null) return null;

    Object p = a.getPrincipal();
    if (p instanceof LoginUser u) {
      return u.getId();
    }
    return null;
  }
}