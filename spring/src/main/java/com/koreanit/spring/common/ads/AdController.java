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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Ads", description = "광고 배너")
@RestController
@RequestMapping("/api/ads")
public class AdController {

  private final AdService adService;

  public AdController(AdService adService) {
    this.adService = adService;
  }

  @Operation(summary = "광고 배너 전체 조회(관리자)")
  @GetMapping
  public ApiResponse<List<AdBannerResponse>> listAll() {
    return ApiResponse.ok(adService.listAll());
  }

  @Operation(summary = "광고 슬롯별 조회")
  @GetMapping("/slots/{slot}")
  public ApiResponse<List<AdBannerResponse>> listBySlot(@PathVariable String slot) {
    return ApiResponse.ok(adService.listBySlot(slot));
  }

  @Operation(summary = "광고 생성(관리자)")
  @PostMapping
  public ApiResponse<String> create(@Valid @RequestBody AdBannerUpsertRequest req) {
    return ApiResponse.ok("OK", adService.create(req));
  }

  @Operation(summary = "광고 수정(관리자)")
  @PutMapping("/{id}")
  public ApiResponse<Void> update(@PathVariable String id, @Valid @RequestBody AdBannerUpsertRequest req) {
    adService.update(id, req);
    return ApiResponse.ok();
  }

  @Operation(summary = "광고 삭제(관리자)")
  @DeleteMapping("/{id}")
  public ApiResponse<Void> delete(@PathVariable String id) {
    adService.delete(id);
    return ApiResponse.ok();
  }

  @Operation(summary = "광고 클릭 집계")
  @PostMapping("/{id}/click")
  public ApiResponse<Void> click(@PathVariable String id) {
    adService.click(id);
    return ApiResponse.ok();
  }
}
