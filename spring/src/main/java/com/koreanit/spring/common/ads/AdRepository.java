package com.koreanit.spring.common.ads;

import java.util.List;

import com.koreanit.spring.common.ads.dto.AdBannerResponse;
import com.koreanit.spring.common.ads.dto.AdBannerUpsertRequest;

public interface AdRepository {
  List<AdBannerResponse> findAll();
  List<AdBannerResponse> findBySlot(String slot);
  String insert(AdBannerUpsertRequest req);
  int update(String id, AdBannerUpsertRequest req);
  int delete(String id);
  int increaseClick(String id);
}
