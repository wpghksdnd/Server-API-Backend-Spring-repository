import { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { api } from '../api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function OpsHealthPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = async () => {
    setError('')
    const r = await api.opsHealth()
    if (!r.ok) {
      setError(`헬스 조회 실패 (${r.status})`)
    } else {
      setData(r?.data?.data || null)
      setLastUpdated(new Date())
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [])

  const serviceUp = useMemo(() => (data?.status || '').toUpperCase() === 'UP', [data])
  const dbUp = useMemo(() => (data?.db || '').toUpperCase() === 'UP', [data])

  const fmtTime = (d) => (d ? d.toLocaleString('ko-KR') : '-')
  const fmtUptime = (ms) => {
    if (!ms && ms !== 0) return '-'
    const sec = Math.floor(ms / 1000)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <div className="grid">
      <Seo title="운영 헬스 | Koreanit" description="서비스 헬스 상태" />

      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ margin: 0 }}>운영 헬스 대시보드</h1>
        <p className="muted" style={{ margin: 0 }}>마지막 갱신: {fmtTime(lastUpdated)} · 15초 자동 새로고침</p>
      </section>

      {loading && <LoadingState text="헬스 상태 조회 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && data && (
        <>
          <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <article className="card">
              <p className="muted">서비스 상태</p>
              <div className={`status-badge ${serviceUp ? 'status-up' : 'status-down'}`}>
                <span className="dot" /> {serviceUp ? 'UP' : 'DOWN'}
              </div>
            </article>

            <article className="card">
              <p className="muted">DB 상태</p>
              <div className={`status-badge ${dbUp ? 'status-up' : 'status-down'}`}>
                <span className="dot" /> {dbUp ? 'UP' : 'DOWN'}
              </div>
            </article>

            <article className="card">
              <p className="muted">Uptime</p>
              <h3 style={{ margin: 0 }}>{fmtUptime(data.uptimeMs)}</h3>
            </article>

            <article className="card">
              <p className="muted">Java Version</p>
              <h3 style={{ margin: 0 }}>{data.javaVersion || '-'}</h3>
            </article>
          </section>

          <section className="card">
            <p className="muted">Raw JSON</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </section>
        </>
      )}
    </div>
  )
}
