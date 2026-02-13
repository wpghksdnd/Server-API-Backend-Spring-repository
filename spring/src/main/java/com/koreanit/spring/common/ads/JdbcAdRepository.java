package com.koreanit.spring.common.ads;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.koreanit.spring.common.ads.dto.AdBannerResponse;
import com.koreanit.spring.common.ads.dto.AdBannerUpsertRequest;

@Repository
public class JdbcAdRepository implements AdRepository {

  private final JdbcTemplate jdbcTemplate;

  public JdbcAdRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<AdBannerResponse> rowMapper = (rs, n) -> {
    AdBannerResponse a = new AdBannerResponse();
    a.setId(rs.getString("id"));
    a.setSlot(rs.getString("slot"));
    a.setTitle(rs.getString("title"));
    a.setDescription(rs.getString("description"));
    a.setImageUrl(rs.getString("image_url"));
    a.setLinkUrl(rs.getString("link_url"));
    a.setBgColor(rs.getString("bg_color"));
    a.setActive(rs.getBoolean("active"));
    a.setPriority(rs.getInt("priority"));
    a.setClicks(rs.getLong("clicks"));
    return a;
  };

  @Override
  public List<AdBannerResponse> findAll() {
    String sql = """
        SELECT id, slot, title, description, image_url, link_url, bg_color, active, priority, clicks
        FROM ads_banners
        ORDER BY slot ASC, priority DESC, id DESC
        """;
    return jdbcTemplate.query(sql, rowMapper);
  }

  @Override
  public List<AdBannerResponse> findBySlot(String slot) {
    String sql = """
        SELECT id, slot, title, description, image_url, link_url, bg_color, active, priority, clicks
        FROM ads_banners
        WHERE slot = ? AND active = true
        ORDER BY priority DESC, id DESC
        """;
    return jdbcTemplate.query(sql, rowMapper, slot);
  }

  @Override
  public String insert(AdBannerUpsertRequest req) {
    String id = UUID.randomUUID().toString();
    String sql = """
        INSERT INTO ads_banners(id, slot, title, description, image_url, link_url, bg_color, active, priority, clicks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """;
    jdbcTemplate.update(sql, id, req.getSlot(), req.getTitle(), req.getDescription(), req.getImageUrl(), req.getLinkUrl(), req.getBgColor(), req.getActive() == null ? true : req.getActive(), req.getPriority() == null ? 0 : req.getPriority());
    return id;
  }

  @Override
  public int update(String id, AdBannerUpsertRequest req) {
    String sql = """
        UPDATE ads_banners
        SET slot=?, title=?, description=?, image_url=?, link_url=?, bg_color=?, active=?, priority=?
        WHERE id=?
        """;
    return jdbcTemplate.update(sql, req.getSlot(), req.getTitle(), req.getDescription(), req.getImageUrl(), req.getLinkUrl(), req.getBgColor(), req.getActive() == null ? true : req.getActive(), req.getPriority() == null ? 0 : req.getPriority(), id);
  }

  @Override
  public int delete(String id) {
    return jdbcTemplate.update("DELETE FROM ads_banners WHERE id=?", id);
  }

  @Override
  public int increaseClick(String id) {
    return jdbcTemplate.update("UPDATE ads_banners SET clicks = clicks + 1 WHERE id=?", id);
  }
}
