import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', nickname: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})
  const nav = useNavigate()

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const e = {}
    if (form.username.trim().length < 4) e.username = 'username은 4자 이상이어야 합니다.'
    if (!form.nickname.trim()) e.nickname = 'nickname을 입력해주세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '올바른 email 형식이 아닙니다.'
    if (form.password.trim().length < 4) e.password = 'password는 4자 이상이어야 합니다.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    const r = await api.signup(form)
    if (r.ok) {
      setMsg('회원가입 성공! 로그인 페이지로 이동합니다.')
      setTimeout(() => nav('/login'), 600)
    } else if (r.status === 409) {
      setMsg('이미 사용 중인 계정 정보가 있습니다.')
    } else {
      setMsg(`회원가입 실패 (${r.status})`)
    }
  }

  const pwStrength = useMemo(() => {
    const p = form.password || ''
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p) || /[a-z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return '약함'
    if (score <= 3) return '보통'
    return '강함'
  }, [form.password])

  return (
    <section className="card animate-pop" style={{ maxWidth: 520 }}>
      <Seo title="회원가입 | Koreanit" description="Koreanit 회원가입 페이지" />
      <h1>회원가입</h1>
      <input className="input" value={form.username} onChange={(e) => onChange('username', e.target.value)} placeholder="username" />
      {errors.username && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.username}</p>}
      <input className="input" value={form.nickname} onChange={(e) => onChange('nickname', e.target.value)} placeholder="nickname" />
      {errors.nickname && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.nickname}</p>}
      <input className="input" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="email" />
      {errors.email && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.email}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" style={{ marginBottom: 0 }} type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="password" />
        <button className="button btn-sm secondary" onClick={() => setShowPw((v) => !v)}>{showPw ? '숨김' : '표시'}</button>
      </div>
      <p className="muted" style={{ marginTop: 6 }}>비밀번호 강도: {pwStrength}</p>
      {errors.password && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.password}</p>}
      <button className="button" onClick={submit}>가입하기</button>
      <p className="muted">{msg}</p>
    </section>
  )
}
