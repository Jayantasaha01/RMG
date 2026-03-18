import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import StatCard from '../components/ui/StatCard'
import { daysUntil, certStatusColor, todayLabel } from '../utils/helpers'

const MIN_WAGE = 12500

export default function Dashboard() {
  const { state } = useApp()
  const navigate  = useNavigate()

  const totalWorkers  = state.workers.length
  const violations    = state.workers.filter(w => w.wage < MIN_WAGE).length
  const expiringCerts = state.certs.filter(c => { const d = daysUntil(c.expiry); return d >= 0 && d <= 60 }).length
  const expiredCerts  = state.certs.filter(c => daysUntil(c.expiry) < 0).length
  const certAlert     = expiringCerts + expiredCerts

  // BSCI score
  const allItems = state.checklists.bsci.flatMap(s => s.items)
  const done     = allItems.filter(i => i.checked).length
  const bsciPct  = Math.round((done / allItems.length) * 100)

  // Sections breakdown
  const sections = state.checklists.bsci.map(sec => {
    const d = sec.items.filter(i => i.checked).length
    const p = Math.round((d / sec.items.length) * 100)
    return { name: sec.section.replace(/^[A-Z]\. /, ''), pct: p }
  })

  // Upcoming deadlines (certs within 90 days, sorted)
  const deadlines = state.certs
    .map(c => ({ ...c, days: daysUntil(c.expiry) }))
    .filter(c => c.days >= 0 && c.days <= 90)
    .sort((a, b) => a.days - b.days)

  const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  function fmtDeadline(dateStr) {
    const d = new Date(dateStr)
    return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}`
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-title">Good morning — Khaled Textiles</div>
        <div className="page-subtitle">COMPLIANCE OVERVIEW · {todayLabel()}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-4">
        <StatCard label="Total Workers"    value={totalWorkers} color="green" meta={<><span style={{color:'var(--green)'}}>+8</span> this month</>} />
        <StatCard label="Certs Expiring"   value={certAlert}    color="amber" meta={<span style={{color:'var(--amber)'}}>Within 60 days</span>} />
        <StatCard label="BSCI Readiness"   value={`${bsciPct}%`} color="green" meta={<>Audit in <span style={{color:'var(--green)'}}>47 days</span></>} />
        <StatCard label="Wage Violations"  value={violations}   color="red"   meta={<span style={{color:'var(--red)'}}>Below min wage</span>} />
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* BSCI score card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">BSCI Audit Readiness Score</span>
            <span className="card-action" onClick={() => navigate('/audits')}>View checklist →</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 16 }}>
            {/* Ring */}
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--bg4)" strokeWidth="8" />
              <circle
                cx="45" cy="45" r="36" fill="none"
                stroke="var(--green)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray="226.2"
                strokeDashoffset={226.2 - (226.2 * bsciPct) / 100}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            {/* Breakdown */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Section breakdown
              </div>
              {sections.map(({ name, pct }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{name}</span>
                  <div style={{ flex: 1, height: 3, background: 'var(--bg4)', borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? 'var(--green)' : 'var(--amber)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: pct >= 80 ? 'var(--green)' : 'var(--amber)', width: 34, textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Certifications</span>
            <span className="card-action" onClick={() => navigate('/certifications')}>Manage →</span>
          </div>
          <div style={{ padding: 0 }}>
            {state.certs.map(c => {
              const days  = daysUntil(c.expiry)
              const color = certStatusColor(days)
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${color})`, boxShadow: `0 0 6px var(--${color})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text2)' }}>{c.expiry}</span>
                  <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', padding: '2px 8px', borderRadius: 4, fontWeight: 500, background: `var(--${color}-muted)`, color: `var(--${color})` }}>
                    {days < 0 ? 'Expired' : `${days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Activity */}
        <div className="card">
          <div className="card-header"><span className="card-title">Recent Activity</span></div>
          <div style={{ padding: '0 0 4px' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 16px', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="activity-icon" style={{ background: `var(--${a.color}-muted)`, color: `var(--${a.color})` }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="card">
          <div className="card-header"><span className="card-title">Upcoming Deadlines</span></div>
          {deadlines.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>No deadlines in the next 90 days</div>
          ) : (
            deadlines.map((c, i) => {
              const color = c.days <= 35 ? 'red' : c.days <= 60 ? 'amber' : 'green'
              return (
                <div key={c.id} style={{ padding: '10px 16px', borderBottom: i < deadlines.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: `var(--${color}-muted)`, color: `var(--${color})`, borderRadius: 6, padding: '4px 8px', fontSize: 10, fontFamily: 'IBM Plex Mono', fontWeight: 600, flexShrink: 0 }}>
                    {fmtDeadline(c.expiry)}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: `var(--${color})`, fontFamily: 'IBM Plex Mono' }}>{c.days} days remaining</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
    <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ClockIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
    <path d="M7 3v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)
const WarnIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
    <path d="M7 2L13 11H1L7 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M7 6v2.5M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const CalIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
    <rect x="2" y="3" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 3V2M9 3V2M2 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const ACTIVITY = [
  { color: 'green', icon: <CheckIcon />, text: '<strong>Worker NID uploaded</strong> — Roksana Begum (W-0318)', time: '2 hours ago' },
  { color: 'amber', icon: <ClockIcon />, text: '<strong>BSCI audit reminder</strong> — cert expires in 46 days',  time: 'Today, 9:00 AM' },
  { color: 'red',   icon: <WarnIcon />, text: '<strong>Wage violation flagged</strong> — 3 workers below ৳12,500/mo', time: 'Yesterday' },
  { color: 'blue',  icon: <CalIcon />,  text: '<strong>March wages logged</strong> — 342 workers processed',        time: '2 days ago' },
  { color: 'green', icon: <CheckIcon />, text: '<strong>Health & Safety checklist</strong> — 8 items marked complete', time: '3 days ago' },
]
