export default function EmptyState({ title = '데이터가 없습니다.', description = '', action = null }) {
  return (
    <section className="card" style={{ display: 'grid', gap: 8 }}>
      <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>
      {description && <p className="muted" style={{ margin: 0 }}>{description}</p>}
      {action}
    </section>
  )
}
