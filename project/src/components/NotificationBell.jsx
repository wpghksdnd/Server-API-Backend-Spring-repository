import { useEffect, useState } from 'react'
import { api } from '../api'

export default function NotificationBell() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const load = async () => {
    const me = await api.me()
    if (!me.ok) {
      setEnabled(false)
      setItems([])
      setUnreadCount(0)
      return
    }

    setEnabled(true)

    const [listR, unreadR] = await Promise.all([
      api.notificationComments(20),
      api.notificationUnreadCount(),
    ])

    if (listR.ok) setItems(listR?.data?.data || [])
    if (unreadR.ok) setUnreadCount(unreadR?.data?.data?.unreadCount || 0)
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [])

  const markSeen = async () => {
    const maxId = items.length > 0 ? Math.max(...items.map((x) => x.commentId)) : null
    await api.notificationMarkRead(maxId)
    await load()
  }

  const markAllRead = async () => {
    await markSeen()
  }

  const relativeTime = (iso) => {
    if (!iso) return ''
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return ''
    const diffSec = Math.floor((Date.now() - t) / 1000)
    if (diffSec < 60) return '방금 전'
    const m = Math.floor(diffSec / 60)
    if (m < 60) return `${m}분 전`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}시간 전`
    const d = Math.floor(h / 24)
    return `${d}일 전`
  }

  if (!enabled) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`button btn-sm outline ${unreadCount > 0 ? 'pulse' : ''}`}
        onClick={async () => {
          const next = !open
          setOpen(next)
          if (next) await markSeen()
        }}
      >
        <span className="btn-icon">🔔</span>
        알림
        {unreadCount > 0 && <span className="noti-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="noti-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <p className="muted" style={{ margin: 0 }}>최근 댓글/대댓글 알림</p>
            <button className="button btn-sm secondary" onClick={markAllRead}>모두 읽음</button>
          </div>
          {items.length === 0 && <p className="muted">새 알림이 없습니다.</p>}
          {items.map((n) => (
            <a
              key={n.commentId}
              href={`/post/${n.postId}`}
              className={`noti-item ${n.read ? 'is-read' : 'is-unread'}`}
              onClick={() => setOpen(false)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong>{n.type === 'REPLY' ? '대댓글' : '댓글'}</strong>
                <span className="muted" style={{ fontSize: 12 }}>{relativeTime(n.createdAt)}</span>
              </div>
              <span>{n.content}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
