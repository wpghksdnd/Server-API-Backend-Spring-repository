package com.koreanit.spring.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component //스프링 컨테이너가 자동으로 new해줌
@Order(Ordered.HIGHEST_PRECEDENCE) //필터중에서도 가장먼저 실행시키기위한 어노테이션
public class AccessLogFilter extends OncePerRequestFilter { //이게 필터역할, 기본적으로 필터가있긴함
//OncePerRequestFilter: 요청당 한번만 실행되는 필터
  private static final Logger log = LoggerFactory.getLogger(AccessLogFilter.class);

  private boolean isNoiseRequest(String uri) { //브라우저나 OS에서 자동으로 요청하는 노이즈성 요청들, 유틸메서드
    return uri.equals("/favicon.ico")
        || uri.equals("/robots.txt")
        || uri.equals("/manifest.json")
        || uri.equals("/site.webmanifest")
        || uri.equals("/browserconfig.xml")

        // iOS / Android 아이콘
        || uri.startsWith("/apple-touch-icon")
        || uri.startsWith("/android-chrome")

        // Chrome / 브라우저 내부
        || uri.startsWith("/.well-known");
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String uri = request.getRequestURI();

    return uri.equals("/error");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String uri = request.getRequestURI(); //url을 스트링형태로 뽑기

    // 브라우저 자동 노이즈 요청은 여기서 즉시 종료
    if (isNoiseRequest(uri)) {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND); //SC_NOT_FOUND = 404
      return;
    }

    // 요청 1건을 식별하기 위한 Trace ID 생성
    String requestId = UUID.randomUUID().toString();

    // 로그 MDC에 저장 (같은 요청 로그 묶기)
    MDC.put("requestId", requestId);

    // 클라이언트에서도 확인 가능하도록 응답 헤더에 포함
    response.setHeader("X-Request-Id", requestId);

    long startTime = System.currentTimeMillis();

    try {
      // 실제 요청 처리 //doFilter 하면 디스패처 서블릿으로 감
      filterChain.doFilter(request, response); //서블릿 -> 필터(리턴x, 다음단계로 보냄) -> 디스패처 서블릿 -> 컨트롤러
    } finally {
      long duration = System.currentTimeMillis() - startTime;

      log.info("{} {} -> {} ({} ms)", //로그형식은 logback.xml에서 지정
          request.getMethod(),
          request.getRequestURI(),
          response.getStatus(),
          duration);

      // ThreadLocal 정리
      MDC.clear(); 
    }
  }
}