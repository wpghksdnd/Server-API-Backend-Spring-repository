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
