import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import AdBannerSlot from '../components/AdBannerSlot'
import EmptyState from '../components/EmptyState'

const PAGE_SIZE = 9

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasNext, setHasNext] = useState(false)

  const load = async (targetPage = page) => {
    setLoading(true)
    setError('')

    // 다음 페이지 존재 여부를 알기 위해 1개 더 조회
    const r = await api.listPosts({ page: targetPage, limit: PAGE_SIZE + 1 })
    if (!r.ok) {
      setError(`목록 조회에 실패했습니다. (${r.status})`)
      setPosts([])
      setHasNext(false)
    } else {
      const list = r?.data?.data || []
      setHasNext(list.length > PAGE_SIZE)
      setPosts(list.slice(0, PAGE_SIZE))
      setPage(targetPage)
    }

    setLoading(false)
  }

  useEffect(() => { load(1) }, [])

  const pageNumbers = useMemo(() => {
    const end = hasNext ? page + 1 : page
    return Array.from({ length: end }, (_, i) => i + 1)
  }, [page, hasNext])

  return (
    <div className="grid">
      <Seo title="게시글 목록 | Koreanit" description="최신 게시글을 확인하세요." />
      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <h2 style={{ margin: 0 }}>게시글 목록</h2>
        <p className="muted">한 페이지 9개 · 페이지 {page}</p>
      </section>

      {loading && <LoadingState text="게시글 목록을 불러오는 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={() => load(page)} />}
      {!loading && !error && posts.length === 0 && <EmptyState title="게시글이 없습니다." description="조금 뒤 다시 확인해 주세요." />}

      {!loading && !error && posts.slice(0, 5).map((p) => (
        <article key={p.id} className="card">
          <h2>{p.title || '제목 없음'}</h2>
          <p className="muted">ID {p.id}</p>
          <p>{p.content || '내용 없음'}</p>
          <Link to={`/post/${p.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && posts.length > 0 && <AdBannerSlot slot="posts-middle" />}

      {!loading && !error && posts.slice(5).map((p) => (
        <article key={p.id} className="card">
          <h2>{p.title || '제목 없음'}</h2>
          <p className="muted">ID {p.id}</p>
          <p>{p.content || '내용 없음'}</p>
          <Link to={`/post/${p.id}`} className="muted">상세 보기</Link>
        </article>
      ))}

      {!loading && !error && posts.length > 0 && (
        <section className="card" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="button btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}>
            <span className="btn-icon">◀</span>이전
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              className={`button btn-sm ${n === page ? '' : 'secondary'}`}
              onClick={() => load(n)}
              disabled={n === page}
            >
              {n}
            </button>
          ))}

          {hasNext && <span className="muted">...</span>}

          <button className="button btn-sm" disabled={!hasNext} onClick={() => load(page + 1)}>
            다음<span className="btn-icon">▶</span>
          </button>
        </section>
      )}
    </div>
  )
}
