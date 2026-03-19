import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const V = { bg: '#0d1117', border: 'rgba(139,92,246,0.18)', purple: '#8b5cf6', purpleMuted: 'rgba(139,92,246,0.12)', purpleBright: '#a78bfa', text: '#e2e8f0', text2: '#9ca3af', text3: '#6b7280', text4: '#4b5563' }

export default function AdminLayout() {
  const navigate = useNavigate()
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <aside style={{ width:220, background:V.bg, borderRight:`1px solid ${V.border}`, display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>
        <div style={{ padding:'20px 20px 16px', borderBottom:`1px solid ${V.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, background:V.purple, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M8 1L15 4.5v7L8 15 1 11.5v-7L8 1z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 1v14M1 4.5l7 3.5 7-3.5" stroke="#fff" strokeWidth="1.2"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:14, fontWeight:700, color:V.text, letterSpacing:'-0.3px' }}>ComplyRMG</div>
              <div style={{ fontSize:10, color:V.text4, fontFamily:'IBM Plex Mono,monospace', textTransform:'uppercase', letterSpacing:'0.08em' }}>Admin Portal</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
          {[
            { to:'/admin', label:'Overview',    icon:'📊', end:true },
            { to:'/admin/factories', label:'Factories', icon:'🏭' },
            { to:'/admin/onboard',   label:'Onboard New', icon:'➕' },
            { to:'/admin/revenue',   label:'Revenue',  icon:'৳' },
            { to:'/admin/alerts',    label:'Alerts',   icon:'🔔', badge:4 },
          ].map(({ to, label, icon, end, badge }) => (
            <NavLink key={to} to={to} end={!!end} style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:9, padding:'7px 10px', borderRadius:6, cursor:'pointer', fontSize:13, textDecoration:'none', border:`1px solid ${isActive ? 'rgba(139,92,246,0.25)' : 'transparent'}`, marginBottom:2, background: isActive ? V.purpleMuted : 'transparent', color: isActive ? V.purpleBright : V.text2 })}>
              <span>{icon}</span><span style={{ flex:1 }}>{label}</span>
              {badge && <span style={{ fontSize:10, fontFamily:'IBM Plex Mono,monospace', padding:'1px 6px', borderRadius:20, background:'rgba(248,113,113,0.15)', color:'#f87171', border:'1px solid rgba(248,113,113,0.2)' }}>{badge}</span>}
            </NavLink>
          ))}
          <div style={{ fontSize:10, fontFamily:'IBM Plex Mono,monospace', color:V.text4, textTransform:'uppercase', letterSpacing:'0.08em', padding:'0 8px', margin:'14px 0 6px' }}>Navigation</div>
          <button onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 10px', borderRadius:6, cursor:'pointer', fontSize:13, background:'transparent', border:'none', color:V.text3, width:'100%', textAlign:'left' }}>
            ← Factory App
          </button>
        </nav>
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${V.border}` }}>
          <div style={{ background:V.purpleMuted, border:`1px solid rgba(139,92,246,0.2)`, borderRadius:8, padding:'10px 12px' }}>
            <div style={{ fontSize:10, color:V.text4, fontFamily:'IBM Plex Mono,monospace', textTransform:'uppercase' }}>Logged in as</div>
            <div style={{ fontSize:12, fontWeight:600, color:V.purpleBright, marginTop:2 }}>Super Admin</div>
            <div style={{ fontSize:11, color:V.text4, fontFamily:'IBM Plex Mono,monospace' }}>Jayantasaha01</div>
          </div>
        </div>
      </aside>
      <main style={{ marginLeft:220, flex:1 }}>
        <header style={{ height:52, borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', background:V.bg, position:'sticky', top:0, zIndex:50 }}>
          <span style={{ fontSize:11, fontFamily:'IBM Plex Mono,monospace', color:V.text4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Admin Portal · ComplyRMG</span>
          <span style={{ fontSize:11, color:V.text4, fontFamily:'IBM Plex Mono,monospace' }}>{new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</span>
        </header>
        <div style={{ padding:24 }}><Outlet /></div>
      </main>
    </div>
  )
}
