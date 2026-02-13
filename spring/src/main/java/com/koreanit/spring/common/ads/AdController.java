package com.koreanit.spring.common.ads;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koreanit.spring.common.ads.dto.AdBannerResponse;
import com.koreanit.spring.common.ads.dto.AdBannerUpsertRequest;
import com.koreanit.spring.common.response.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ads")
public class AdController {

  private final AdService adService;

  public AdController(AdService adService) {
    this.adService = adService;
  }

  @GetMapping
  public ApiResponse<List<AdBannerResponse>> listAll() {
    return ApiResponse.ok(adService.listAll());
  }

  @GetMapping("/slots/{slot}")
  public ApiResponse<List<AdBannerResponse>> listBySlot(@PathVariable String slot) {
    return ApiResponse.ok(adService.listBySlot(slot));
  }

  @PostMapping
  public ApiResponse<String> create(@Valid @RequestBody AdBannerUpsertRequest req) {
    return ApiResponse.ok("OK", adService.create(req));
  }

  @PutMapping("/{id}")
  public ApiResponse<Void> update(@PathVariable String id, @Valid @RequestBody AdBannerUpsertRequest req) {
    adService.update(id, req);
    return ApiResponse.ok();
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> delete(@PathVariable String id) {
    adService.delete(id);
    return ApiResponse.ok();
  }

  @PostMapping("/{id}/click")
  public ApiResponse<Void> click(@PathVariable String id) {
    adService.click(id);
    return ApiResponse.ok();
  }
}
