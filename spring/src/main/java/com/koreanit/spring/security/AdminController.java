package com.koreanit.spring.security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.logging.AuditLogStore;
import com.koreanit.spring.common.response.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final AuditLogStore auditLogStore;
  private final JdbcTemplate jdbcTemplate;

  public AdminController(AuditLogStore auditLogStore, JdbcTemplate jdbcTemplate) {
    this.auditLogStore = auditLogStore;
    this.jdbcTemplate = jdbcTemplate;
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/me")
  public ApiResponse<String> me() {
    return ApiResponse.ok("OK", "ADMIN");
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/recent-actions")
  public ApiResponse<Object> recentActions(@RequestParam(defaultValue = "15") int limit) {
    return ApiResponse.ok(auditLogStore.recent(limit));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/summary")
  public ApiResponse<Map<String, Object>> summary() {
    Map<String, Object> out = new HashMap<>();

    Long totalAds = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ads_banners", Long.class);
    Long activeAds = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ads_banners WHERE active = true", Long.class);
    Long clicks = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(clicks), 0) FROM ads_banners", Long.class);

    out.put("totalAds", totalAds == null ? 0 : totalAds);
    out.put("activeAds", activeAds == null ? 0 : activeAds);
    out.put("totalClicks", clicks == null ? 0 : clicks);
    return ApiResponse.ok(out);
  }
}
