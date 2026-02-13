package com.koreanit.spring.engagement;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.engagement.dto.response.BookmarkedPostResponse;
import com.koreanit.spring.engagement.dto.response.LikedUserResponse;
import com.koreanit.spring.engagement.dto.response.PostEngagementResponse;
import com.koreanit.spring.security.SecurityUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Engagement", description = "좋아요/북마크/집계")
@RestController
@RequestMapping("/api/posts")
public class PostEngagementController {

  private final PostEngagementService postEngagementService;

  public PostEngagementController(PostEngagementService postEngagementService) {
    this.postEngagementService = postEngagementService;
  }

  private long requiredUserId() {
    Long userId = SecurityUtils.currentUserId();
    if (userId == null) {
      throw new ApiException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다");
    }
    return userId;
  }

  @Operation(summary = "좋아요 등록")
  @PostMapping("/{postId}/like")
  public ApiResponse<Void> like(@PathVariable long postId) {
    postEngagementService.like(postId, requiredUserId());
    return ApiResponse.ok();
  }

  @Operation(summary = "좋아요 취소")
  @DeleteMapping("/{postId}/like")
  public ApiResponse<Void> unlike(@PathVariable long postId) {
    postEngagementService.unlike(postId, requiredUserId());
    return ApiResponse.ok();
  }

  @Operation(summary = "북마크 등록")
  @PostMapping("/{postId}/bookmark")
  public ApiResponse<Void> bookmark(@PathVariable long postId) {
    postEngagementService.bookmark(postId, requiredUserId());
    return ApiResponse.ok();
  }

  @Operation(summary = "북마크 취소")
  @DeleteMapping("/{postId}/bookmark")
  public ApiResponse<Void> unbookmark(@PathVariable long postId) {
    postEngagementService.unbookmark(postId, requiredUserId());
    return ApiResponse.ok();
  }

  @Operation(summary = "좋아요/북마크 집계 조회")
  @GetMapping("/{postId}/engagement")
  public ApiResponse<PostEngagementResponse> getEngagement(@PathVariable long postId) {
    Long userId = SecurityUtils.currentUserId();
    return ApiResponse.ok(postEngagementService.get(postId, userId));
  }

  @Operation(summary = "좋아요 누른 사용자 목록")
  @GetMapping("/{postId}/likes/users")
  public ApiResponse<List<LikedUserResponse>> likedUsers(
      @PathVariable long postId,
      @RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(postEngagementService.likedUsers(postId, limit));
  }

  @Operation(summary = "내 북마크 목록")
  @GetMapping("/bookmarks/me")
  public ApiResponse<List<BookmarkedPostResponse>> myBookmarks(
      @RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(postEngagementService.myBookmarks(requiredUserId(), limit));
  }
}
