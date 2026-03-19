import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { useAuth } from '../../auth/AuthContext'

const MIN_WAGE = 12500

export default function Sidebar() {
  const { state } = useApp()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Live badge counts
  const certWarnings = state.certs.filter(c => {
    const d = Math.round((new Date(c.expiry) - new Date()) / 86_400_000)
    return d < 60
  }).length

  const openIncidents = state.incidents.filter(i => !i.resolved).length

  // BSCI readiness score
  const bsci = state.checklists.bsci
  const done  = bsci.flatMap(s => s.items).filter(i => i.checked).length
  const total = bsci.flatMap(s => s.items).length
  const score = total ? Math.round((done / total) * 100) : 0

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="logo-icon">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <rect x="2" y="6" width="5" height="8" rx="1" fill="white"/>
              <rect x="9" y="3" width="5" height="11" rx="1" fill="white"/>
              <path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="logo-name">ComplyRMG</div>
            <div className="logo-sub">Compliance Platform</div>
          </div>
        </div>
      </div>

      {/* Factory selector */}
      <div className="factory-pill">
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Active Factory
        </div>
        <div className="factory-btn">
          <span>{state.factory.name}</span>
          <svg viewBox="0 0 10 10" width="10" fill="none">
            <path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group-lbl">Overview</div>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <DashboardIcon /> Dashboard
        </NavLink>

        <div className="nav-group-lbl">Compliance</div>

        <NavLink to="/workers" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <WorkersIcon /> Worker Records
        </NavLink>

        <NavLink to="/certifications" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <CertIcon /> Certifications
          {certWarnings > 0 && <span className="nav-badge amber">{certWarnings}</span>}
        </NavLink>

        <NavLink to="/audits" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <AuditIcon /> Audit Checklists
        </NavLink>

        <NavLink to="/wages" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <WageIcon /> Wage Register
        </NavLink>

        <NavLink to="/incidents" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IncidentIcon /> Incident Log
          {openIncidents > 0 && <span className="nav-badge red">{openIncidents}</span>}
        </NavLink>

        <div className="nav-group-lbl">Account</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <SettingsIcon /> Settings
        </NavLink>
      </nav>

      {/* Footer — user info + settings + admin */}
      <div className="sidebar-footer">
        <div className="score-mini">
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            BSCI Readiness
          </div>
          <div className="score-mini-val">{score}%</div>
          <div className="score-mini-bar">
            <div className="score-mini-fill" style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          style={{ marginTop: 8 }}
        >
          <SettingsIcon /> Settings
        </NavLink>

        {/* Admin console (admin only) */}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, padding: '6px 8px', borderRadius: 6, fontSize: 11, color: 'var(--amber)', fontFamily: 'IBM Plex Mono', textDecoration: 'none', border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.06)' }}
          >
            <span>⚙</span> Admin Console
          </NavLink>
        )}

        {/* User chip + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 6px', borderTop: '1px solid var(--border)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--green-muted)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--green)', flexShrink: 0 }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.role}</div>
          </div>
          <button
            title="Sign out"
            onClick={() => { logout(); navigate('/login') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: '2px 4px', borderRadius: 4, flexShrink: 0 }}
          >
            ⏏
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Inline SVG icons ─────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
  </svg>
)
const WorkersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 14c0-3.314 2.239-5 5-5s5 1.686 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M12 7l1.5 1.5L16 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CertIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const AuditIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M10 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const WageIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 5v1m0 4v1M6.5 7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1-1.5 1-1.5.67-1.5 1.5S7.17 11 8 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const IncidentIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14 13H2L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const SettingsIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
