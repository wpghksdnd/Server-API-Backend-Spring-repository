import { NavLink } from 'react-router-dom'

export default function MobileMenu({ open, onClose, authed, isAdmin }) {
  if (!open) return null

  return (
    <div className="mobile-sheet" onClick={onClose}>
      <div className="mobile-panel" onClick={(e) => e.stopPropagation()}>
        <NavLink to="/" onClick={onClose}>홈</NavLink>
        <NavLink to="/posts" onClick={onClose}>게시글</NavLink>
        <NavLink to="/write" onClick={onClose}>글쓰기</NavLink>
        {!authed && <NavLink to="/login" onClick={onClose}>로그인</NavLink>}
        {!authed && <NavLink to="/signup" onClick={onClose}>회원가입</NavLink>}
        {authed && <NavLink to="/me" onClick={onClose}>내 정보</NavLink>}
        {authed && <NavLink to="/my-bookmarks" onClick={onClose}>내 북마크</NavLink>}
        {authed && <NavLink to="/my-posts" onClick={onClose}>내 게시물</NavLink>}
        {isAdmin && <NavLink to="/admin" onClick={onClose}>관리자 페이지</NavLink>}
        <NavLink to="/terms" onClick={onClose}>약관</NavLink>
        <NavLink to="/contact" onClick={onClose}>문의</NavLink>
      </div>
    </div>
  )
}
