import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import AdBannerSlot from '../components/AdBannerSlot'

const PAGE_SIZE = 10

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasNext, setHasNext] = useState(false)

  const load = async (targetPage = page) => {
    setLoading(true)
    setError('')
    const r = await api.listPosts({ page: targetPage, limit: PAGE_SIZE })
    if (!r.ok) {
      setError(`목록 조회 실패 (${r.status})`)
      setPosts([])
      setHasNext(false)
    } else {
      const list = r?.data?.data || []
      setPosts(list)
      setHasNext(list.length === PAGE_SIZE)
      setPage(targetPage)
    }
    setLoading(false)
  }

  useEffect(() => { load(1) }, [])

  return (
    <div className="grid">
      <Seo title="게시글 목록 | Koreanit" description="최신 게시글을 확인하세요." />

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <h2 style={{ margin: 0 }}>게시글 목록</h2>
        <p className="muted">서버 페이지네이션 · 페이지 {page}</p>
      </section>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={() => load(page)} />}

      {!loading && !error && posts.length === 0 && (
        <section className="card">
          <p className="muted">게시글이 없습니다.</p>
        </section>
      )}

      {!loading && !error && posts.slice(0, 5).map((p) => (
        <article key={p.id} className="card">
          <h2>{p.title || '제목 없음'}</h2>
          <p className="muted">ID {p.id}</p>
          <p>{p.content || '내용 없음'}</p>
          <Link to={`/post/${p.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && <AdBannerSlot slot="posts-middle" />}

      {!loading && !error && posts.slice(5).map((p) => (
        <article key={p.id} className="card">
          <h2>{p.title || '제목 없음'}</h2>
          <p className="muted">ID {p.id}</p>
          <p>{p.content || '내용 없음'}</p>
          <Link to={`/post/${p.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && (
        <section className="card" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <button className="button btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}><span className="btn-icon">◀</span>이전</button>
          <span>{page}</span>
          <button className="button btn-sm" disabled={!hasNext} onClick={() => load(page + 1)}>다음<span className="btn-icon">▶</span></button>
        </section>
      )}
    </div>
  )
}
