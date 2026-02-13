package com.koreanit.spring.post;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.post.dto.request.PostCreateRequest;
import com.koreanit.spring.post.dto.request.PostUpdateRequest;
import com.koreanit.spring.post.dto.response.PostResponse;
import com.koreanit.spring.security.SecurityUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Posts", description = "게시글 CRUD")
@RestController
@RequestMapping("/api/posts")
public class PostController {

  private final PostService postService;

  public PostController(PostService postService) {
      this.postService = postService;
  }

  @Operation(summary = "게시글 작성")
  @PostMapping
  public ApiResponse<PostResponse> create(@RequestBody @Valid PostCreateRequest req) {
      Long userId = SecurityUtils.currentUserId();
      Post p = postService.create(userId, req.getTitle(), req.getContent());
      return ApiResponse.ok(PostMapper.toResponse(p));
  }

  @Operation(summary = "게시글 목록 조회")
  @GetMapping
  public ApiResponse<List<PostResponse>> list(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "20") int limit) {
    List<Post> posts = postService.list(page, limit);
    return ApiResponse.ok(PostMapper.toResponseList(posts));
  }

  @Operation(summary = "게시글 상세 조회")
  @GetMapping("/{id}")
  public ApiResponse<PostResponse> get(@PathVariable long id) {
      Post p = postService.get(id);
      return ApiResponse.ok(PostMapper.toResponse(p));
  }

  @Operation(summary = "게시글 수정")
  @PutMapping("/{id}")
  public ApiResponse<PostResponse> update(@PathVariable long id, @RequestBody @Valid PostUpdateRequest req) {
      Post p = postService.update(id, req.getTitle(), req.getContent());
      return ApiResponse.ok(PostMapper.toResponse(p));
  }

  @Operation(summary = "게시글 삭제")
  @DeleteMapping("/{id}")
  public ApiResponse<Void> delete(@PathVariable long id) {
      postService.delete(id);
      return ApiResponse.ok();
  }
}