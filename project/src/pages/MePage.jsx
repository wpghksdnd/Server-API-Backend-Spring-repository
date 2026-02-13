import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

export default function MePage() {
  const [me, setMe] = useState(null)
  const [msg, setMsg] = useState('')
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    api.me().then((r) => {
      if (r.ok) {
        setAuthed(true)
        setMe(r?.data?.data || null)
        setMsg('조회 성공')
      } else {
        setAuthed(false)
        setMe(null)
        setMsg('')
      }
    })
  }, [])

  const logout = async () => {
    const r = await api.logout()
    if (r.ok) {
      setAuthed(false)
      setMe(null)
      setMsg('로그아웃 완료')
    } else {
      setMsg(`로그아웃 실패 (${r.status})`)
    }
  }

  return (
    <section className="card">
      <Seo title="내 정보 | Koreanit" description="프로필 정보" />
      <h1>내 정보</h1>

      {!authed ? (
        <div>
          <p className="muted">로그인 상태가 아닙니다.</p>
          <Link to="/login" className="button">로그인</Link>
        </div>
      ) : (
        <>
          <pre>{JSON.stringify(me, null, 2)}</pre>
          <button className="button danger" onClick={logout}>로그아웃</button>
        </>
      )}

      <p className="muted">{msg}</p>
    </section>
  )
}
