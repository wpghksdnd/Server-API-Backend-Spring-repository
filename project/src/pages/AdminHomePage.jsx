import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { api } from '../api'

export default function AdminHomePage() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [methodFilter, setMethodFilter] = useState('ALL')

  useEffect(() => {
    Promise.all([api.adminSummary(), api.adminRecentActions(30)]).then(([s, r]) => {
      if (s.ok) setSummary(s?.data?.data || null)
      if (r.ok) setRecent(r?.data?.data || [])
    })
  }, [])

  const roleBadge = <span className="status-badge status-up"><span className="dot" /> ADMIN</span>

  const relativeTime = (iso) => {
    if (!iso) return '-'
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return '-'
    const diffSec = Math.floor((Date.now() - t) / 1000)
    if (diffSec < 60) return '방금 전'
    const m = Math.floor(diffSec / 60)
    if (m < 60) return `${m}분 전`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}시간 전`
    const d = Math.floor(h / 24)
    return `${d}일 전`
  }

  const filteredRecent = useMemo(() => {
    if (methodFilter === 'ALL') return recent
    return recent.filter((x) => x.method === methodFilter)
  }, [recent, methodFilter])

  return (
    <div className="grid">
      <Seo title="관리자 페이지 | Koreanit" description="관리자 전용 페이지" />

      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ margin: 0 }}>관리자 페이지</h1>
          <p className="muted" style={{ margin: 0 }}>운영 기능은 관리자만 접근할 수 있습니다.</p>
        </div>
        {roleBadge}
      </section>

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <article className="card">
          <p className="muted">운영헬스</p>
          {roleBadge}
          <p className="muted">서비스 상태 확인 페이지</p>
          <Link className="button btn-sm" to="/ops-health">이동</Link>
        </article>
        <article className="card">
          <p className="muted">광고관리</p>
          {roleBadge}
          <p className="muted">광고 배너 등록/수정/삭제</p>
          <Link className="button secondary btn-sm" to="/ads-admin">이동</Link>
        </article>
      </section>

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <article className="card">
          <p className="muted">총 광고</p>
          <h3 style={{ margin: 0 }}>{summary?.totalAds ?? '-'}</h3>
        </article>
        <article className="card">
          <p className="muted">활성 광고</p>
          <h3 style={{ margin: 0 }}>{summary?.activeAds ?? '-'}</h3>
        </article>
        <article className="card">
          <p className="muted">누적 클릭</p>
          <h3 style={{ margin: 0 }}>{summary?.totalClicks ?? '-'}</h3>
        </article>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>최근 작업 로그 요약</h3>
          <select className="input" style={{ margin: 0, maxWidth: 180 }} value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="ALL">전체 메서드</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {filteredRecent.length === 0 && <p className="muted">조건에 맞는 작업 로그가 없습니다.</p>}
        {filteredRecent.map((x, i) => {
          const ok = x.status >= 200 && x.status < 400
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '74px 1fr auto auto', gap: 8, padding: '8px 0', borderTop: i ? '1px solid #e3e8c5' : 'none', alignItems: 'center' }}>
              <span className="method-chip">{x.method}</span>
              <span className="muted">{x.path} · userId: {x.userId ?? '-'}</span>
              <span className={`log-chip ${ok ? 'log-ok' : 'log-fail'}`}>{x.status}</span>
              <span className="muted">{relativeTime(x.at)} · {x.elapsedMs}ms</span>
            </div>
          )
        })}
      </section>
    </div>
  )
}
