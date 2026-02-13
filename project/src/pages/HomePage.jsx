import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import AdBannerSlot from '../components/AdBannerSlot'
import EmptyState from '../components/EmptyState'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const r = await api.listPosts()
    if (!r.ok) setError(`목록 조회에 실패했습니다. (${r.status})`)
    else setPosts(r?.data?.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return posts.filter((p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q),
    )
  }, [posts, query])

  return (
    <>
      <Seo title="Koreanit Community" description="Spring Boot API 기반 커뮤니티 서비스" />
      <section className="hero">
        <h1>운영 서비스 스타일 React 프론트</h1>
        <p>Spring Boot API를 사용하는 Koreanit 커뮤니티</p>
      </section>
      {loading && <LoadingState text="홈 데이터를 불러오는 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && posts.length === 0 && <EmptyState title="아직 게시글이 없습니다." description="첫 글을 작성해 커뮤니티를 시작해보세요." />}
      {!loading && !error && posts.length > 0 && (
        <>
          <div className="grid grid-3" style={{ marginBottom: 10 }}>
            {posts.slice(0, 3).map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title || '제목 없음'}</h3>
                <p className="muted">ID {p.id}</p>
                <p>{p.content?.slice(0, 120) || '내용 없음'}</p>
                <Link to={`/post/${p.id}`} className="muted">자세히 보기</Link>
              </article>
            ))}
          </div>

          <div style={{ margin: '8px 0 14px' }}>
            <AdBannerSlot slot="home-middle" />
          </div>

          <div className="grid grid-3" style={{ marginBottom: 14 }}>
            {posts.slice(3, 6).map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title || '제목 없음'}</h3>
                <p className="muted">ID {p.id}</p>
                <p>{p.content?.slice(0, 120) || '내용 없음'}</p>
                <Link to={`/post/${p.id}`} className="muted">자세히 보기</Link>
              </article>
            ))}
          </div>

          <section className="card" style={{ display: 'grid', gap: 10, marginTop: 6 }}>
            <h3 style={{ margin: 0 }}>게시글 검색</h3>
            <input
              className="input"
              placeholder="제목 또는 내용으로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query.trim() && filtered.length === 0 && (
              <p className="muted">검색 결과가 없습니다.</p>
            )}

            {query.trim() && filtered.length > 0 && (
              <div className="grid" style={{ gap: 8 }}>
                {filtered.slice(0, 9).map((p) => (
                  <article key={p.id} className="card" style={{ padding: 12 }}>
                    <strong>{p.title || '제목 없음'}</strong>
                    <p className="muted" style={{ margin: '6px 0' }}>ID {p.id}</p>
                    <p style={{ margin: 0 }}>{(p.content || '').slice(0, 80)}</p>
                    <Link to={`/post/${p.id}`} className="muted">자세히 보기</Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}
