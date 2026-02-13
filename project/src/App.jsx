import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WritePage from './pages/WritePage'
import MePage from './pages/MePage'
import MyBookmarksPage from './pages/MyBookmarksPage'
import MyActivityPage from './pages/MyActivityPage'
import MyPostsPage from './pages/MyPostsPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import OpsHealthPage from './pages/OpsHealthPage'
import AdsAdminPage from './pages/AdsAdminPage'
import AdminHomePage from './pages/AdminHomePage'
import NotFoundPage from './pages/NotFoundPage'
import MobileMenu from './components/MobileMenu'
import logo from './assets/logo-koreanit.svg'
import NotificationBell from './components/NotificationBell'
import UserMenu from './components/UserMenu'
import ThemeToggle from './components/ThemeToggle'
import BackToTop from './components/BackToTop'
import { api } from './api'

function AdminRoute({ isAdmin, children }) {
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const loadAuth = async () => {
    const meR = await api.me()
    setUser(meR.ok ? meR?.data?.data : null)
    const adminR = await api.adminMe()
    setIsAdmin(adminR.ok)
  }

  useEffect(() => { loadAuth() }, [])

  const authed = !!user

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <NavLink to="/" className="brand">
            <img src={logo} alt="Koreanit" className="brand-logo" />
            <span>Koreanit Community</span>
          </NavLink>
          <nav className="nav nav-desktop">
            <NavLink to="/" end>홈</NavLink>
            <NavLink to="/posts">게시글</NavLink>
            <NavLink to="/write">글쓰기</NavLink>
            {!authed && <NavLink to="/login">로그인</NavLink>}
            {!authed && <NavLink to="/signup">회원가입</NavLink>}
            {isAdmin && <NavLink to="/admin">관리자</NavLink>}
          </nav>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ThemeToggle />
            <NotificationBell />
            {authed ? <UserMenu user={user} isAdmin={isAdmin} /> : <Link to="/login" className="button btn-sm">로그인</Link>}
            <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="메뉴 열기">☰</button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} authed={authed} isAdmin={isAdmin} />

      <main className="container main">{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Koreanit Community · v1.0.0</p>
          <div className="footer-links">
            <NavLink to="/terms">약관</NavLink>
            <NavLink to="/contact">문의</NavLink>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  )
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    api.adminMe().then((r) => setIsAdmin(r.ok))
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/my-bookmarks" element={<MyBookmarksPage />} />
        <Route path="/my-activity" element={<MyActivityPage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin" element={<AdminRoute isAdmin={isAdmin}><AdminHomePage /></AdminRoute>} />
        <Route path="/ops-health" element={<AdminRoute isAdmin={isAdmin}><OpsHealthPage /></AdminRoute>} />
        <Route path="/ads-admin" element={<AdminRoute isAdmin={isAdmin}><AdsAdminPage /></AdminRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
