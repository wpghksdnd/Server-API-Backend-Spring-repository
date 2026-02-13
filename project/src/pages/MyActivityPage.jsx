import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const PAGE_SIZE = 8

export default function MyActivityPage() {
  const [tab, setTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [me, setMe] = useState(null)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [authed, setAuthed] = useState(true)

  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    setError('')
    const [meR, postsR, commentsR, bookmarksR] = await Promise.all([
      api.me(),
      api.listPosts({ page: 1, limit: 200 }),
      api.myComments(100),
      api.myBookmarks(100),
    ])

    if (!meR.ok) {
      setAuthed(false)
      setLoading(false)
      return
    }

    setAuthed(true)
    const meData = meR?.data?.data
    setMe(meData)
    setPosts((postsR?.data?.data || []).filter((p) => p.userId === meData?.id))
    setComments(commentsR?.data?.data || [])
    setBookmarks(bookmarksR?.data?.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    setPage(1)
    setKeyword('')
    setSort('latest')
  }, [tab])

  const currentList = useMemo(() => {
    const source = tab === 'posts' ? posts : tab === 'comments' ? comments : bookmarks

    let arr = [...source]
    if (keyword.trim()) {
      const q = keyword.toLowerCase()
      arr = arr.filter((item) => {
        if (tab === 'posts') return `${item.title ?? ''} ${item.content ?? ''}`.toLowerCase().includes(q)
        if (tab === 'comments') return `${item.content ?? ''}`.toLowerCase().includes(q)
        return `${item.title ?? ''} ${item.content ?? ''}`.toLowerCase().includes(q)
      })
    }

    if (sort === 'title') arr.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    else if (sort === 'oldest') arr.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    else arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

    return arr
  }, [tab, posts, comments, bookmarks, keyword, sort])

  const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE))
  const paged = currentList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const emptyText =
    tab === 'posts'
      ? '아직 작성한 게시글이 없습니다. 첫 글을 작성해보세요!'
      : tab === 'comments'
        ? '아직 작성한 댓글이 없습니다. 게시글에 의견을 남겨보세요!'
        : '아직 북마크한 게시글이 없습니다. 마음에 드는 글을 저장해보세요!'

  if (!authed && !loading) {
    return (
      <div className="grid">
        <Seo title="내 활동 | Koreanit" description="내 글, 댓글, 북마크를 확인하세요." />
        <section className="card" style={{ textAlign: 'center' }}>
          <h1>내 활동</h1>
          <p className="muted">로그인 후 내 활동을 확인할 수 있습니다.</p>
          <Link to="/login" className="button">로그인</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="grid">
      <Seo title="내 활동 | Koreanit" description="내 글, 댓글, 북마크를 확인하세요." />
      <section className="card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="button btn-md" style={{ background: tab === 'posts' ? '#AEB877' : '#D8E983' }} onClick={() => setTab('posts')}>
          <span className="btn-icon">📝</span>내 글
        </button>
        <button className="button btn-md" style={{ background: tab === 'comments' ? '#AEB877' : '#D8E983' }} onClick={() => setTab('comments')}>
          <span className="btn-icon">💬</span>내 댓글
        </button>
        <button className="button btn-md" style={{ background: tab === 'bookmarks' ? '#AEB877' : '#D8E983' }} onClick={() => setTab('bookmarks')}>
          <span className="btn-icon">🔖</span>내 북마크
        </button>
      </section>

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <p className="muted" style={{ margin: 0 }}>
          {me ? `${me.nickname || me.username}님의 활동 · ${page}/${totalPages} 페이지 · 총 ${currentList.length}개` : '내 활동'}
        </p>
        <input className="input" value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} placeholder={tab === 'comments' ? '댓글 내용 검색' : '제목/내용 검색'} />
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">최신순(ID 내림차순)</option>
          <option value="oldest">오래된순(ID 오름차순)</option>
          {tab !== 'comments' && <option value="title">제목순</option>}
        </select>
      </section>

      {loading && <LoadingState text="내 활동을 불러오는 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && paged.length === 0 && (
        <section className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <p className="muted" style={{ margin: 0 }}>{emptyText}</p>
        </section>
      )}

      {!loading && !error && tab === 'posts' && paged.map((p) => (
        <article className="card" key={p.id}>
          <h3>{p.title}</h3>
          <p className="muted">내가 쓴 글 · ID {p.id}</p>
          <Link to={`/post/${p.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && tab === 'comments' && paged.map((c) => (
        <article className="card" key={c.id}>
          <p>{c.content}</p>
          <p className="muted">내 댓글 · post #{c.postId}</p>
          <Link to={`/post/${c.postId}`} className="muted">원문 보기</Link>
        </article>
      ))}

      {!loading && !error && tab === 'bookmarks' && paged.map((b) => (
        <article className="card" key={b.id}>
          <h3>{b.title}</h3>
          <p>{b.content}</p>
          <p className="muted">내 북마크 · ID {b.id}</p>
          <Link to={`/post/${b.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && (
        <section className="card" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <button className="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>이전</button>
          <span>{page} / {totalPages}</span>
          <button className="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>다음</button>
        </section>
      )}
    </div>
  )
}
