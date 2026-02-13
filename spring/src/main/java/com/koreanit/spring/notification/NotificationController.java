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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Notifications", description = "댓글 알림")
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

  @Operation(summary = "댓글 알림 목록")
  @GetMapping("/comments")
  public ApiResponse<List<CommentNotificationResponse>> comments(@RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(notificationService.comments(requiredUserId(), limit));
  }

  @Operation(summary = "댓글 알림 미읽음 개수")
  @GetMapping("/comments/unread-count")
  public ApiResponse<UnreadCountResponse> unreadCount() {
    return ApiResponse.ok(notificationService.unreadCount(requiredUserId()));
  }

  @Operation(summary = "댓글 알림 읽음 처리")
  @PostMapping("/comments/mark-read")
  public ApiResponse<Void> markRead(@RequestBody(required = false) MarkReadRequest req) {
    notificationService.markRead(requiredUserId(), req == null ? null : req.getLastSeenCommentId());
    return ApiResponse.ok();
  }
}
