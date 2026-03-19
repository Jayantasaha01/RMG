import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { useAuth } from '../../auth/AuthContext'

export default function AdminSidebar() {
  const { state }   = useAdmin()
  const { user, logout } = useAuth()
  const navigate    = useNavigate()
  const { factories } = state

  const trialCount   = factories.filter(f => f.status === 'trial').length
  const pendingCount = factories.filter(f => f.status === 'pending').length
  const totalMRR     = factories.reduce((s, f) => s + (f.mrr || 0), 0)

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div className="logo-icon">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <rect x="2" y="6" width="5" height="8" rx="1" fill="white"/>
              <rect x="9" y="3" width="5" height="11" rx="1" fill="white"/>
              <path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="logo-name">ComplyRMG</div>
          </div>
        </div>
        <div className="admin-logo-badge">
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
          <span className="admin-logo-badge-text">Admin Console</span>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'MRR',       val: `৳${(totalMRR / 1000).toFixed(0)}K`, color: 'var(--green)' },
            { label: 'Factories', val: factories.length, color: 'var(--text)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: 'var(--bg3)', borderRadius: 6, padding: '7px 10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'IBM Plex Mono', color, marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-group-lbl">Overview</div>
        <NavLink to="/admin" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <GridIcon /> Dashboard
        </NavLink>

        <div className="nav-group-lbl">Factories</div>
        <NavLink to="/admin/factories" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <FactoryIcon /> All Factories
        </NavLink>
        <NavLink to="/admin/onboarding" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <OnboardIcon /> Onboarding
          {pendingCount > 0 && <span className="nav-badge red">{pendingCount}</span>}
        </NavLink>
        <NavLink to="/admin/trials" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <TrialIcon /> Trial Pipeline
          {trialCount > 0 && <span className="nav-badge amber">{trialCount}</span>}
        </NavLink>

        <div className="nav-group-lbl">Revenue</div>
        <NavLink to="/admin/invoices" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <InvoiceIcon /> Invoices
          {state.invoices.filter(i => i.status === 'overdue').length > 0 && (
            <span className="nav-badge red">{state.invoices.filter(i => i.status === 'overdue').length}</span>
          )}
        </NavLink>
        <NavLink to="/admin/revenue" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <RevenueIcon /> MRR & Billing
        </NavLink>

        <div className="nav-group-lbl">Settings</div>
        <NavLink to="/admin/plans" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <PlansIcon /> Plans & Pricing
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink to="/dashboard" className="nav-item" style={{ color: 'var(--text3)', fontSize: 12 }}>
          <BackIcon /> Back to App
        </NavLink>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 6px', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--amber-muted)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--amber)', flexShrink: 0 }}>
              {user.name?.charAt(0) || 'A'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Admin'}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>Administrator</div>
            </div>
            <button title="Sign out" onClick={() => { logout(); navigate('/') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: '2px 4px' }}>⏏</button>
          </div>
        )}
      </div>
    </aside>
  )
}

const GridIcon    = () => <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/></svg>
const FactoryIcon = () => <svg viewBox="0 0 16 16" fill="none"><path d="M1 13V7l4-3v3l4-3v9H1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><rect x="9" y="4" width="6" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M4 10h1M4 12h1M11 7h1M11 9h1M11 11h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const OnboardIcon = () => <svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M1 14c0-3.314 2.239-5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const TrialIcon   = () => <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const RevenueIcon = () => <svg viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
const InvoiceIcon = () => <svg viewBox="0 0 16 16" fill="none"><path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/><path d="M10 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M5 9h6M5 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="12" cy="12" r="2.5" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1"/><path d="M11.5 12h1.5M12.5 11.5v1" stroke="currentColor" strokeWidth=".8" strokeLinecap="round"/></svg>
const PlansIcon   = () => <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 7h14M5 7v6" stroke="currentColor" strokeWidth="1.3"/></svg>
const BackIcon    = () => <svg viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
