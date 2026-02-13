package com.koreanit.spring.comment;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.comment.dto.request.CommentCreateRequest;
import com.koreanit.spring.comment.dto.response.CommentResponse;
import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.security.SecurityUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Comments", description = "댓글/대댓글")
@RestController
@RequestMapping("/api")
public class CommentController {

  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  private long requiredUserId() {
    Long userId = SecurityUtils.currentUserId();
    if (userId == null) {
      throw new ApiException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다");
    }
    return userId;
  }

  @Operation(summary = "댓글/대댓글 작성")
  @PostMapping("/posts/{postId}/comments")
  public ApiResponse<CommentResponse> create(
      @PathVariable long postId,
      @Valid @RequestBody CommentCreateRequest req) {
    Comment created = commentService.create(postId, requiredUserId(), req.getContent(), req.getParentId());
    return ApiResponse.ok(CommentMapper.toResponse(created));
  }

  @Operation(summary = "게시글 댓글 목록 조회")
  @GetMapping("/posts/{postId}/comments")
  public ApiResponse<List<CommentResponse>> list(
      @PathVariable long postId,
      @RequestParam(required = false) Long before,
      @RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(
        CommentMapper.toResponseList(commentService.list(postId, before, limit)));
  }

  @Operation(summary = "내 댓글 목록 조회")
  @GetMapping("/comments/me")
  public ApiResponse<List<CommentResponse>> myComments(
      @RequestParam(defaultValue = "20") int limit) {
    return ApiResponse.ok(CommentMapper.toResponseList(commentService.listMine(requiredUserId(), limit)));
  }

  @Operation(summary = "댓글 삭제")
  @DeleteMapping("/comments/{id}")
  public ApiResponse<Void> delete(@PathVariable long id) {
    commentService.delete(id);
    return ApiResponse.ok();
  }
}