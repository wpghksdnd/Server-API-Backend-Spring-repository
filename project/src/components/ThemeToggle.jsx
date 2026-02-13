import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('koreanit:theme')
    const isDark = saved === 'dark'
    setDark(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('koreanit:theme', next ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <button className="button btn-sm outline" onClick={toggle}>
      <span className="btn-icon">{dark ? '🌙' : '☀️'}</span>
      {dark ? '다크' : '라이트'}
    </button>
  )
}
