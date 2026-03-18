import { useToast } from '../../hooks/useToast'

export default function Toast() {
  const { toasts } = useToast()

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <div
            className="toast-dot"
            style={{ background: t.type === 'red' ? 'var(--red)' : t.type === 'amber' ? 'var(--amber)' : 'var(--green)' }}
          />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
