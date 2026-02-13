import { useState } from 'react'
import { api, notifyAuthChanged } from '../api'
import Seo from '../components/Seo'
import { useAuth } from '../auth'

export default function MePage() {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const { user, authed, refreshAuth } = useAuth()

  const logout = async () => {
    setBusy(true)
    const r = await api.logout()
    if (r.ok) {
      notifyAuthChanged()
      await refreshAuth()
      setMsg('로그아웃 완료')
    } else {
      setMsg(`로그아웃 실패 (${r.status})`)
    }
    setBusy(false)
  }

  return (
    <section className="card">
      <Seo title="내 정보 | Koreanit" description="프로필 정보" />
      <h1>내 정보</h1>

      {!authed ? (
        <p className="muted">세션이 만료되었습니다. 다시 로그인해 주세요.</p>
      ) : (
        <>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button className="button danger" onClick={logout} disabled={busy}>{busy ? '처리 중...' : '로그아웃'}</button>
        </>
      )}

      <p className="muted">{msg}</p>
    </section>
  )
}
