# Execution Plan (v2)

우선순위:
1) 에러/로딩 UX 통일
2) 게시글 수정/삭제 UX 개선
3) 내 활동 페이지

## 1) 에러/로딩 UX 통일
- 공통 컴포넌트 추가: `LoadingState`, `ErrorState`, `Toast`
- 주요 페이지(Home/Posts/PostDetail/MyBookmarks)에 적용

## 2) 게시글 수정/삭제 UX 개선
- PostDetail에서 작성자 기준 수정모드 지원
- PUT `/api/posts/{id}` 연동
- DELETE `/api/posts/{id}` + 확인 모달

## 3) 내 활동 페이지
- 탭: 내가 쓴 글 / 내가 단 댓글 / 내 북마크
- 백엔드 추가: `GET /api/comments/me?limit=`
- 프론트 라우트: `/my-activity`
