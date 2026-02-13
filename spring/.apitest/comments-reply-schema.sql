ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS parent_id BIGINT NULL;

CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
