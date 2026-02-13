# Koreanit Community Backend API (Spring Boot)

커뮤니티 서비스를 가정하고 만든 백엔드 API 프로젝트입니다.  
단순 CRUD를 넘어서 인증/인가, 세션, 예외 처리, 운영 API, Swagger 문서화까지 실서비스 기준으로 구성했습니다.

---

## 1. 프로젝트 개요

- 프로젝트 목적: 커뮤니티 백엔드의 핵심 기능을 실무형 구조로 구현
- 핵심 포인트:
  - 세션 기반 인증(`JSESSIONID`) + 역할 기반 인가(`ROLE_ADMIN`)
  - 공통 응답 포맷(`ApiResponse`)과 전역 예외 처리
  - 운영/관리자 기능 포함(헬스, 요약, 최근 액션, 광고 관리)
- 릴리즈 요약:
  - `v1.0.0`: MVP 기능 완성
  - `v1.1.0.0`: Swagger/OpenAPI 및 보안 흐름 시각화/문서화 강화

---

## 2. 기술 스택

### Backend
- Java 17
- Spring Boot 3.5.10
  - Spring Web
  - Spring Security
  - Spring JDBC
  - Spring Validation

### Data / Session
- MySQL
- Redis + Spring Session

### Documentation / Build
- springdoc-openapi-starter-webmvc-ui (Swagger/OpenAPI)
- Gradle

---

## 3. 프로젝트 구조

```text
spring/
├─ src/main/java/com/koreanit/spring
│  ├─ security/        # 인증/인가, 필터체인, 관리자 API
│  ├─ user/            # 회원 도메인
│  ├─ post/            # 게시글 도메인
│  ├─ comment/         # 댓글/대댓글 도메인
│  ├─ engagement/      # 좋아요/북마크/집계
│  ├─ notification/    # 댓글 알림
│  ├─ common/
│  │  ├─ config/       # OpenAPI 설정 등
│  │  ├─ error/        # 전역 예외 처리
│  │  ├─ response/     # ApiResponse 공통 포맷
│  │  ├─ logging/      # 접근/감사 로그
│  │  ├─ ads/          # 광고 기능
│  │  └─ ops/          # 운영 헬스
│  └─ Application.java
├─ src/main/resources
│  ├─ application.yaml
│  ├─ application-dev.yml
│  └─ application-prod.yml
├─ build.gradle
├─ README.md
└─ RELEASE_NOTES.md
```

아키텍처는 `Controller → Service → Repository(JDBC)` 계층으로 분리했습니다.

---

## 4. 주요 기능

### 인증/회원
- 회원가입, 로그인, 로그아웃, 내 정보 조회
- 세션 기반 인증, 권한 기반 인가

### 게시글/댓글
- 게시글 CRUD
- 댓글/대댓글 작성 및 목록 조회, 내 댓글 조회

### 참여 기능
- 좋아요/좋아요 취소
- 북마크/북마크 취소
- 게시글 참여 지표 조회

### 알림/광고/운영
- 댓글 알림 목록, 미읽음 카운트, 읽음 처리
- 광고 슬롯 조회/관리, 클릭 집계
- 관리자 요약/최근 액션, 운영 헬스체크

### 문서화
- Swagger UI 및 OpenAPI JSON 제공
  - Swagger UI: `http://localhost:8080/swagger-ui.html`
  - OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## 5. 실행 방법

### 5-1. 로컬 실행

```bash
cd ~/projects/koreanit-server/spring
./gradlew bootRun
```

### 5-2. 테스트/빌드

```bash
./gradlew test
./gradlew build
```

### 5-3. 주요 환경변수

- `SERVER_PORT` (기본 8080)
- `DB_URL` (dev 기본: `jdbc:mysql://localhost:3310/koreanit_service?...`)
- `DB_USER`, `DB_PASSWORD`
- `REDIS_HOST` (기본 `127.0.0.1`)
- `REDIS_PORT` (기본 `6379`)

---

## 참고 자료

- 릴리즈 요약: `RELEASE_NOTES.md`
- 상세 기술 아키텍처 PNG: `/home/ungnam/.openclaw/workspace/koreanit-architecture-detailed.png`
- 보안/세션 흐름 PNG: `/home/ungnam/.openclaw/workspace/security-session-flow.png`
