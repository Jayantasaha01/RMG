import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import { PLANS } from '../data/adminSeedData'

const statusColor = (s) => s==='active' ? 'var(--green)' : s==='trial' ? 'var(--amber)' : 'var(--red)'
const statusBg    = (s) => s==='active' ? 'var(--green-muted)' : s==='trial' ? 'var(--amber-muted)' : 'var(--red-muted)'

export default function FactoriesList() {
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()
  const navigate            = useNavigate()

  const [search, setSearch]     = useState('')
  const [planFlt, setPlanFlt]   = useState('')
  const [statusFlt, setStatusFlt] = useState('')

  const filtered = state.factories.filter(f => {
    const q = search.toLowerCase()
    if (q && !f.name.toLowerCase().includes(q) && !f.contact.toLowerCase().includes(q) && !f.email.toLowerCase().includes(q)) return false
    if (planFlt   && f.plan   !== planFlt)   return false
    if (statusFlt && f.status !== statusFlt) return false
    return true
  })

  function quickStatus(factoryId, status) {
    dispatch({ type: 'CHANGE_STATUS', payload: { factoryId, status } })
    toast(`Status updated to ${status}`, 'green')
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Factories</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.factories.length} FACTORIES · {state.factories.filter(f=>f.status==='active').length} ACTIVE
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/onboard')}>
          + Onboard New Factory
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label:'Active',    val: state.factories.filter(f=>f.status==='active').length,    color:'var(--green)' },
          { label:'On Trial',  val: state.factories.filter(f=>f.status==='trial').length,     color:'var(--amber)' },
          { label:'Suspended', val: state.factories.filter(f=>f.status==='suspended').length, color:'var(--red)' },
          { label:'Total MRR', val:`৳${(state.factories.reduce((s,f)=>s+f.monthlyRevenue,0)/1000).toFixed(1)}K`, color:'var(--green)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:10, fontFamily:'IBM Plex Mono,monospace', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:600, fontFamily:'IBM Plex Mono,monospace', color, marginTop:4 }}>{val}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <input className="search-input flex-1" placeholder="Search by name, contact or email…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="search-input" style={{maxWidth:160}} value={planFlt} onChange={e=>setPlanFlt(e.target.value)}>
            <option value="">All Plans</option>
            {Object.entries(PLANS).map(([k,p])=><option key={k} value={k}>{p.label}</option>)}
          </select>
          <select className="search-input" style={{maxWidth:160}} value={statusFlt} onChange={e=>setStatusFlt(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Factory Name','Contact','Plan','Workers','BSCI','MRR','Last Active','Status','Actions'].map(h=><th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} style={{cursor:'pointer'}} onClick={()=>navigate(`/admin/factories/${f.id}`)}>
                  <td>
                    <div style={{fontWeight:500,color:'var(--text)',fontSize:12}}>{f.name}</div>
                    <div style={{fontSize:10,color:'var(--text3)',fontFamily:'IBM Plex Mono,monospace'}}>{f.address}</div>
                  </td>
                  <td>
                    <div style={{fontSize:12,color:'var(--text2)'}}>{f.contact}</div>
                    <div style={{fontSize:10,color:'var(--text3)'}}>{f.email}</div>
                  </td>
                  <td>
                    <span className="badge neutral" style={{textTransform:'capitalize'}}>{PLANS[f.plan]?.label}</span>
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',color:'var(--text2)'}}>{f.workers}</td>
                  <td>
                    <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:f.bsciScore>=75?'var(--green)':f.bsciScore>=60?'var(--amber)':'var(--red)'}}>
                      {f.bsciScore}%
                    </span>
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',color:'var(--text2)'}}>
                    {f.monthlyRevenue > 0 ? `৳${f.monthlyRevenue.toLocaleString()}` : <span style={{color:'var(--text3)'}}>—</span>}
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--text3)'}}>{f.lastActive}</td>
                  <td>
                    <span style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',padding:'2px 7px',borderRadius:4,fontWeight:500,background:statusBg(f.status),color:statusColor(f.status),border:`1px solid ${statusColor(f.status)}40`}}>
                      {f.status}
                    </span>
                  </td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{display:'flex',gap:4}}>
                      {f.status !== 'active' &&
                        <button className="btn btn-ghost" style={{padding:'2px 8px',fontSize:10}} onClick={()=>quickStatus(f.id,'active')}>Activate</button>
                      }
                      {f.status !== 'suspended' &&
                        <button className="btn btn-danger" style={{padding:'2px 8px',fontSize:10}} onClick={()=>quickStatus(f.id,'suspended')}>Suspend</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
