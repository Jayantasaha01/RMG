export default function StatCard({ label, value, color = 'green', meta }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className={`stat-val ${color}`}>{value}</div>
      {meta && <div className="stat-meta">{meta}</div>}
    </div>
  )
}
