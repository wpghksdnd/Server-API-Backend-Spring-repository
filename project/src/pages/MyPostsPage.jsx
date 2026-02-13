import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

export default function MyPostsPage() {
  const [posts, setPosts] = useState([])
  const [authed, setAuthed] = useState(true)

  useEffect(() => {
    Promise.all([api.me(), api.listPosts({ page: 1, limit: 200 })]).then(([meR, postsR]) => {
      if (!meR.ok) return setAuthed(false)
      const me = meR?.data?.data
      const all = postsR?.data?.data || []
      setPosts(all.filter((p) => p.userId === me?.id))
    })
  }, [])

  if (!authed) {
    return (
      <section className="card">
        <h1>내 게시물</h1>
        <p className="muted">로그인 후 이용 가능합니다.</p>
        <Link className="button" to="/login">로그인</Link>
      </section>
    )
  }

  return (
    <div className="grid">
      <Seo title="내 게시물 | Koreanit" description="내가 작성한 게시글" />
      <section className="card"><h1>내 게시물</h1></section>
      {posts.length === 0 && <section className="card"><p className="muted">작성한 게시물이 없습니다.</p></section>}
      {posts.map((p) => (
        <section className="card" key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <Link className="muted" to={`/post/${p.id}`}>상세 보기</Link>
        </section>
      ))}
    </div>
  )
}
