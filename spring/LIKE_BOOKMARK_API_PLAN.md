# Like/Bookmark 백엔드 API 전환 설계안

## 1) 목표
현재 프론트(localStorage) 기반 좋아요/북마크를 서버 영속 저장 방식으로 전환한다.

---

## 2) DB 설계

### 2-1. post_likes
```sql
CREATE TABLE post_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_post_like UNIQUE (post_id, user_id),
  INDEX idx_post_likes_post_id (post_id),
  INDEX idx_post_likes_user_id (user_id)
);
```

### 2-2. post_bookmarks
```sql
CREATE TABLE post_bookmarks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_post_bookmark UNIQUE (post_id, user_id),
  INDEX idx_post_bookmarks_post_id (post_id),
  INDEX idx_post_bookmarks_user_id (user_id)
);
```

> FK는 기존 `posts`, `users` 테이블 구조에 맞게 추가 권장.

---

## 3) API 엔드포인트 설계

기본 prefix: `/api/posts/{postId}`

### 3-1. 좋아요
- `POST /api/posts/{postId}/like` : 좋아요 추가(멱등)
- `DELETE /api/posts/{postId}/like` : 좋아요 취소(멱등)

### 3-2. 북마크
- `POST /api/posts/{postId}/bookmark` : 북마크 추가(멱등)
- `DELETE /api/posts/{postId}/bookmark` : 북마크 취소(멱등)

### 3-3. 상태/카운트 조회
- `GET /api/posts/{postId}/engagement`

응답 예시(`ApiResponse` 내부 data):
```json
{
  "postId": 12,
  "liked": true,
  "bookmarked": false,
  "likeCount": 18,
  "bookmarkCount": 3
}
```

---

## 4) 스프링 코드 구조(권장)

## 패키지
- `com.koreanit.spring.engagement`
  - `PostEngagementController`
  - `PostEngagementService`
  - `PostLikeRepository`, `PostBookmarkRepository`
  - `JdbcPostLikeRepository`, `JdbcPostBookmarkRepository`
  - DTO: `PostEngagementResponse`

### Controller 스케치
```java
@RestController
@RequestMapping("/api/posts")
public class PostEngagementController {

  @PostMapping("/{postId}/like")
  public ApiResponse<Void> like(@PathVariable long postId) { ... }

  @DeleteMapping("/{postId}/like")
  public ApiResponse<Void> unlike(@PathVariable long postId) { ... }

  @PostMapping("/{postId}/bookmark")
  public ApiResponse<Void> bookmark(@PathVariable long postId) { ... }

  @DeleteMapping("/{postId}/bookmark")
  public ApiResponse<Void> unbookmark(@PathVariable long postId) { ... }

  @GetMapping("/{postId}/engagement")
  public ApiResponse<PostEngagementResponse> engagement(@PathVariable long postId) { ... }
}
```

### Service 핵심 규칙
- `SecurityUtils.currentUserId()` 사용
- 중복 insert는 무시(멱등 처리)
- delete는 영향 행 0이어도 성공 처리(멱등)

### Repository SQL 예시
- like 추가
```sql
INSERT INTO post_likes(post_id, user_id)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE post_id = post_id;
```
- like 취소
```sql
DELETE FROM post_likes WHERE post_id = ? AND user_id = ?;
```
- like 카운트
```sql
SELECT COUNT(*) FROM post_likes WHERE post_id = ?;
```
- liked 여부
```sql
SELECT EXISTS(
  SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?
) AS liked;
```

(bookmark도 동일 패턴)

---

## 5) SecurityConfig 변경 포인트
현재 `/api/**`는 대부분 인증 필요로 이미 설정되어 있음.
좋아요/북마크는 인증 필요가 맞으므로 별도 permitAll 불필요.

단, 아래 조회는 공개 허용 권장:
- `GET /api/posts/{id}/engagement`

예시 추가:
```java
.requestMatchers(HttpMethod.GET, "/api/posts/*/engagement").permitAll()
```

---

## 6) 프론트 교체 포인트 (React)
대상 프로젝트: `/home/ungnam/projects/koreanit-server/project`

### 6-1. `src/api.js` 추가/변경
```js
getEngagement: (postId) => request(`/posts/${postId}/engagement`),
likePost: (postId) => request(`/posts/${postId}/like`, { method: 'POST' }),
unlikePost: (postId) => request(`/posts/${postId}/like`, { method: 'DELETE' }),
bookmarkPost: (postId) => request(`/posts/${postId}/bookmark`, { method: 'POST' }),
unbookmarkPost: (postId) => request(`/posts/${postId}/bookmark`, { method: 'DELETE' }),
```

### 6-2. `src/pages/PostDetailPage.jsx` 변경
- 제거: localStorage 기반 `liked/bookmarked`
- 추가: 서버 상태 로드 함수
  - 게시글/댓글 로드 후 `getEngagement(id)` 호출
- 토글 버튼 동작
  - liked true면 `unlikePost`, false면 `likePost`
  - bookmarked true면 `unbookmarkPost`, false면 `bookmarkPost`
- 액션 성공 시 `getEngagement` 재호출하여 카운트/상태 동기화

UI 예시:
- `♥ 좋아요 (18)`
- `★ 북마크 (3)`

---

## 7) 단계별 적용 순서
1. DB 테이블 생성
2. 백엔드 엔드포인트 구현 + SecurityConfig 조회 공개 규칙 추가
3. Postman/.http로 API 검증
4. React `api.js`/`PostDetailPage` 교체
5. localStorage 코드 제거

---

## 8) 테스트 체크리스트
- 비로그인 상태
  - `GET /engagement` 성공
  - like/bookmark POST/DELETE는 401
- 로그인 상태
  - like/bookmark 토글 정상
  - 중복 POST/DELETE 멱등성 확인
  - 카운트 즉시 반영
