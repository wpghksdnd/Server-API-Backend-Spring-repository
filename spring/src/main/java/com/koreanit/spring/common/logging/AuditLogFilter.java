package com.koreanit.spring.common.logging;

import java.io.IOException;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.koreanit.spring.security.SecurityUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(2)
public class AuditLogFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(AuditLogFilter.class);
  private final AuditLogStore auditLogStore;

  public AuditLogFilter(AuditLogStore auditLogStore) {
    this.auditLogStore = auditLogStore;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    long start = System.currentTimeMillis();
    filterChain.doFilter(request, response);

    String method = request.getMethod();
    if (!("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))) {
      return;
    }

    Long userId = SecurityUtils.currentUserId();
    long elapsed = System.currentTimeMillis() - start;

    log.info("AUDIT method={} path={} status={} userId={} elapsedMs={}",
        method,
        request.getRequestURI(),
        response.getStatus(),
        userId,
        elapsed);

    AuditLogEntry e = new AuditLogEntry();
    e.setAt(LocalDateTime.now());
    e.setMethod(method);
    e.setPath(request.getRequestURI());
    e.setStatus(response.getStatus());
    e.setUserId(userId);
    e.setElapsedMs(elapsed);
    auditLogStore.add(e);
  }
}
