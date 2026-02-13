package com.koreanit.spring.common.ads;

import java.util.List;

import org.springframework.stereotype.Service;

import com.koreanit.spring.common.ads.dto.AdBannerResponse;
import com.koreanit.spring.common.ads.dto.AdBannerUpsertRequest;

@Service
public class AdService {

  private final AdRepository adRepository;

  public AdService(AdRepository adRepository) {
    this.adRepository = adRepository;
  }

  public List<AdBannerResponse> listAll() {
    return adRepository.findAll();
  }

  public List<AdBannerResponse> listBySlot(String slot) {
    return adRepository.findBySlot(slot);
  }

  public String create(AdBannerUpsertRequest req) {
    return adRepository.insert(req);
  }

  public void update(String id, AdBannerUpsertRequest req) {
    adRepository.update(id, req);
  }

  public void delete(String id) {
    adRepository.delete(id);
  }

  public void click(String id) {
    adRepository.increaseClick(id);
  }
}
