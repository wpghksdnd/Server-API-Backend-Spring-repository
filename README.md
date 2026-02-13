# Koreanit Community Backend API (Spring Boot)

> 포트폴리오용 백엔드 API 서버입니다.  
> 커뮤니티 서비스의 핵심 기능(회원/인증/게시글/댓글/좋아요·북마크/알림/광고/관리자)을 **세션 기반 인증 + 역할 기반 인가**로 구현했습니다.

---

## 1) 프로젝트 개요

이 프로젝트는 단순 CRUD를 넘어서, 실제 서비스에서 자주 필요한 기능을 API 중심으로 구성했습니다.

- 세션 로그인/로그아웃
- 게시글 + 댓글 + 대댓글
- 좋아요/북마크 + 집계
- 댓글 알림/미읽음 카운트
- 관리자 전용 API(요약, 최근 액션, 운영 헬스)
- 광고 슬롯/클릭 집계 API

핵심 목표는 **실서비스에 가까운 구조**(명확한 응답 포맷, 보안 규칙, 운영 가능한 설정)입니다.

---

## 2) 기술 스택

### Backend
- **Java 17**
- **Spring Boot 3.5.10**
- **Spring Web**
- **Spring Security**
- **Spring JDBC**
- **Spring Validation**

### Data / Session
- **MySQL** (RDB)
- **Redis** (Spring Session 저장소)

### Build / DevOps
- **Gradle**
- 환경별 설정 분리 (`application.yaml`, `application-dev.yml`, `application-prod.yml`)

---

## 3) 아키텍처/설계 포인트

- 계층 분리: `Controller → Service → Repository(JDBC)`
- 공통 응답 포맷: `ApiResponse(success, message, data, code)`
- 전역 예외 처리: `GlobalExceptionHandler`에서 4xx/5xx 일관 응답
- 인증/인가 정책 분리:
  - 공개 API (예: 게시글 조회)
  - 인증 필요 API (예: 댓글 작성, 북마크)
  - 관리자 전용 API (예: `/api/admin/**`, `/api/ops/health`)

---

## 4) 주요 API 도메인

- **Auth**: `/api/login`, `/api/logout`, `/api/me`
- **Users**: `/api/users/**`
- **Posts**: `/api/posts/**`
- **Comments**: `/api/posts/{postId}/comments`, `/api/comments/{id}`
- **Engagement**: 좋아요/북마크/집계 (`/api/posts/{id}/like`, `/bookmark`, `/engagement`)
- **Notifications**: 댓글 알림, 미읽음 카운트, 읽음 처리
- **Ads**: 광고 슬롯 조회/관리, 클릭 집계
- **Admin/Ops**: 관리자 요약/최근 액션, 운영 헬스

---

## 5) 보안/인증 전략

- 세션 기반 인증 (`JSESSIONID`, Redis-backed Session)
- URL + HTTP Method 기반 인가 정책
- 인증 실패(401), 권한 없음(403), 요청 오류(400), 서버 오류(500) 구분
- 잘못된 로그인은 401로 통일해 보안/UX 일관성 유지

---

## 6) 실행 방법 (Local)

```bash
cd ~/projects/koreanit-server/spring
./gradlew bootRun
```

기본 dev 환경에서 필요한 값(예시):
- `SERVER_PORT` (기본 8080)
- `DB_URL` (기본 `jdbc:mysql://localhost:3310/koreanit_service?...`)
- `DB_USER` (기본 `koreanit_app`)
- `DB_PASSWORD` (기본 `password`)
- `REDIS_HOST` (기본 `127.0.0.1`)
- `REDIS_PORT` (기본 `6379`)

테스트/빌드:
```bash
./gradlew test
./gradlew build
```

---

## 7) 역량

1. **실무형 API 설계**
   - 단순 CRUD가 아닌 권한, 상태, 운영 관점까지 포함

2. **보안/예외 처리 감각**
   - 인증/인가 실패 구분, 표준화된 에러 응답, 글로벌 예외 처리

3. **상태 관리와 확장성**
   - 세션을 Redis로 분리해 단일 서버를 넘어 확장 가능한 구조 고려

4. **서비스 기능 완성도**
   - 게시글/댓글 뿐 아니라 좋아요·북마크·알림·광고·관리자 기능까지 통합

---

## 8) 향후 개선 계획

- API 계약 테스트/통합 테스트 확대
- Query 최적화 및 인덱스 점검
- 관측성(로그/메트릭/트레이싱) 강화
- 배포 템플릿(.env.example, nginx/systemd) 고도화

---

## 9) Repository 정보

- Backend Root: `~/projects/koreanit-server/spring`
- Main Application: `com.koreanit.spring.Application`


# Koreanit Server v1

프론트엔드(`project/`) + 백엔드(`spring/`) 통합 실행 가이드입니다.

## 필수 환경 변수

### 공통/백엔드
- `SPRING_PROFILES_ACTIVE` : `dev` 또는 `prod` (기본 `dev`)
- `SERVER_PORT` : dev 포트 (기본 `8080`)
- `PORT` : prod 포트 (기본 `8080`)
- `DB_URL` : 예) `jdbc:mysql://localhost:3310/koreanit_service?...`
- `DB_USER`
- `DB_PASSWORD`
- `REDIS_HOST` (기본 `127.0.0.1`)
- `REDIS_PORT` (기본 `6379`)

### 프론트엔드
- Vite dev 서버: 기본 `5173`
- API 호출: `/api` 프록시/리버스프록시 기준

---

## 로컬 개발 Runbook

### 1) 백엔드 실행
```bash
cd spring
./gradlew bootRun
```

### 2) 프론트엔드 실행
```bash
cd project
npm install
npm run dev
```

### 3) 동작 점검 체크리스트
1. `/login` 로그인 성공/실패 메시지 확인
2. 로그인 후 `/me`, `/write` 접근 가능
3. 로그아웃/세션 만료 후 보호 라우트 접근 시 로그인 이동
4. `/posts`, `/post/:id`에서 로딩/에러/빈 상태 UI 확인
5. 관리자 계정으로 `/admin`, `/ops-health`, `/ads-admin` 접근 확인

---

## 프로덕션 유사 점검

1. `SPRING_PROFILES_ACTIVE=prod` 로 백엔드 실행
2. DB/Redis 연결 실패 시 로그 확인 (`spring/src/main/resources/logback-spring.xml`)
3. `npm run build` 결과물(`project/dist`) 정적 서빙 또는 Nginx 배포
4. `/api/ops/health` 로 헬스체크(관리자 권한 필요)
5. 4xx/5xx 응답이 API 표준 포맷인지 확인
   - 형식: `{ "success": false, "errorCode": "...", "message": "..." }`

---

## 배포 전 최소 검증 명령

```bash
cd project && npm run build
cd ../spring && ./gradlew test
```

(환경에 따라 DB/Redis 미구성 시 일부 통합성 검증은 제한될 수 있음)
