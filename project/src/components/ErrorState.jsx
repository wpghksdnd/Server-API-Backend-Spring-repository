export default function ErrorState({ message = '문제가 발생했습니다.', onRetry }) {
  return (
    <div className="card">
      <p style={{ color: '#b91c1c' }}>{message}</p>
      {onRetry && <button className="button" onClick={onRetry}>다시 시도</button>}
    </div>
  )
}
