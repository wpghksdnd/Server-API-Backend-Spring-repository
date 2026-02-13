package com.koreanit.spring.common.logging;

import java.time.LocalDateTime;

public class AuditLogEntry {
  private LocalDateTime at;
  private String method;
  private String path;
  private int status;
  private Long userId;
  private long elapsedMs;

  public LocalDateTime getAt() { return at; }
  public void setAt(LocalDateTime at) { this.at = at; }
  public String getMethod() { return method; }
  public void setMethod(String method) { this.method = method; }
  public String getPath() { return path; }
  public void setPath(String path) { this.path = path; }
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }
  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }
  public long getElapsedMs() { return elapsedMs; }
  public void setElapsedMs(long elapsedMs) { this.elapsedMs = elapsedMs; }
}
