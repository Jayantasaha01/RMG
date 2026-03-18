import { useLocation } from 'react-router-dom'
import { todayLabel } from '../../utils/helpers'

const PAGE_TITLES = {
  '/dashboard':      'Dashboard',
  '/workers':        'Worker Records',
  '/certifications': 'Certifications',
  '/audits':         'Audit Checklists',
  '/wages':          'Wage Register',
  '/incidents':      'Incident Log',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'ComplyRMG'

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="topbar-title">{title}</span>
        <span style={{ color: 'var(--text3)', fontSize: 11, fontFamily: 'IBM Plex Mono' }}>
          · {todayLabel()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', alignSelf: 'center' }}>
          Khaled Textiles Ltd.
        </span>
      </div>
    </header>
  )
}
