# Koreanit Community Backend API (Spring Boot)

안녕하세요. 이 프로젝트는 커뮤니티 서비스를 가정하고 만든 백엔드 API입니다.  
단순 CRUD를 넘어서 **인증/인가, 세션, 예외 처리, 운영 API, 문서화(Swagger)**까지 실서비스 기준으로 구현했습니다.

---

## 한눈에 보기

- 회원가입/로그인/로그아웃/내 정보
- 게시글/댓글/대댓글
- 좋아요/북마크/집계
- 댓글 알림(미읽음, 읽음 처리)
- 광고 슬롯/클릭 집계
- 관리자 API(요약, 최근 액션, 헬스)

---

## 기술 스택

- **Java 17**
- **Spring Boot 3.5.10**
  - Spring Web
  - Spring Security
  - Spring JDBC
  - Spring Validation
- **MySQL** (도메인 데이터)
- **Redis + Spring Session** (세션 저장)
- **Gradle**
- **springdoc-openapi** (Swagger/OpenAPI)

---

## 아키텍처 요약

- 계층 구조: `Controller → Service → Repository(JDBC)`
- 공통 응답 포맷: `ApiResponse(success, message, data, code)`
- 전역 예외 처리: `GlobalExceptionHandler`
- 보안 정책 분리:
  - 공개 API (예: 게시글 조회)
  - 인증 필요 API (예: 댓글 작성/좋아요/북마크/알림)
  - 관리자 전용 API (예: `/api/admin/**`, `/api/ops/health`)

---

## 최근 정리/개선한 내용 (포트폴리오 반영)

### 1) 보안/인증 흐름 정리
- `SecurityFilterChain` + `SessionAuthenticationFilter` 동작 기준 정리
- 세션(`JSESSIONID`) 기반 인증 흐름 명확화
- 인증 실패(401), 권한 없음(403) 응답 일관화

### 2) 예외/응답 일관성 개선
- 400/401/403/500 의미를 분리해 API 사용성이 좋아지도록 정리
- 프론트에서 처리하기 쉬운 표준 JSON 응답 유지

### 3) 환경 설정 안정화
- `application.yaml`, `application-dev.yml`, `application-prod.yml` 정리
- env 기반 설정 + fallback으로 dev/prod 파손 가능성 축소

### 4) API 문서화 고도화
- Swagger/OpenAPI 추가
- 도메인별 Tag, 엔드포인트 요약(Operation) 적용
- 공통 에러 응답(400/401/403/500) 문서 기본 반영

---

## Swagger / OpenAPI

- Swagger UI: `http://localhost:8080/swagger-ui.html`  
  (자동으로 `/swagger-ui/index.html` 이동)
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

면접에서는 Swagger에서 도메인별(Auth, Users, Posts, Comments, Engagement, Notifications, Ads, Admin, Ops)로 빠르게 설명 가능합니다.

---

## 주요 API 도메인

- **Auth**: `/api/login`, `/api/logout`, `/api/me`
- **Users**: `/api/users/**`
- **Posts**: `/api/posts/**`
- **Comments**: `/api/posts/{postId}/comments`, `/api/comments/{id}`
- **Engagement**: 좋아요/북마크/집계
- **Notifications**: 댓글 알림/미읽음/읽음 처리
- **Ads**: 광고 조회/관리/클릭 집계
- **Admin/Ops**: 관리자 요약/최근 액션/헬스체크

---

## 아키텍처 다이어그램 자료

> 발표/포트폴리오용 이미지 파일

- 상세 기술 아키텍처 (SVG):
  - `/home/ungnam/.openclaw/workspace/koreanit-architecture-detailed.svg`
- 상세 기술 아키텍처 (PNG):
  - `/home/ungnam/.openclaw/workspace/koreanit-architecture-detailed.png`
- 보안 필터체인/세션 인증 흐름 (SVG):
  - `/home/ungnam/.openclaw/workspace/security-session-flow.svg`
- 보안 필터체인/세션 인증 흐름 (PNG):
  - `/home/ungnam/.openclaw/workspace/security-session-flow.png`

---

## 로컬 실행

```bash
cd ~/projects/koreanit-server/spring
./gradlew bootRun
```

테스트/빌드:

```bash
./gradlew test
./gradlew build
```

환경변수(예):
- `SERVER_PORT` (기본 8080)
- `DB_URL` (dev 기본: `jdbc:mysql://localhost:3310/koreanit_service?...`)
- `DB_USER`, `DB_PASSWORD`
- `REDIS_HOST` (기본 127.0.0.1)
- `REDIS_PORT` (기본 6379)

---

## 면접에서 강조할 포인트

1. **실서비스 관점의 API 설계**
   - CRUD + 인증/인가 + 운영 기능까지 포함
2. **보안/예외 처리 일관성**
   - 상태코드와 응답 계약을 명확히 유지
3. **확장 가능한 세션 구조**
   - Redis Session 기반 인증 상태 관리
4. **문서화 역량**
   - Swagger/OpenAPI + 아키텍처 다이어그램으로 빠른 커뮤니케이션

---

## 앞으로의 개선 계획

- API 통합 테스트/계약 테스트 강화
- 쿼리 튜닝 및 인덱스 최적화
- 관측성(로그/메트릭/트레이싱) 강화
- 배포 템플릿(.env.example, nginx/systemd) 정리
