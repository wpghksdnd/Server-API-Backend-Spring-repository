import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

const PAGE_SIZE = 8

export default function MyBookmarksPage() {
  const [posts, setPosts] = useState([])
  const [msg, setMsg] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [authed, setAuthed] = useState(true)

  const modalRef = useRef(null)
  const cancelBtnRef = useRef(null)
  const confirmBtnRef = useRef(null)

  useEffect(() => {
    api.myBookmarks(200).then((r) => {
      if (r.ok) {
        setAuthed(true)
        setPosts(r?.data?.data || [])
      } else if (r.status === 401) {
        setAuthed(false)
        setPosts([])
        setMsg('')
      } else {
        setAuthed(true)
        setMsg(`조회 실패 (${r.status})`)
      }
    })
  }, [])

  const processed = useMemo(() => {
    let arr = [...posts]

    if (keyword.trim()) {
      const q = keyword.toLowerCase()
      arr = arr.filter((p) => `${p.title ?? ''} ${p.content ?? ''}`.toLowerCase().includes(q))
    }

    if (sort === 'title') {
      arr.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    } else if (sort === 'oldest') {
      arr.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    } else {
      arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    }

    return arr
  }, [posts, keyword, sort])

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE))
  const current = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    if (!confirmTarget) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    cancelBtnRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setConfirmTarget(null)
        return
      }

      if (e.key === 'Tab') {
        const focusables = [cancelBtnRef.current, confirmBtnRef.current].filter(Boolean)
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement

        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [confirmTarget])

  const removeBookmark = async (postId) => {
    const r = await api.unbookmarkPost(postId)
    if (r.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
      setMsg('북마크에서 제거했습니다.')
    } else {
      setMsg(`북마크 해제 실패 (${r.status})`)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '-'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '-'
    return d.toLocaleString('ko-KR')
  }

  if (!authed) {
    return (
      <div className="grid">
        <Seo title="내 북마크 | Koreanit" description="내가 저장한 게시글 목록" />
        <section className="card" style={{ textAlign: 'center' }}>
          <h1>내 북마크</h1>
          <p className="muted">로그인 후 북마크를 확인할 수 있습니다.</p>
          <Link to="/login" className="button">로그인</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="grid">
      <Seo title="내 북마크 | Koreanit" description="내가 저장한 게시글 목록" />

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <h1 style={{ margin: 0 }}>내 북마크</h1>
        <p className="muted">{msg || `총 ${processed.length}개 · ${page}/${totalPages} 페이지`}</p>

        <input
          className="input"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            setPage(1)
          }}
          placeholder="제목/내용 검색"
        />

        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">최신순(ID 내림차순)</option>
          <option value="oldest">오래된순(ID 오름차순)</option>
          <option value="title">제목순</option>
        </select>
      </section>

      <section style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {current.map((p) => (
          <article
            className="card"
            key={p.id}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 240 }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'start' }}>
                <h3 style={{ margin: 0 }}>{p.title || '제목 없음'}</h3>
                <span className="muted" style={{ whiteSpace: 'nowrap' }}>#{p.id}</span>
              </div>
              <p className="muted" style={{ marginTop: 6 }}>작성일: {formatDate(p.createdAt)}</p>
              <p className="line-clamp-3" style={{ marginTop: 10 }}>{p.content || '내용 없음'}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <Link to={`/post/${p.id}`} className="button" style={{ textAlign: 'center', flex: 1 }}>
                상세 보기
              </Link>
              <button
                className="button danger"
                style={{ flex: 1 }}
                onClick={() => setConfirmTarget(p)}
              >
                북마크 해제
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="card" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        <button className="button btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><span className="btn-icon">◀</span>이전</button>
        <span>{page} / {totalPages}</span>
        <button className="button btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>다음<span className="btn-icon">▶</span></button>
      </section>

      {confirmTarget && (
        <div className="modal-backdrop" onClick={() => setConfirmTarget(null)}>
          <div
            className="modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="bookmark-modal-title" style={{ marginTop: 0 }}>북마크 해제 확인</h3>
            <p className="muted">
              "{confirmTarget.title || '제목 없음'}" 을(를) 북마크에서 해제할까요?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
              <button ref={cancelBtnRef} className="button" onClick={() => setConfirmTarget(null)}>취소</button>
              <button
                ref={confirmBtnRef}
                className="button danger"
                onClick={async () => {
                  await removeBookmark(confirmTarget.id)
                  setConfirmTarget(null)
                }}
              >
                해제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
