package com.koreanit.spring.notification.dto;

public class MarkReadRequest {
  private Long lastSeenCommentId;

  public Long getLastSeenCommentId() {
    return lastSeenCommentId;
  }

  public void setLastSeenCommentId(Long lastSeenCommentId) {
    this.lastSeenCommentId = lastSeenCommentId;
  }
}
