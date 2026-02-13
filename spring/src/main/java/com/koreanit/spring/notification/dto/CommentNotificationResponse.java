package com.koreanit.spring.notification.dto;

import java.time.LocalDateTime;

public class CommentNotificationResponse {
  private long commentId;
  private long postId;
  private String type; // POST_COMMENT | REPLY
  private String content;
  private boolean read;
  private LocalDateTime createdAt;

  public long getCommentId() { return commentId; }
  public void setCommentId(long commentId) { this.commentId = commentId; }
  public long getPostId() { return postId; }
  public void setPostId(long postId) { this.postId = postId; }
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public boolean isRead() { return read; }
  public void setRead(boolean read) { this.read = read; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
