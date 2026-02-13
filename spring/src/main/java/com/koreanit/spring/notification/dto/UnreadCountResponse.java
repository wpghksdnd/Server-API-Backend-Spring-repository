package com.koreanit.spring.notification.dto;

public class UnreadCountResponse {
  private long unreadCount;
  private long lastSeenCommentId;

  public long getUnreadCount() {
    return unreadCount;
  }

  public void setUnreadCount(long unreadCount) {
    this.unreadCount = unreadCount;
  }

  public long getLastSeenCommentId() {
    return lastSeenCommentId;
  }

  public void setLastSeenCommentId(long lastSeenCommentId) {
    this.lastSeenCommentId = lastSeenCommentId;
  }
}
