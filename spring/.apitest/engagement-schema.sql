-- 좋아요/북마크 테이블 생성

CREATE TABLE IF NOT EXISTS post_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_post_like UNIQUE (post_id, user_id),
  INDEX idx_post_likes_post_id (post_id),
  INDEX idx_post_likes_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS post_bookmarks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_post_bookmark UNIQUE (post_id, user_id),
  INDEX idx_post_bookmarks_post_id (post_id),
  INDEX idx_post_bookmarks_user_id (user_id)
);
