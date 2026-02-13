import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

const DRAFT_KEY = 'koreanit:draft:write'

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})
  const [authed, setAuthed] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    api.me().then((r) => setAuthed(r.ok))
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const d = JSON.parse(draft)
        setTitle(d.title || '')
        setContent(d.content || '')
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }))
  }, [title, content])

  useEffect(() => {
    const hasUnsaved = title.trim() || content.trim()
    const onBeforeUnload = (e) => {
      if (!hasUnsaved) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [title, content])

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = '제목을 입력해주세요.'
    if (!content.trim()) e.content = '내용을 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!authed) return setMsg('로그인 후 작성할 수 있습니다.')
    if (!validate()) return
    const r = await api.createPost({ title, content })
    if (r.ok) {
      localStorage.removeItem(DRAFT_KEY)
      setMsg('등록 완료')
      nav('/posts')
    } else {
      setMsg(`등록 실패 (${r.status})`)
    }
  }

  const titleCount = useMemo(() => title.length, [title])
  const contentCount = useMemo(() => content.length, [content])

  return (
    <section className="card animate-pop">
      <Seo title="글쓰기 | Koreanit" description="새 게시글 작성" />
      <h1>새 글 작성</h1>
      {!authed && <p className="muted">로그인이 필요합니다. <Link to="/login" style={{ color: '#4338ca' }}>로그인하러 가기</Link></p>}
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
      <p className="muted" style={{ marginTop: -6 }}>제목 글자수: {titleCount}</p>
      {errors.title && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.title}</p>}
      <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
      <p className="muted" style={{ marginTop: -6 }}>내용 글자수: {contentCount}</p>
      {errors.content && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.content}</p>}
      <button className="button" onClick={submit} disabled={!authed}>등록하기</button>
      <p className="muted">{msg}</p>
    </section>
  )
}
