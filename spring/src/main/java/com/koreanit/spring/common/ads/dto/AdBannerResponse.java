package com.koreanit.spring.common.ads.dto;

public class AdBannerResponse {
  private String id;
  private String slot;
  private String title;
  private String description;
  private String imageUrl;
  private String linkUrl;
  private String bgColor;
  private boolean active;
  private int priority;
  private long clicks;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getSlot() { return slot; }
  public void setSlot(String slot) { this.slot = slot; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
  public String getLinkUrl() { return linkUrl; }
  public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }
  public String getBgColor() { return bgColor; }
  public void setBgColor(String bgColor) { this.bgColor = bgColor; }
  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }
  public int getPriority() { return priority; }
  public void setPriority(int priority) { this.priority = priority; }
  public long getClicks() { return clicks; }
  public void setClicks(long clicks) { this.clicks = clicks; }
}
