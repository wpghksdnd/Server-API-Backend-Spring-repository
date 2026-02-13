package com.koreanit.spring.comment;

import java.util.List;

public interface CommentRepository {

    long save(long postId, long userId, String content, Long parentId);

    CommentEntity findById(long id);

    List<CommentEntity> findAllByPostId(long postId, Long beforeId, int limit);

    List<CommentEntity> findAllByUserId(long userId, int limit);

    int deleteById(long id);

    boolean isOwner(long commentId, long userId);
}