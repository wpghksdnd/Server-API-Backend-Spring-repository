import Seo from '../components/Seo'

export default function TermsPage() {
  return (
    <section className="card">
      <Seo title="이용약관 | Koreanit" description="Koreanit 서비스 이용약관" />
      <h1>서비스 이용약관</h1>
      <p>본 서비스는 학습/테스트 목적으로 제공됩니다.</p>
      <ul>
        <li>1. 타인의 권리를 침해하는 콘텐츠 등록 금지</li>
        <li>2. 비정상적 트래픽/공격성 요청 금지</li>
        <li>3. 서비스 품질 향상을 위해 로그가 수집될 수 있음</li>
      </ul>
    </section>
  )
}
