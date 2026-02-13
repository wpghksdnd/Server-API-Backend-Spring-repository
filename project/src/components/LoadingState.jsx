export default function LoadingState({ text = '불러오는 중...' }) {
  return <div className="card"><p className="muted">{text}</p></div>
}
