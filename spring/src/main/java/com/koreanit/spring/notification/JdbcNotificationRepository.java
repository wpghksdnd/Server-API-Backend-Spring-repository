package com.koreanit.spring.notification;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.koreanit.spring.notification.dto.CommentNotificationResponse;

@Repository
public class JdbcNotificationRepository implements NotificationRepository {

  private final JdbcTemplate jdbcTemplate;

  public JdbcNotificationRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<CommentNotificationResponse> rowMapper = (rs, n) -> {
    CommentNotificationResponse r = new CommentNotificationResponse();
    r.setCommentId(rs.getLong("comment_id"));
    r.setPostId(rs.getLong("post_id"));
    r.setType(rs.getString("type"));
    r.setContent(rs.getString("content"));
    r.setRead(rs.getLong("comment_id") <= rs.getLong("last_seen_comment_id"));
    r.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
    return r;
  };

  @Override
  public List<CommentNotificationResponse> findCommentNotifications(long userId, int limit) {
    String sql = """
        SELECT t.comment_id, t.post_id, t.type, t.content, t.created_at,
               COALESCE(s.last_seen_comment_id, 0) AS last_seen_comment_id
        FROM (
          SELECT c.id AS comment_id, c.post_id, 'POST_COMMENT' AS type, c.content, c.created_at
          FROM comments c
          JOIN posts p ON p.id = c.post_id
          WHERE p.user_id = ? AND c.user_id <> ?
          UNION ALL
          SELECT c.id AS comment_id, c.post_id, 'REPLY' AS type, c.content, c.created_at
          FROM comments c
          JOIN comments parent ON parent.id = c.parent_id
          WHERE parent.user_id = ? AND c.user_id <> ?
        ) t
        LEFT JOIN notification_read_state s ON s.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT ?
        """;
    return jdbcTemplate.query(sql, rowMapper, userId, userId, userId, userId, userId, limit);
  }

  @Override
  public long findLastSeenCommentId(long userId) {
    String sql = "SELECT last_seen_comment_id FROM notification_read_state WHERE user_id = ?";
    var list = jdbcTemplate.query(sql, (rs, n) -> rs.getLong(1), userId);
    return list.isEmpty() ? 0L : list.get(0);
  }

  @Override
  public void upsertLastSeenCommentId(long userId, long lastSeenCommentId) {
    String sql = """
        INSERT INTO notification_read_state(user_id, last_seen_comment_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE last_seen_comment_id = VALUES(last_seen_comment_id)
        """;
    jdbcTemplate.update(sql, userId, lastSeenCommentId);
  }

  @Override
  public long countUnreadCommentNotifications(long userId, long lastSeenCommentId) {
    String sql = """
        SELECT COUNT(*) FROM (
          SELECT c.id AS comment_id
          FROM comments c
          JOIN posts p ON p.id = c.post_id
          WHERE p.user_id = ? AND c.user_id <> ?
          UNION ALL
          SELECT c.id AS comment_id
          FROM comments c
          JOIN comments parent ON parent.id = c.parent_id
          WHERE parent.user_id = ? AND c.user_id <> ?
        ) t
        WHERE t.comment_id > ?
        """;
    Long cnt = jdbcTemplate.queryForObject(sql, Long.class, userId, userId, userId, userId, lastSeenCommentId);
    return cnt == null ? 0L : cnt;
  }
}
