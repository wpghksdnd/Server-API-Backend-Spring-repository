import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import AdBannerSlot from '../components/AdBannerSlot'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const r = await api.listPosts()
    if (!r.ok) {
      setError(`목록 조회 실패 (${r.status})`)
    } else {
      setPosts(r?.data?.data || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <Seo title="Koreanit Community" description="Spring Boot API 기반 커뮤니티 서비스" />
      <section className="hero">
        <h1>운영 서비스 스타일 React 프론트</h1>
        <p>Spring Boot API를 사용하는 Koreanit 커뮤니티</p>
      </section>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && (
        <>
          <div className="grid grid-3">
            {posts.slice(0, 3).map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title || '제목 없음'}</h3>
                <p className="muted">ID {p.id}</p>
                <p>{p.content?.slice(0, 120) || '내용 없음'}</p>
                <Link to={`/post/${p.id}`} className="muted">자세히 보기</Link>
              </article>
            ))}
          </div>

          <AdBannerSlot slot="home-middle" />

          <div className="grid grid-3">
            {posts.slice(3, 6).map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title || '제목 없음'}</h3>
                <p className="muted">ID {p.id}</p>
                <p>{p.content?.slice(0, 120) || '내용 없음'}</p>
                <Link to={`/post/${p.id}`} className="muted">자세히 보기</Link>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  )
}
