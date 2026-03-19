import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { PLANS } from '../data/adminSeedData'

const V = { purple: '#8b5cf6', purpleBright: '#a78bfa', purpleMuted: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.18)', border2: 'rgba(139,92,246,0.28)' }

const statusColor = (s) => s === 'active' ? 'var(--green)' : s === 'trial' ? 'var(--amber)' : 'var(--red)'
const statusBg    = (s) => s === 'active' ? 'var(--green-muted)' : s === 'trial' ? 'var(--amber-muted)' : 'var(--red-muted)'

const activityIcon = (type) => ({ cert_upload:'🏅', factory_join:'🏭', plan_upgrade:'⬆️', incident:'⚠️', suspension:'🔴', wage_alert:'💸', checklist:'✅', cert_expiry:'⏰' }[type] ?? '📋')

export default function AdminOverview() {
  const { state } = useAdmin()
  const navigate  = useNavigate()

  const active    = state.factories.filter(f => f.status === 'active').length
  const trial     = state.factories.filter(f => f.status === 'trial').length
  const suspended = state.factories.filter(f => f.status === 'suspended').length
  const totalMRR  = state.factories.reduce((s, f) => s + (f.monthlyRevenue || 0), 0)
  const totalWorkers = state.factories.reduce((s, f) => s + f.workers, 0)

  // Revenue breakdown by plan
  const planRevenue = Object.entries(PLANS).map(([key, plan]) => {
    const count = state.factories.filter(f => f.plan === key && f.status === 'active').length
    return { key, label: plan.label, price: plan.price, count, total: count * plan.price }
  })

  // BSCI health across all factories
  const avgBsci = Math.round(state.factories.reduce((s, f) => s + f.bsciScore, 0) / state.factories.length)

  const MetricCard = ({ label, value, sub, color = 'var(--green)', accent }) => (
    <div style={{ background: 'var(--bg2)', border: `1px solid ${accent || 'var(--border)'}`, borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 10px 0 60px', background: color, opacity: 0.07 }} />
      <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', color, margin: '6px 0 4px' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{sub}</div>}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.3px' }}>
          Admin Overview
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, fontFamily: 'IBM Plex Mono, monospace' }}>
          PLATFORM HEALTH · {state.factories.length} FACTORIES
        </div>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <MetricCard label="Monthly Revenue"  value={`৳${(totalMRR/1000).toFixed(1)}K`} sub={`${active} paying factories`} color="var(--green)" />
        <MetricCard label="Active Factories" value={active}    sub={`${trial} on trial`}           color="var(--green)" />
        <MetricCard label="Total Workers"    value={totalWorkers.toLocaleString()} sub="Across all factories" color="var(--blue)" />
        <MetricCard label="Avg BSCI Score"   value={`${avgBsci}%`} sub="Platform average"         color={avgBsci >= 75 ? 'var(--green)' : 'var(--amber)'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Factories table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">All Factories</span>
            <span className="card-action" onClick={() => navigate('/admin/factories')}>Manage all →</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {['Factory', 'Plan', 'Workers', 'BSCI', 'Status'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {state.factories.map(f => (
                  <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/factories/${f.id}`)}>
                    <td className="td-name" style={{ maxWidth: 160 }}>{f.name}</td>
                    <td>
                      <span className="badge neutral" style={{ textTransform: 'capitalize' }}>
                        {PLANS[f.plan]?.label}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text2)' }}>{f.workers}</td>
                    <td>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: f.bsciScore >= 75 ? 'var(--green)' : f.bsciScore >= 60 ? 'var(--amber)' : 'var(--red)' }}>
                        {f.bsciScore}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', padding: '2px 7px', borderRadius: 4, fontWeight: 500, background: statusBg(f.status), color: statusColor(f.status), border: `1px solid ${statusColor(f.status)}40` }}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Revenue by plan */}
          <div className="card">
            <div className="card-header"><span className="card-title">Revenue Breakdown</span></div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {planRevenue.map(p => (
                <div key={p.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{p.label} <span style={{ color: 'var(--text3)' }}>×{p.count}</span></span>
                    <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text)' }}>৳{p.total.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2 }}>
                    <div style={{ width: `${totalMRR ? (p.total / totalMRR) * 100 : 0}%`, height: '100%', background: 'var(--green)', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase' }}>Total MRR</span>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--green)' }}>৳{totalMRR.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Actions</span></div>
            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: '🏭  Onboard a new factory', action: () => navigate('/admin/onboard') },
                { label: '📊  View revenue report',   action: () => navigate('/admin/revenue') },
                { label: '🔔  Check alerts',          action: () => navigate('/admin/alerts') },
              ].map(({ label, action }) => (
                <button key={label} className="btn btn-ghost" style={{ justifyContent: 'flex-start', width: '100%', fontSize: 12 }} onClick={action}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="card">
        <div className="card-header"><span className="card-title">Platform Activity</span></div>
        <div>
          {state.activity.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', borderBottom: i < state.activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{activityIcon(a.type)}</span>
              <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{a.msg}</span>
              <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
