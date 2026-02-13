package com.koreanit.spring.engagement;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.engagement.dto.response.BookmarkedPostResponse;
import com.koreanit.spring.engagement.dto.response.LikedUserResponse;
import com.koreanit.spring.engagement.dto.response.PostEngagementResponse;
import com.koreanit.spring.post.PostRepository;

@Service
public class PostEngagementService {

  private static final int MAX_LIMIT = 100;

  private final PostRepository postRepository;
  private final PostEngagementRepository engagementRepository;

  public PostEngagementService(PostRepository postRepository, PostEngagementRepository engagementRepository) {
    this.postRepository = postRepository;
    this.engagementRepository = engagementRepository;
  }

  private void validatePostExists(long postId) {
    try {
      postRepository.findById(postId);
    } catch (EmptyResultDataAccessException e) {
      throw new ApiException(ErrorCode.NOT_FOUND_RESOURCE, "존재하지 않는 게시글입니다. id=" + postId);
    }
  }

  private int normalizeLimit(int limit) {
    if (limit <= 0) {
      throw new ApiException(ErrorCode.INVALID_REQUEST, "limit 값이 유효하지 않습니다");
    }
    return Math.min(limit, MAX_LIMIT);
  }

  public void like(long postId, long userId) {
    validatePostExists(postId);
    engagementRepository.addLike(postId, userId);
  }

  public void unlike(long postId, long userId) {
    validatePostExists(postId);
    engagementRepository.removeLike(postId, userId);
  }

  public void bookmark(long postId, long userId) {
    validatePostExists(postId);
    engagementRepository.addBookmark(postId, userId);
  }

  public void unbookmark(long postId, long userId) {
    validatePostExists(postId);
    engagementRepository.removeBookmark(postId, userId);
  }

  public PostEngagementResponse get(long postId, Long userIdOrNull) {
    validatePostExists(postId);

    PostEngagementResponse res = new PostEngagementResponse();
    res.setPostId(postId);
    res.setLikeCount(engagementRepository.countLikes(postId));
    res.setBookmarkCount(engagementRepository.countBookmarks(postId));

    if (userIdOrNull == null) {
      res.setLiked(false);
      res.setBookmarked(false);
    } else {
      res.setLiked(engagementRepository.isLiked(postId, userIdOrNull));
      res.setBookmarked(engagementRepository.isBookmarked(postId, userIdOrNull));
    }

    return res;
  }

  public List<LikedUserResponse> likedUsers(long postId, int limit) {
    validatePostExists(postId);
    return engagementRepository.findLikedUsers(postId, normalizeLimit(limit));
  }

  public List<BookmarkedPostResponse> myBookmarks(long userId, int limit) {
    return engagementRepository.findBookmarkedPosts(userId, normalizeLimit(limit));
  }
}
