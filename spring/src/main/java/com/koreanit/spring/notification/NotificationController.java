package com.koreanit.spring.notification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.notification.dto.CommentNotificationResponse;
import com.koreanit.spring.notification.dto.MarkReadRequest;
import com.koreanit.spring.notification.dto.UnreadCountResponse;
import com.koreanit.spring.security.SecurityUtils;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  private long requiredUserId() {
    Long id = SecurityUtils.currentUserId();
    if (id == null) throw new ApiException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다");
    return id;
  }

  @GetMapping("/comments")
  public ApiResponse<List<CommentNotificationResponse>> comments(@RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(notificationService.comments(requiredUserId(), limit));
  }

  @GetMapping("/comments/unread-count")
  public ApiResponse<UnreadCountResponse> unreadCount() {
    return ApiResponse.ok(notificationService.unreadCount(requiredUserId()));
  }

  @PostMapping("/comments/mark-read")
  public ApiResponse<Void> markRead(@RequestBody(required = false) MarkReadRequest req) {
    notificationService.markRead(requiredUserId(), req == null ? null : req.getLastSeenCommentId());
    return ApiResponse.ok();
  }
}
