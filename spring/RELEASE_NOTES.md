# RELEASE NOTES 
## v1.0.0 — 커뮤니티 백엔드 MVP 완성

### 무엇을 만들었나
- 회원가입/로그인/로그아웃/내 정보 조회
- 게시글 CRUD
- 댓글/대댓글
- 좋아요/북마크/집계
- 댓글 알림(미읽음/읽음 처리)
- 관리자 API(요약/최근 액션/헬스)
- 광고 슬롯 조회/관리/클릭 집계

### 사용 기술 스택
- Java 17
- Spring Boot 3.5.10 (Web, Security, JDBC, Validation)
- MySQL
- Redis + Spring Session
- Gradle

### 기술적으로 강조할 부분
- `Controller → Service → Repository(JDBC)` 계층 분리
- 세션 기반 인증(`JSESSIONID`) + 역할 기반 인가(`ROLE_ADMIN`)
- 공통 응답 포맷(`ApiResponse`)으로 프론트 협업성 강화
- 실서비스 기능(알림/광고/운영 API)까지 포함한 API 설계

### 성과
- CRUD 수준을 넘어 실제 서비스 구조를 경험했고,
  인증/인가/운영 관점에서 API를 설계·구현하는 기반을 확보함.

### 이미지 자리
- #{v1.0.0 Swagger 전체 API 목록 화면}
- #{v1.0.0 게시글/댓글/좋아요 연동 시퀀스 다이어그램}

---

## v1.1.0.0 — 품질/문서화/운영 가독성 강화

### 무엇이 개선되었나
- Swagger/OpenAPI 문서 도입 및 고도화
  - 도메인별 Tag 분리
  - 엔드포인트 요약(Operation) 추가
  - 공통 에러 응답(400/401/403/500) 문서화
- 보안 필터체인/세션 인증 흐름 정리
  - SecurityFilterChain + SessionAuthenticationFilter 흐름 명확화
- 예외 응답 의미 정리
  - 상태코드 의미(400/401/403/500) 일관성 강화
- 환경설정 정리
  - dev/prod 프로필, env fallback 정리

### 사용 기술 스택(추가/강조)
- springdoc-openapi-starter-webmvc-ui
- Swagger UI / OpenAPI JSON
- SVG/PNG 아키텍처 다이어그램 제작 (포트폴리오 자료화)

### 기술적으로 강조할 부분
- “동작하는 API”에서 “설명 가능한 API”로 개선
- 문서화 + 에러 계약 + 보안 흐름 시각화로 협업/면접 전달력 향상
- 운영 관점에서 설정 파손 가능성을 낮춘 구성(dev/prod 분리 + fallback)

### 성과
- 면접/리뷰 상황에서 프로젝트를 구조적으로 설명할 수 있게 되었고,
  API 신뢰도와 포트폴리오 완성도가 크게 올라감.

### 이미지 자리
- #{v1.1.0.0 Swagger UI 태그별 화면}
- #{v1.1.0.0 보안 필터체인/세션 인증 흐름 PNG}
- #{v1.1.0.0 상세 기술 아키텍처 PNG}

---

## 빠른 링크
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- 상세 기술 아키텍처 PNG: `/home/ungnam/.openclaw/workspace/koreanit-architecture-detailed.png`
- 보안/세션 흐름 PNG: `/home/ungnam/.openclaw/workspace/security-session-flow.png`
