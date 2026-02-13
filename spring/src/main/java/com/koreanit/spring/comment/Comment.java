package com.koreanit.spring.comment;

import java.time.LocalDateTime;

public class Comment {

    private final long id;
    private final long postId;
    private final long userId;
    private final String content;
    private final Long parentId;
    private final LocalDateTime createdAt;

    private Comment(long id, long postId, long userId, String content, Long parentId, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.parentId = parentId;
        this.createdAt = createdAt;
    }

    public static Comment of(long id, long postId, long userId, String content, Long parentId, LocalDateTime createdAt) {
        return new Comment(id, postId, userId, content, parentId, createdAt);
    }

    public long getId() { return id; }
    public long getPostId() { return postId; }
    public long getUserId() { return userId; }
    public String getContent() { return content; }
    public Long getParentId() { return parentId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}