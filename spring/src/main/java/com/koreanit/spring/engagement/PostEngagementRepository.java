package com.koreanit.spring.engagement;

import java.util.List;

import com.koreanit.spring.engagement.dto.response.BookmarkedPostResponse;
import com.koreanit.spring.engagement.dto.response.LikedUserResponse;

public interface PostEngagementRepository {

  void addLike(long postId, long userId);

  void removeLike(long postId, long userId);

  long countLikes(long postId);

  boolean isLiked(long postId, long userId);

  void addBookmark(long postId, long userId);

  void removeBookmark(long postId, long userId);

  long countBookmarks(long postId);

  boolean isBookmarked(long postId, long userId);

  List<LikedUserResponse> findLikedUsers(long postId, int limit);

  List<BookmarkedPostResponse> findBookmarkedPosts(long userId, int limit);
}
