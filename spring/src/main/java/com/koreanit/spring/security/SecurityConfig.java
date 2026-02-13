package com.koreanit.spring.security;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.common.response.ApiResponse;
import com.koreanit.spring.user.UserRepository;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

  private final ObjectMapper objectMapper;

  public SecurityConfig(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  private void writeJson(HttpServletResponse res, int status, ApiResponse<Void> body) {
    res.setStatus(status);
    res.setContentType("application/json; charset=UTF-8");

    try {
      objectMapper.writeValue(res.getWriter(), body);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Bean
  public SessionAuthenticationFilter sessionAuthenticationFilter(UserRepository userRepository,
      UserRoleRepository userRoleRepository) {
    return new SessionAuthenticationFilter(userRepository, userRoleRepository);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http,
      SessionAuthenticationFilter sessionFilter) throws Exception {

    http
        // 기본 로그인 폼 비활성화
        .formLogin(f -> f.disable())

        // HTTP Basic 인증 비활성화
        .httpBasic(b -> b.disable())

        // CSRF 보호 비활성화 (JSON API 기준)
        .csrf(csrf -> csrf.disable())

        //CORS적용
        .cors(cors -> {})

        // 인증/인가 실패 시 JSON 응답 처리
        .exceptionHandling(e -> e

            // 미인증 접근 시 401 응답
            .authenticationEntryPoint((req, res, ex) -> {
              writeJson(
                  res,
                  ErrorCode.UNAUTHORIZED.getStatus().value(),
                  ApiResponse.fail(ErrorCode.UNAUTHORIZED.name(), "로그인이 필요합니다"));
            })

            // 권한 없는 접근 시 403 응답
            .accessDeniedHandler((req, res, ex) -> {
              writeJson(
                  res,
                  ErrorCode.FORBIDDEN.getStatus().value(),
                  ApiResponse.fail(ErrorCode.FORBIDDEN.name(), "권한이 없습니다"));
            }))

        // 요청 경로별 접근 권한 설정 //위에서 아래로 순차적으로
        .authorizeHttpRequests(auth -> auth
            // CORS preflight 요청 허용 //옵션요청 허용, 모든도메인에서 접근 허용, 헤더값만 내려주는 역할
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // 회원 가입 허용 //인증단계없이
            .requestMatchers(HttpMethod.POST, "/api/users").permitAll()

            // 로그인 요청 허용 //인증단계없이
            .requestMatchers(HttpMethod.POST, "/api/login").permitAll()

            // 로그아웃 요청 허용 //인증단계없이 .permitAll()
            .requestMatchers(HttpMethod.POST, "/api/logout").permitAll()

            // 게시글목록/단건조회 허용
            .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/posts/{id}").permitAll()

            // 댓글목록조회 허용 (비로그인 허용)
            .requestMatchers(HttpMethod.GET, "/api/posts/*/comments").permitAll()

            // 게시글 engagement 조회 허용 (비로그인 허용)
            .requestMatchers(HttpMethod.GET, "/api/posts/*/engagement").permitAll()

            // 게시글 좋아요 누른 사용자 목록 조회 허용 (비로그인 허용)
            .requestMatchers(HttpMethod.GET, "/api/posts/*/likes/users").permitAll()

            // 관리자 확인 API
            .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")

            // 운영 헬스 조회 (관리자 전용)
            .requestMatchers(HttpMethod.GET, "/api/ops/health").hasRole("ADMIN")

            // 광고 배너 조회 허용
            .requestMatchers(HttpMethod.GET, "/api/ads/**").permitAll()

            // 광고 클릭 집계 허용
            .requestMatchers(HttpMethod.POST, "/api/ads/*/click").permitAll()

            // 광고 관리자 목록/관리 API (관리자 전용)
            .requestMatchers(HttpMethod.GET, "/api/ads").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/ads").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/ads/*").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/ads/*").hasRole("ADMIN")

            // 댓글 생성 (로그인 필요)
            .requestMatchers(HttpMethod.POST, "/api/posts/*/comments").authenticated()

            // 좋아요/북마크 토글 (로그인 필요)
            .requestMatchers(HttpMethod.POST, "/api/posts/*/like").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/posts/*/like").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/posts/*/bookmark").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/posts/*/bookmark").authenticated()
            
            // 댓글 삭제 (로그인 필요)
            .requestMatchers(HttpMethod.DELETE, "/api/comments/*").authenticated()

            // 알림 조회 (로그인 필요)
            .requestMatchers(HttpMethod.GET, "/api/notifications/**").authenticated()

            // API 경로는 인증 필요 //api하위경로로는 인증필요
            .requestMatchers("/api/**").authenticated()

            // 관리자 전용 경로 설정 예시(보통은 메서드단위에서하는데 이건 URL단위 예시)
            // .requestMatchers(HttpMethod.POST, "/admin").hasRole("ADMIN")
            // 그 외 요청은 모두 허용 // api테스트할때 500에러는 인증문제가 아니라 CORS문제일 가능성이 높음, 인증문제는 401이나 403에러
            .anyRequest().permitAll())

        // 로그아웃 처리 설정
        .logout(lo -> lo
            // 로그아웃 URL 지정
            .logoutUrl("/api/logout")

            // 세션 무효화
            .invalidateHttpSession(true)

            // 세션 쿠키 삭제
            .deleteCookies("JSESSIONID")

            // 로그아웃 성공 시 JSON 응답
            .logoutSuccessHandler((req, res, auth) -> {
              writeJson(res, 200, ApiResponse.ok(null));
            }))

        // 세션 기반 인증 필터 등록
        .addFilterBefore(sessionFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();

  }
}

// 기본 차단 정책 제거
// 모든 API 기존과 동일하게 동작
// SecurityFilterChain이 OPEN 상태로 동작
// 동작순서
// 서블릿필터(로깅하는 필터) -> 필터체인에서 등록한 세션 인증필터
// -> 스프링 시큐리티 인증필터들 -> 디스패처서블릿 -> 컨트롤러
// -> 컨트롤러에서 응답 반환 -> 디스패처서블릿 -> 스프링 시큐리티 인증필터들
// -> 필터체인에서 등록한 세션 인증필터 -> 서블릿필터(로깅하는 필터)
// 글로벌 익셉션핸들러에서는 컨트롤러 윗부분만 에러잡음 여기서는 필터단계에서 에러처리