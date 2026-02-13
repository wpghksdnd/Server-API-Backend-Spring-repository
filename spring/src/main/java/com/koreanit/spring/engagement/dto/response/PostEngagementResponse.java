package com.koreanit.spring.engagement.dto.response;

public class PostEngagementResponse {
  private long postId;
  private boolean liked;
  private boolean bookmarked;
  private long likeCount;
  private long bookmarkCount;

  public long getPostId() {
    return postId;
  }

  public void setPostId(long postId) {
    this.postId = postId;
  }

  public boolean isLiked() {
    return liked;
  }

  public void setLiked(boolean liked) {
    this.liked = liked;
  }

  public boolean isBookmarked() {
    return bookmarked;
  }

  public void setBookmarked(boolean bookmarked) {
    this.bookmarked = bookmarked;
  }

  public long getLikeCount() {
    return likeCount;
  }

  public void setLikeCount(long likeCount) {
    this.likeCount = likeCount;
  }

  public long getBookmarkCount() {
    return bookmarkCount;
  }

  public void setBookmarkCount(long bookmarkCount) {
    this.bookmarkCount = bookmarkCount;
  }
}
