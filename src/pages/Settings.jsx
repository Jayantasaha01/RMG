import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../hooks/useToast'

const SECTIONS = ['Factory Profile', 'Notifications', 'Account', 'Audit Settings']

export default function Settings() {
  const { user, logout }      = useAuth()
  const { toast }             = useToast()
  const [section, setSection] = useState('Factory Profile')

  const [profile, setProfile] = useState({
    name: 'Khaled Textiles Ltd.', address: 'Plot 24, BSCIC, Gazipur, Dhaka 1700',
    phone: '+880 1711 234567', email: 'khaled@khaledtextiles.com',
    contact: 'Khaled Rahman', buyers: 'H&M, Zara',
    factoryCode: 'KTL-2025-BD', workerCount: '342',
  })

  const [notifs, setNotifs] = useState({
    certExpiry30: true, certExpiry60: true, certExpiry90: false,
    wageViolation: true, incidentAlert: true, weeklyReport: false,
    whatsapp: true, email: true,
  })

  const [auditSettings, setAuditSettings] = useState({
    defaultAuditType: 'bsci', nextAuditDate: '2025-05-15',
    auditor: 'Bureau Veritas', internalReview: '2025-04-30',
  })

  const save = () => toast(`${section} saved`, 'green')

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Settings</div>
        <div className="page-subtitle">FACTORY CONFIGURATION · PREFERENCES</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Nav */}
        <div className="card" style={{ height: 'fit-content', overflow: 'visible' }}>
          <div style={{ padding: '8px 4px' }}>
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setSection(s)} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, background: section === s ? 'var(--green-muted)' : 'transparent', color: section === s ? 'var(--green)' : 'var(--text2)', border: `1px solid ${section === s ? 'rgba(74,222,128,0.2)' : 'transparent'}`, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'IBM Plex Sans' }}>{s}</button>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8 }}>
              <button onClick={() => { logout(); window.location.href = '/login' }} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, background: 'transparent', color: 'var(--red)', border: '1px solid transparent', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans' }}>Sign Out</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          <div className="card-header"><span className="card-title">{section}</span></div>

          {section === 'Factory Profile' && (
            <div style={{ padding: 20 }}>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group"><label className="form-label">Factory Name</label><input className="form-input" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">BGMEA / Factory Code</label><input className="form-input" value={profile.factoryCode} onChange={e => setProfile(p => ({...p, factoryCode: e.target.value}))} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}><label className="form-label">Address</label><input className="form-input" value={profile.address} onChange={e => setProfile(p => ({...p, address: e.target.value}))} /></div>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" value={profile.contact} onChange={e => setProfile(p => ({...p, contact: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Phone / WhatsApp</label><input className="form-input" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} /></div>
              </div>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Total Workers</label><input className="form-input" type="number" value={profile.workerCount} onChange={e => setProfile(p => ({...p, workerCount: e.target.value}))} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}><label className="form-label">Buyers (comma-separated)</label><input className="form-input" value={profile.buyers} onChange={e => setProfile(p => ({...p, buyers: e.target.value}))} /></div>
              <button className="btn btn-primary" onClick={save}>Save Profile</button>
            </div>
          )}

          {section === 'Notifications' && (
            <div style={{ padding: 20 }}>
              <SectionLabel>Certification Expiry Alerts</SectionLabel>
              {[['certExpiry30','Alert 30 days before cert expires'],['certExpiry60','Alert 60 days before cert expires'],['certExpiry90','Alert 90 days before cert expires']].map(([k,l]) => (
                <ToggleRow key={k} label={l} checked={notifs[k]} onChange={v => setNotifs(p => ({...p, [k]: v}))} />
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 18 }}>
                <SectionLabel>Compliance Alerts</SectionLabel>
                {[['wageViolation','Notify when worker wage is below minimum wage'],['incidentAlert','Notify when a new incident is logged'],['weeklyReport','Weekly compliance summary report']].map(([k,l]) => (
                  <ToggleRow key={k} label={l} checked={notifs[k]} onChange={v => setNotifs(p => ({...p, [k]: v}))} />
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 18, marginBottom: 20 }}>
                <SectionLabel>Delivery Channels</SectionLabel>
                {[['whatsapp','WhatsApp notifications (recommended for BD)'],['email','Email notifications']].map(([k,l]) => (
                  <ToggleRow key={k} label={l} checked={notifs[k]} onChange={v => setNotifs(p => ({...p, [k]: v}))} />
                ))}
              </div>
              <button className="btn btn-primary" onClick={save}>Save Notifications</button>
            </div>
          )}

          {section === 'Account' && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 20, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--green-muted)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: 'var(--green)', fontFamily: 'Space Grotesk', flexShrink: 0 }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'Space Grotesk' }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
                  <div style={{ marginTop: 5 }}>
                    <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', padding: '2px 8px', borderRadius: 4, background: user?.role === 'admin' ? 'var(--amber-muted)' : 'var(--blue-muted)', color: user?.role === 'admin' ? 'var(--amber)' : 'var(--blue)' }}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group"><label className="form-label">Display Name</label><input className="form-input" defaultValue={user?.name} /></div>
                <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" defaultValue={user?.email} type="email" /></div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginBottom: 18 }}>
                <SectionLabel>Change Password</SectionLabel>
                <div className="form-group" style={{ marginBottom: 10 }}><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                  <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={save}>Save Changes</button>
                <button className="btn btn-ghost" style={{ color: 'var(--red)' }} onClick={() => { logout(); window.location.href = '/login' }}>Sign Out</button>
              </div>
            </div>
          )}

          {section === 'Audit Settings' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
                Configure your default audit type and upcoming audit schedule. Dates trigger preparation reminders.
              </div>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group">
                  <label className="form-label">Default Audit Standard</label>
                  <select className="form-input" value={auditSettings.defaultAuditType} onChange={e => setAuditSettings(p => ({...p, defaultAuditType: e.target.value}))}>
                    <option value="bsci">BSCI (amfori)</option>
                    <option value="wrap">WRAP</option>
                    <option value="smeta">SMETA / Sedex</option>
                    <option value="gots">GOTS</option>
                    <option value="rsc">RSC Bangladesh</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Audit Body / Inspector</label><input className="form-input" value={auditSettings.auditor} onChange={e => setAuditSettings(p => ({...p, auditor: e.target.value}))} placeholder="Bureau Veritas, SGS..." /></div>
              </div>
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group"><label className="form-label">Next External Audit Date</label><input className="form-input" type="date" value={auditSettings.nextAuditDate} onChange={e => setAuditSettings(p => ({...p, nextAuditDate: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Internal Review Deadline</label><input className="form-input" type="date" value={auditSettings.internalReview} onChange={e => setAuditSettings(p => ({...p, internalReview: e.target.value}))} /></div>
              </div>
              <button className="btn btn-primary" onClick={save}>Save Audit Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>{children}</div>
)

function ToggleRow({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
      <button onClick={() => onChange(!checked)} style={{ width: 36, height: 20, borderRadius: 10, position: 'relative', cursor: 'pointer', border: 'none', background: checked ? 'var(--green)' : 'var(--bg4)', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
      </button>
    </div>
  )
}
