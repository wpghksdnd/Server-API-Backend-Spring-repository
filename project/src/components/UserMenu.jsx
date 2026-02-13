import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function UserMenu({ user, isAdmin }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const initial = (user?.nickname || user?.username || 'U').charAt(0).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="avatar-btn" onClick={() => setOpen((v) => !v)} aria-label="사용자 메뉴">
        {initial}
      </button>
      {open && (
        <div className="user-menu">
          <Link to="/me" onClick={() => setOpen(false)}>내 정보</Link>
          <Link to="/my-bookmarks" onClick={() => setOpen(false)}>내 북마크</Link>
          <Link to="/my-posts" onClick={() => setOpen(false)}>내 게시물</Link>
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>관리자 페이지</Link>}
        </div>
      )}
    </div>
  )
}
