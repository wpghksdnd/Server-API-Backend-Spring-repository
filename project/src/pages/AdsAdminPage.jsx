import { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { api } from '../api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const initialForm = {
  slot: 'home-middle',
  title: '',
  description: '',
  imageUrl: '/assets/logo-koreanit.svg',
  linkUrl: 'https://example.com',
  bgColor: '#FFFBB1',
  active: true,
  priority: 0,
}

export default function AdsAdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [items, setItems] = useState([])
  const [slotFilter, setSlotFilter] = useState('all')
  const [form, setForm] = useState(initialForm)
  const [editId, setEditId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    const r = await api.adsAll()
    if (!r.ok) setError(`광고 목록 조회 실패 (${r.status}) - 로그인 필요`)
    else setItems(r?.data?.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const visible = useMemo(() => slotFilter === 'all' ? items : items.filter((x) => x.slot === slotFilter), [items, slotFilter])

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const submit = async () => {
    const payload = { ...form, priority: Number(form.priority || 0) }
    const r = editId ? await api.adUpdate(editId, payload) : await api.adCreate(payload)
    if (!r.ok) return setMsg(`저장 실패 (${r.status})`)
    setMsg(editId ? '광고가 수정되었습니다.' : '광고가 등록되었습니다.')
    setForm(initialForm)
    setEditId(null)
    load()
  }

  const startEdit = (ad) => {
    setEditId(ad.id)
    setForm({
      slot: ad.slot,
      title: ad.title || '',
      description: ad.description || '',
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl || '',
      bgColor: ad.bgColor || '#FFFBB1',
      active: ad.active,
      priority: ad.priority ?? 0,
    })
  }

  const remove = async (id) => {
    const r = await api.adDelete(id)
    if (!r.ok) return setMsg(`삭제 실패 (${r.status})`)
    setMsg('광고가 삭제되었습니다.')
    load()
  }

  return (
    <div className="grid">
      <Seo title="광고 관리자 | Koreanit" description="광고 배너 관리" />

      <section className="card animate-pop">
        <h1>광고 관리자</h1>
        <p className="muted">{msg}</p>
        <div style={{ display: 'grid', gap: 8 }}>
          <input className="input" value={form.slot} onChange={(e) => onChange('slot', e.target.value)} placeholder="slot (home-middle)" />
          <input className="input" value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="title" />
          <input className="input" value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="description" />
          <input className="input" value={form.imageUrl} onChange={(e) => onChange('imageUrl', e.target.value)} placeholder="imageUrl" />
          <input className="input" value={form.linkUrl} onChange={(e) => onChange('linkUrl', e.target.value)} placeholder="linkUrl" />
          <input className="input" value={form.bgColor} onChange={(e) => onChange('bgColor', e.target.value)} placeholder="bgColor (#FFFBB1)" />
          <input className="input" type="number" value={form.priority} onChange={(e) => onChange('priority', e.target.value)} placeholder="priority" />
          <label className="muted"><input type="checkbox" checked={form.active} onChange={(e) => onChange('active', e.target.checked)} /> active</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="button" onClick={submit}>{editId ? '수정 저장' : '광고 등록'}</button>
            {editId && <button className="button secondary" onClick={() => { setEditId(null); setForm(initialForm) }}>편집 취소</button>}
          </div>
        </div>

        <div className="ad-banner" style={{ marginTop: 10, background: form.bgColor || '#FFFBB1' }}>
          <img src={form.imageUrl} alt={form.title} className="ad-thumb" />
          <div>
            <p className="muted" style={{ margin: 0 }}>미리보기</p>
            <h3 style={{ margin: '2px 0 4px' }}>{form.title || '제목'}</h3>
            <p style={{ margin: 0 }}>{form.description || '설명'}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <label className="muted">슬롯 필터</label>
        <select className="input" value={slotFilter} onChange={(e) => setSlotFilter(e.target.value)}>
          <option value="all">전체</option>
          <option value="home-middle">home-middle</option>
          <option value="posts-middle">posts-middle</option>
        </select>
      </section>

      {loading && <LoadingState text="광고 목록 로딩 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && visible.map((ad) => (
        <section className="card" key={ad.id}>
          <p className="muted">{ad.slot} · {ad.id}</p>
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
          <p className="muted">{ad.linkUrl}</p>
          <p className="muted">active: {String(ad.active)} · priority: {ad.priority} · clicks: {ad.clicks}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="button btn-sm" onClick={() => startEdit(ad)}>수정</button>
            <button className="button danger btn-sm" onClick={() => remove(ad.id)}>삭제</button>
          </div>
        </section>
      ))}
    </div>
  )
}
