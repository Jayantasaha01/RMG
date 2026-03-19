import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import FactoryPanel from '../components/FactoryPanel'

export default function AdminDashboard() {
  const { state }     = useAdmin()
  const navigate      = useNavigate()
  const [selected, setSelected] = useState(null)

  const { factories } = state
  const active   = factories.filter(f => f.status === 'active').length
  const trial    = factories.filter(f => f.status === 'trial').length
  const pending  = factories.filter(f => f.status === 'pending').length
  const totalMRR = factories.reduce((s, f) => s + (f.mrr || 0), 0)
  const avgBSCI  = Math.round(factories.reduce((s, f) => s + f.bsciScore, 0) / factories.length)

  // Mock MRR chart (last 6 months growing to current)
  const chartData = [
    { month: 'OCT', val: 8000 },
    { month: 'NOV', val: 14000 },
    { month: 'DEC', val: 18000 },
    { month: 'JAN', val: 24000 },
    { month: 'FEB', val: 32000 },
    { month: 'MAR', val: totalMRR },
  ]
  const maxVal = Math.max(...chartData.map(d => d.val))

  // Factories needing attention (pending or low BSCI or trial expiring soon)
  const attention = factories.filter(f =>
    f.status === 'pending' ||
    (f.status === 'trial' && f.trialEnd) ||
    f.bsciScore < 40
  )

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Admin Dashboard</div>
        <div className="page-subtitle">BUSINESS OVERVIEW · FACTORY HEALTH</div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Monthly Recurring Revenue</div>
          <div className="kpi-val" style={{ color: 'var(--green)' }}>৳{(totalMRR / 1000).toFixed(0)}K</div>
          <div className="kpi-sub">from {active} paying factories</div>
          <div className="kpi-delta up">+12%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Factories</div>
          <div className="kpi-val" style={{ color: 'var(--text)' }}>{active}</div>
          <div className="kpi-sub">{trial} on trial · {pending} pending</div>
          <div className="kpi-delta up">+2</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg BSCI Score</div>
          <div className="kpi-val" style={{ color: avgBSCI >= 70 ? 'var(--green)' : 'var(--amber)' }}>{avgBSCI}%</div>
          <div className="kpi-sub">across all factories</div>
          <div className="kpi-delta up">+5%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Needs Attention</div>
          <div className="kpi-val" style={{ color: attention.length > 0 ? 'var(--red)' : 'var(--green)' }}>{attention.length}</div>
          <div className="kpi-sub">factories require action</div>
          {attention.length > 0 && <div className="kpi-delta down">Review</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* MRR chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">MRR Growth (৳)</span>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: 'var(--green)' }}>
              ৳{totalMRR.toLocaleString()}/mo
            </span>
          </div>
          <div style={{ padding: '16px 20px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {chartData.map(({ month, val }) => (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.round((val / maxVal) * 72)}px`,
                      background: month === 'MAR' ? 'var(--green)' : 'var(--green-muted)',
                      borderRadius: '3px 3px 0 0',
                      border: '1px solid rgba(74,222,128,0.2)',
                      transition: 'height 0.4s',
                    }}
                  />
                  <div style={{ fontSize: 9, fontFamily: 'IBM Plex Mono', color: 'var(--text3)' }}>{month}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              {[
                { label: 'Starter (1)',      val: `৳${(4999).toLocaleString()}` },
                { label: 'Professional (3)', val: `৳${(12999 * 3).toLocaleString()}` },
                { label: 'Trial (1)',         val: '৳0' },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Needs attention */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Needs Attention</span>
            <span className="card-action" onClick={() => navigate('/admin/factories')}>All factories →</span>
          </div>
          <div>
            {attention.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>
                All factories healthy ✓
              </div>
            ) : attention.map((f, i) => {
              const reason = f.status === 'pending'
                ? '⚠ Never logged in'
                : f.status === 'trial' && f.trialEnd
                  ? `⏱ Trial ends ${f.trialEnd}`
                  : `📉 BSCI score ${f.bsciScore}%`
              return (
                <div
                  key={f.id}
                  onClick={() => setSelected(f)}
                  style={{ padding: '10px 16px', borderBottom: i < attention.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2 }}>{reason}</div>
                  </div>
                  <span className={`badge ${f.status === 'pending' ? 'neutral' : 'amber'}`} style={{ textTransform: 'capitalize' }}>{f.status}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Factory status overview */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Factory Overview</span>
          <span className="card-action" onClick={() => navigate('/admin/factories')}>Manage all →</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Factory', 'Location', 'Plan', 'MRR', 'Workers', 'BSCI Score', 'Status', 'Last Active'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {factories.map(f => (
                <tr key={f.id} className="factory-row" onClick={() => setSelected(f)}>
                  <td className="td-name">{f.name}</td>
                  <td style={{ color: 'var(--text3)', fontSize: 11 }}>{f.location}</td>
                  <td><span className={`plan-badge ${f.plan}`}>{f.plan}</span></td>
                  <td style={{ fontFamily: 'IBM Plex Mono', color: f.mrr > 0 ? 'var(--green)' : 'var(--text3)' }}>
                    {f.mrr > 0 ? `৳${f.mrr.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>{f.workerCount}</td>
                  <td>
                    <div className="prog-wrap">
                      <div className="prog-bar">
                        <div className="prog-fill" style={{ width: `${f.bsciScore}%`, background: f.bsciScore >= 70 ? 'var(--green)' : f.bsciScore >= 40 ? 'var(--amber)' : 'var(--red)' }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', width: 32, color: f.bsciScore >= 70 ? 'var(--green)' : f.bsciScore >= 40 ? 'var(--amber)' : 'var(--red)' }}>
                        {f.bsciScore}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={`status-dot ${f.status}`} />
                      <span style={{ fontSize: 11, textTransform: 'capitalize', color: 'var(--text2)' }}>{f.status}</span>
                    </span>
                  </td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>{f.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <FactoryPanel factory={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
