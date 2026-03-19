import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import { PLANS } from '../data/adminSeedData'

const statusColor = (s) => s==='active'?'var(--green)':s==='trial'?'var(--amber)':'var(--red)'
const statusBg    = (s) => s==='active'?'var(--green-muted)':s==='trial'?'var(--amber-muted)':'var(--red-muted)'

export default function FactoryDetail() {
  const { id }              = useParams()
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()
  const navigate            = useNavigate()

  const factory = state.factories.find(f => f.id === id)

  const [notes, setNotes]     = useState(factory?.notes ?? '')
  const [editNotes, setEdit]  = useState(false)

  if (!factory) return (
    <div style={{textAlign:'center',padding:60,color:'var(--text3)'}}>
      <div style={{fontSize:32,marginBottom:12}}>🏭</div>
      <div>Factory not found</div>
      <button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>navigate('/admin/factories')}>← Back</button>
    </div>
  )

  function changePlan(plan) {
    dispatch({ type:'CHANGE_PLAN',   payload:{ factoryId:id, plan } })
    toast(`Plan changed to ${PLANS[plan].label}`, 'green')
  }
  function changeStatus(status) {
    dispatch({ type:'CHANGE_STATUS', payload:{ factoryId:id, status } })
    toast(`Status changed to ${status}`, 'green')
  }
  function saveNotes() {
    dispatch({ type:'UPDATE_FACTORY', payload:{ id, notes } })
    setEdit(false)
    toast('Notes saved', 'green')
  }

  const Section = ({ title, children }) => (
    <div className="card" style={{marginBottom:16}}>
      <div className="card-header"><span className="card-title">{title}</span></div>
      <div style={{padding:'14px 16px'}}>{children}</div>
    </div>
  )

  const Field = ({ label, value, mono }) => (
    <div style={{marginBottom:10}}>
      <div style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>{label}</div>
      <div style={{fontSize:13,color:'var(--text)',fontFamily:mono?'IBM Plex Mono,monospace':undefined}}>{value}</div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
        <div>
          <button onClick={()=>navigate('/admin/factories')} style={{fontSize:11,color:'var(--text3)',fontFamily:'IBM Plex Mono,monospace',background:'none',border:'none',cursor:'pointer',marginBottom:8,padding:0}}>
            ← All Factories
          </button>
          <div style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:600,color:'var(--text)'}}>{factory.name}</div>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:6}}>
            <span style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',padding:'2px 8px',borderRadius:4,fontWeight:500,background:statusBg(factory.status),color:statusColor(factory.status),border:`1px solid ${statusColor(factory.status)}40`}}>
              {factory.status.toUpperCase()}
            </span>
            <span className="badge neutral">{PLANS[factory.plan]?.label}</span>
            <span style={{fontSize:11,color:'var(--text3)',fontFamily:'IBM Plex Mono,monospace'}}>ID: {factory.id}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:8'}}>
          {factory.status !== 'active'    && <button className="btn btn-primary" onClick={()=>changeStatus('active')}>Activate</button>}
          {factory.status !== 'suspended' && <button className="btn btn-danger"  onClick={()=>changeStatus('suspended')}>Suspend</button>}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Left column */}
        <div>
          {/* Compliance snapshot */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-header"><span className="card-title">Compliance Snapshot</span></div>
            <div style={{padding:'14px 16px'}}>
              {[
                {label:'BSCI Score',       val:`${factory.bsciScore}%`,     color:factory.bsciScore>=75?'var(--green)':factory.bsciScore>=60?'var(--amber)':'var(--red)'},
                {label:'Certs Uploaded',   val:factory.certsUploaded,       color:'var(--blue)'},
                {label:'Open Incidents',   val:factory.incidentsOpen,       color:factory.incidentsOpen>0?'var(--amber)':'var(--green)'},
                {label:'Wage Violations',  val:factory.wageViolations,      color:factory.wageViolations>0?'var(--red)':'var(--green)'},
              ].map(({label,val,color})=>(
                <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:12,color:'var(--text2)'}}>{label}</span>
                  <span style={{fontSize:14,fontWeight:600,fontFamily:'IBM Plex Mono,monospace',color}}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <Section title="Contact Information">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="Contact Person" value={factory.contact} />
              <Field label="Workers"        value={factory.workers} mono />
              <Field label="Email"          value={factory.email} />
              <Field label="Phone"          value={factory.phone} mono />
            </div>
            <Field label="Address" value={factory.address} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:4}}>
              <Field label="Joined"      value={factory.joinedDate} mono />
              <Field label="Last Active" value={factory.lastActive} mono />
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div>
          {/* Plan management */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-header"><span className="card-title">Subscription Plan</span></div>
            <div style={{padding:'14px 16px'}}>
              <div style={{fontSize:12,color:'var(--text3)',marginBottom:10}}>Current plan: <strong style={{color:'var(--text)'}}>{PLANS[factory.plan]?.label}</strong></div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {Object.entries(PLANS).map(([key,plan])=>(
                  <div key={key} onClick={()=>changePlan(key)} style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'10px 12px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                    border:`1px solid ${factory.plan===key?'rgba(74,222,128,0.35)':'var(--border)'}`,
                    background:factory.plan===key?'var(--green-muted)':'var(--bg3)',
                  }}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:factory.plan===key?'var(--green)':'var(--text)'}}>{plan.label}</div>
                      <div style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)',marginTop:2}}>
                        ৳{plan.price.toLocaleString()}/mo · {plan.maxWorkers ? `up to ${plan.maxWorkers} workers` : 'unlimited'}
                      </div>
                    </div>
                    {factory.plan===key && <span style={{fontSize:12}}>✓</span>}
                  </div>
                ))}
              </div>
              {factory.monthlyRevenue > 0 && (
                <div style={{marginTop:12,padding:'8px 12px',background:'var(--green-muted)',borderRadius:6,fontSize:11,fontFamily:'IBM Plex Mono,monospace',color:'var(--green)'}}>
                  MRR contribution: ৳{factory.monthlyRevenue.toLocaleString()}/mo
                </div>
              )}
            </div>
          </div>

          {/* Admin notes */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Admin Notes</span>
              {!editNotes
                ? <span className="card-action" onClick={()=>setEdit(true)}>Edit</span>
                : <span className="card-action" onClick={saveNotes}>Save</span>
              }
            </div>
            <div style={{padding:'14px 16px'}}>
              {editNotes
                ? <textarea
                    value={notes}
                    onChange={e=>setNotes(e.target.value)}
                    className="form-input"
                    rows={5}
                    style={{resize:'vertical',width:'100%'}}
                    autoFocus
                  />
                : <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.6,minHeight:80,whiteSpace:'pre-wrap'}}>
                    {factory.notes || <span style={{color:'var(--text3)'}}>No notes yet. Click Edit to add.</span>}
                  </div>
              }
              {editNotes && (
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  <button className="btn btn-primary" style={{fontSize:11}} onClick={saveNotes}>Save Notes</button>
                  <button className="btn btn-ghost" style={{fontSize:11}} onClick={()=>{setNotes(factory.notes);setEdit(false)}}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
