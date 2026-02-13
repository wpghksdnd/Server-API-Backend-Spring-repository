import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from './api'
import LoadingState from './components/LoadingState'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshAuth = async () => {
    setLoading(true)
    const [meR, adminR] = await Promise.all([api.me(), api.adminMe()])
    setUser(meR.ok ? meR?.data?.data : null)
    setIsAdmin(adminR.ok)
    setLoading(false)
  }

  useEffect(() => {
    refreshAuth()

    const onChanged = () => refreshAuth()
    const onExpired = () => {
      setUser(null)
      setIsAdmin(false)
    }

    window.addEventListener('auth:changed', onChanged)
    window.addEventListener('auth:expired', onExpired)
    return () => {
      window.removeEventListener('auth:changed', onChanged)
      window.removeEventListener('auth:expired', onExpired)
    }
  }, [])

  const value = useMemo(() => ({ user, isAdmin, loading, authed: !!user, refreshAuth }), [user, isAdmin, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.')
  return ctx
}

export function ProtectedRoute({ children }) {
  const { authed, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingState text="로그인 상태를 확인하는 중..." />
  if (!authed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return <LoadingState text="권한을 확인하는 중..." />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
