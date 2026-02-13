import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'

const REMEMBER_KEY = 'koreanit:remember:username'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})
  const nav = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) setUsername(saved)
  }, [])

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = 'username을 입력해주세요.'
    if (!password.trim()) e.password = 'password를 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const login = async () => {
    if (!validate()) return
    const r = await api.login({ username, password })
    if (r.ok) {
      if (remember) localStorage.setItem(REMEMBER_KEY, username)
      else localStorage.removeItem(REMEMBER_KEY)
      setMsg('로그인 성공')
      nav('/me')
    } else if (r.status === 401) {
      setMsg('아이디 또는 비밀번호가 올바르지 않습니다.')
    } else {
      setMsg(`로그인 실패 (${r.status})`)
    }
  }

  return (
    <section className="card animate-pop" style={{ maxWidth: 480 }}>
      <Seo title="로그인 | Koreanit" description="Koreanit 로그인 페이지" />
      <h1>로그인</h1>
      <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      {errors.username && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.username}</p>}
      <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      {errors.password && <p style={{ color: '#b91c1c', marginTop: -6 }}>{errors.password}</p>}
      <label className="muted"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> username 기억하기</label>
      <button className="button" onClick={login}>로그인</button>
      <p className="muted">{msg}</p>
      <p className="muted">아직 계정이 없다면 <Link to="/signup" style={{ color: '#4338ca' }}>회원가입</Link></p>
    </section>
  )
}
