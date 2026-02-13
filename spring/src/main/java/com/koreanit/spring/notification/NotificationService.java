package com.koreanit.spring.notification;

import java.util.List;

import org.springframework.stereotype.Service;

import com.koreanit.spring.notification.dto.CommentNotificationResponse;
import com.koreanit.spring.notification.dto.UnreadCountResponse;

@Service
public class NotificationService {

  private final NotificationRepository notificationRepository;

  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public List<CommentNotificationResponse> comments(long userId, int limit) {
    int l = limit <= 0 ? 20 : Math.min(limit, 100);
    return notificationRepository.findCommentNotifications(userId, l);
  }

  public UnreadCountResponse unreadCount(long userId) {
    long lastSeen = notificationRepository.findLastSeenCommentId(userId);
    long unread = notificationRepository.countUnreadCommentNotifications(userId, lastSeen);
    UnreadCountResponse r = new UnreadCountResponse();
    r.setLastSeenCommentId(lastSeen);
    r.setUnreadCount(unread);
    return r;
  }

  public void markRead(long userId, Long lastSeenCommentIdOrNull) {
    long target = lastSeenCommentIdOrNull == null ? 0L : lastSeenCommentIdOrNull;
    if (target == 0L) {
      var list = notificationRepository.findCommentNotifications(userId, 1);
      if (!list.isEmpty()) target = list.get(0).getCommentId();
    }
    notificationRepository.upsertLastSeenCommentId(userId, target);
  }
}
