import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'

export default function Alerts() {
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()
  const navigate            = useNavigate()

  const suspended   = state.factories.filter(f => f.status === 'suspended')
  const violations  = state.factories.filter(f => f.wageViolations > 0)
  const openIncidents = state.factories.filter(f => f.incidentsOpen > 0)
  const lowBsci     = state.factories.filter(f => f.bsciScore < 60 && f.status !== 'suspended')

  const AlertRow = ({ icon, title, desc, factoryName, factoryId, action, actionLabel, color }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
      <div style={{ width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:`var(--${color}-muted)`, fontSize:16, flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, fontWeight:500, color:'var(--text)', marginBottom:2 }}>{title}</div>
        <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'IBM Plex Mono,monospace', marginBottom:2 }}>{factoryName}</div>
        <div style={{ fontSize:11, color:'var(--text2)' }}>{desc}</div>
      </div>
      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
        <button className="btn btn-ghost" style={{ padding:'3px 10px', fontSize:11 }} onClick={() => navigate(`/admin/factories/${factoryId}`)}>
          View
        </button>
        {action && (
          <button className="btn btn-primary" style={{ padding:'3px 10px', fontSize:11 }} onClick={action}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:20, fontWeight:600, color:'var(--text)' }}>Alerts</div>
        <div style={{ fontSize:12, color:'var(--text3)', marginTop:3, fontFamily:'IBM Plex Mono,monospace' }}>
          {suspended.length + violations.length + openIncidents.length + lowBsci.length} ISSUES NEED ATTENTION
        </div>
      </div>

      {/* Suspended factories */}
      {suspended.length > 0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <span className="card-title">🔴 Suspended Factories ({suspended.length})</span>
          </div>
          {suspended.map(f => (
            <AlertRow
              key={f.id}
              icon="🔴" color="red"
              title="Factory suspended — follow up required"
              factoryName={f.name}
              factoryId={f.id}
              desc={`Last active: ${f.lastActive} · ${f.notes || 'No notes'}`}
              action={() => { dispatch({type:'CHANGE_STATUS',payload:{factoryId:f.id,status:'active'}}); toast(`${f.name} reactivated`,'green') }}
              actionLabel="Reactivate"
            />
          ))}
        </div>
      )}

      {/* Wage violations */}
      {violations.length > 0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <span className="card-title">💸 Wage Violations ({violations.length})</span>
          </div>
          {violations.map(f => (
            <AlertRow
              key={f.id}
              icon="💸" color="amber"
              title={`${f.wageViolations} worker${f.wageViolations>1?'s':''} below minimum wage`}
              factoryName={f.name}
              factoryId={f.id}
              desc={`Grade 7 minimum is ৳12,500/month. BSCI audit will flag this.`}
            />
          ))}
        </div>
      )}

      {/* Open incidents */}
      {openIncidents.length > 0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <span className="card-title">⚠️ Open Incidents ({openIncidents.length})</span>
          </div>
          {openIncidents.map(f => (
            <AlertRow
              key={f.id}
              icon="⚠️" color="amber"
              title={`${f.incidentsOpen} unresolved incident${f.incidentsOpen>1?'s':''}`}
              factoryName={f.name}
              factoryId={f.id}
              desc="Unresolved incidents must be closed before BSCI or WRAP audits."
            />
          ))}
        </div>
      )}

      {/* Low BSCI score */}
      {lowBsci.length > 0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <span className="card-title">📉 Low BSCI Score ({lowBsci.length})</span>
          </div>
          {lowBsci.map(f => (
            <AlertRow
              key={f.id}
              icon="📉" color="red"
              title={`BSCI score is critically low: ${f.bsciScore}%`}
              factoryName={f.name}
              factoryId={f.id}
              desc="A score below 60% means the factory will fail a BSCI audit. Immediate intervention needed."
            />
          ))}
        </div>
      )}

      {(suspended.length + violations.length + openIncidents.length + lowBsci.length) === 0 && (
        <div style={{ textAlign:'center', padding:60, color:'var(--text3)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:16, fontWeight:500, color:'var(--text2)' }}>No alerts</div>
          <div style={{ fontSize:12, marginTop:4 }}>All factories are in good standing</div>
        </div>
      )}
    </div>
  )
}
