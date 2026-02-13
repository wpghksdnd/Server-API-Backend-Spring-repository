package com.koreanit.spring.common.ads.dto;

import jakarta.validation.constraints.NotBlank;

public class AdBannerUpsertRequest {
  @NotBlank
  private String slot;
  @NotBlank
  private String title;
  private String description;
  private String imageUrl;
  private String linkUrl;
  private String bgColor;
  private Boolean active;
  private Integer priority;

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
  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
  public Integer getPriority() { return priority; }
  public void setPriority(Integer priority) { this.priority = priority; }
}
