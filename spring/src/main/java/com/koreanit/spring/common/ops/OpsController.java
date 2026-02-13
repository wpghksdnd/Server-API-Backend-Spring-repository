package com.koreanit.spring.common.ops;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Ops", description = "운영/헬스 체크")
@RestController
@RequestMapping("/api/ops")
public class OpsController {

  private final JdbcTemplate jdbcTemplate;

  public OpsController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Operation(summary = "운영 헬스 체크")
  @GetMapping("/health")
  public ApiResponse<Map<String, Object>> health() {
    Map<String, Object> data = new HashMap<>();

    data.put("service", "koreanit-spring");
    data.put("uptimeMs", ManagementFactory.getRuntimeMXBean().getUptime());
    data.put("javaVersion", System.getProperty("java.version"));

    try {
      Integer one = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
      data.put("db", one != null && one == 1 ? "UP" : "DOWN");
    } catch (Exception e) {
      data.put("db", "DOWN");
      data.put("dbError", e.getMessage());
    }

    data.put("status", "UP");
    return ApiResponse.ok(data);
  }
}
