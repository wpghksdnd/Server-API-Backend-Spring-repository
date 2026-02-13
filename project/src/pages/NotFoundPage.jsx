import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFoundPage() {
  return (
    <section className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Seo title="404 | Koreanit" description="요청하신 페이지를 찾을 수 없습니다." />
      <h1 style={{ fontSize: 42, margin: 0 }}>404</h1>
      <p className="muted">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="button" style={{ display: 'inline-block', marginTop: 12 }}>홈으로 이동</Link>
    </section>
  )
}
