import Seo from '../components/Seo'

export default function ContactPage() {
  return (
    <section className="card">
      <Seo title="문의 | Koreanit" description="Koreanit 운영 문의" />
      <h1>문의하기</h1>
      <p>운영/개발 문의는 아래로 연락해주세요.</p>
      <p><strong>Email:</strong> support@koreanit.local</p>
      <p><strong>Hours:</strong> 평일 10:00 - 18:00 (KST)</p>
    </section>
  )
}
