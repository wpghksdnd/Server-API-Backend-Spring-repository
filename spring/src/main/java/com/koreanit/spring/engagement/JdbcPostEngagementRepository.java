package com.koreanit.spring.engagement;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.koreanit.spring.engagement.dto.response.BookmarkedPostResponse;
import com.koreanit.spring.engagement.dto.response.LikedUserResponse;

@Repository
public class JdbcPostEngagementRepository implements PostEngagementRepository {

  private final JdbcTemplate jdbcTemplate;

  public JdbcPostEngagementRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<LikedUserResponse> likedUserRowMapper = (rs, rowNum) -> {
    LikedUserResponse r = new LikedUserResponse();
    r.setId(rs.getLong("id"));
    r.setUsername(rs.getString("username"));
    r.setNickname(rs.getString("nickname"));
    return r;
  };

  private final RowMapper<BookmarkedPostResponse> bookmarkedPostRowMapper = (rs, rowNum) -> {
    BookmarkedPostResponse r = new BookmarkedPostResponse();
    r.setId(rs.getLong("id"));
    r.setUserId(rs.getLong("user_id"));
    r.setTitle(rs.getString("title"));
    r.setContent(rs.getString("content"));
    var ts = rs.getTimestamp("created_at");
    if (ts != null) {
      r.setCreatedAt(ts.toLocalDateTime());
    }
    return r;
  };

  @Override
  public void addLike(long postId, long userId) {
    String sql = """
        INSERT IGNORE INTO post_likes(post_id, user_id)
        VALUES (?, ?)
        """;
    jdbcTemplate.update(sql, postId, userId);
  }

  @Override
  public void removeLike(long postId, long userId) {
    String sql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?";
    jdbcTemplate.update(sql, postId, userId);
  }

  @Override
  public long countLikes(long postId) {
    String sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = ?";
    Long count = jdbcTemplate.queryForObject(sql, Long.class, postId);
    return count == null ? 0 : count;
  }

  @Override
  public boolean isLiked(long postId, long userId) {
    String sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND user_id = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, userId);
    return count != null && count > 0;
  }

  @Override
  public void addBookmark(long postId, long userId) {
    String sql = """
        INSERT IGNORE INTO post_bookmarks(post_id, user_id)
        VALUES (?, ?)
        """;
    jdbcTemplate.update(sql, postId, userId);
  }

  @Override
  public void removeBookmark(long postId, long userId) {
    String sql = "DELETE FROM post_bookmarks WHERE post_id = ? AND user_id = ?";
    jdbcTemplate.update(sql, postId, userId);
  }

  @Override
  public long countBookmarks(long postId) {
    String sql = "SELECT COUNT(*) FROM post_bookmarks WHERE post_id = ?";
    Long count = jdbcTemplate.queryForObject(sql, Long.class, postId);
    return count == null ? 0 : count;
  }

  @Override
  public boolean isBookmarked(long postId, long userId) {
    String sql = "SELECT COUNT(*) FROM post_bookmarks WHERE post_id = ? AND user_id = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, userId);
    return count != null && count > 0;
  }

  @Override
  public List<LikedUserResponse> findLikedUsers(long postId, int limit) {
    String sql = """
        SELECT u.id, u.username, u.nickname
        FROM post_likes pl
        JOIN users u ON u.id = pl.user_id
        WHERE pl.post_id = ?
        ORDER BY pl.id DESC
        LIMIT ?
        """;
    return jdbcTemplate.query(sql, likedUserRowMapper, postId, limit);
  }

  @Override
  public List<BookmarkedPostResponse> findBookmarkedPosts(long userId, int limit) {
    String sql = """
        SELECT p.id, p.user_id, p.title, p.content, p.created_at
        FROM post_bookmarks pb
        JOIN posts p ON p.id = pb.post_id
        WHERE pb.user_id = ?
        ORDER BY pb.id DESC
        LIMIT ?
        """;
    return jdbcTemplate.query(sql, bookmarkedPostRowMapper, userId, limit);
  }
}
