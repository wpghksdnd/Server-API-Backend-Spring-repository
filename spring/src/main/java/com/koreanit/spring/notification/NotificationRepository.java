package com.koreanit.spring.notification;

import java.util.List;

import com.koreanit.spring.notification.dto.CommentNotificationResponse;

public interface NotificationRepository {
  List<CommentNotificationResponse> findCommentNotifications(long userId, int limit);
  long findLastSeenCommentId(long userId);
  void upsertLastSeenCommentId(long userId, long lastSeenCommentId);
  long countUnreadCommentNotifications(long userId, long lastSeenCommentId);
}
