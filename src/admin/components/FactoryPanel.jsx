import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import { PLANS } from '../data/adminSeedData'

export default function FactoryPanel({ factory, onClose }) {
  const { dispatch }  = useAdmin()
  const { toast }     = useToast()
  const [tab, setTab] = useState('overview')
  const [notes, setNotes] = useState(factory.notes || '')
  const [editNotes, setEditNotes] = useState(false)

  const steps    = useAdmin().state.onboardingSteps
  const onboarding = factory.onboarding || {}
  const doneCount  = steps.filter(s => onboarding[s.id]).length

  function toggleStep(stepId) {
    dispatch({ type: 'TOGGLE_ONBOARDING_STEP', payload: { factoryId: factory.id, stepId } })
  }

  function saveNotes() {
    dispatch({ type: 'UPDATE_NOTES', payload: { factoryId: factory.id, notes } })
    setEditNotes(false)
    toast('Notes saved', 'green')
  }

  function upgradePlan(plan) {
    dispatch({ type: 'UPGRADE_PLAN', payload: { factoryId: factory.id, plan } })
    toast(`${factory.name} upgraded to ${PLANS[plan].name}`, 'green')
  }

  const statusColor = { active: 'green', trial: 'amber', pending: 'neutral', churned: 'red' }[factory.status] || 'neutral'

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="factory-panel">
        {/* Header */}
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk', color: 'var(--text)' }}>
                {factory.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
                {factory.location} · {factory.workerCount} workers
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span className={`badge ${statusColor}`} style={{ textTransform: 'capitalize' }}>{factory.status}</span>
                <span className={`plan-badge ${factory.plan}`}>{factory.plan}</span>
                {factory.trialEnd && (
                  <span style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'IBM Plex Mono' }}>
                    Trial ends {factory.trialEnd}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>

          {/* Tabs */}
          <div className="admin-tabs" style={{ marginBottom: 0, marginTop: 14 }}>
            {['overview', 'onboarding', 'billing', 'activity'].map(t => (
              <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <>
            {/* Contact */}
            <div className="panel-section">
              <div className="panel-section-title">Contact</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Contact',     factory.contact],
                  ['Email',       factory.email],
                  ['Phone',       factory.phone],
                  ['Joined',      factory.joinedDate],
                  ['Last Active', factory.lastActive],
                  ['Buyers',      factory.buyers?.join(', ') || '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', wordBreak: 'break-all' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BSCI score */}
            <div className="panel-section">
              <div className="panel-section-title">BSCI Readiness</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${factory.bsciScore}%`, background: factory.bsciScore >= 70 ? 'var(--green)' : factory.bsciScore >= 40 ? 'var(--amber)' : 'var(--red)' }} />
                  </div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: factory.bsciScore >= 70 ? 'var(--green)' : factory.bsciScore >= 40 ? 'var(--amber)' : 'var(--red)' }}>
                  {factory.bsciScore}%
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="panel-section">
              <div className="panel-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Admin Notes</span>
                {!editNotes && (
                  <span style={{ color: 'var(--green)', cursor: 'pointer', fontSize: 11 }} onClick={() => setEditNotes(true)}>Edit</span>
                )}
              </div>
              {editNotes ? (
                <>
                  <textarea
                    className="note-area"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: 11 }} onClick={saveNotes}>Save</button>
                    <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => { setNotes(factory.notes || ''); setEditNotes(false) }}>Cancel</button>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: notes ? 'var(--text2)' : 'var(--text3)', lineHeight: 1.6 }}>
                  {notes || 'No notes yet. Click Edit to add.'}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="panel-section">
              <div className="panel-section-title">Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => toast(`Onboarding email sent to ${factory.email}`, 'green')}>
                  📧 Send Onboarding Email
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => toast(`WhatsApp message sent to ${factory.contact}`, 'green')}>
                  💬 Send WhatsApp Reminder
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => { window.open(`mailto:${factory.email}`) }}>
                  📅 Schedule Walkthrough Call
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--red)', borderColor: 'rgba(248,113,113,0.3)' }} onClick={() => { dispatch({ type: 'UPDATE_FACTORY', payload: { id: factory.id, status: 'churned' } }); toast(`${factory.name} marked as churned`, 'amber'); onClose() }}>
                  Mark as Churned
                </button>
              </div>
            </div>
          </>
        )}

        {/* Onboarding tab */}
        {tab === 'onboarding' && (
          <div className="panel-section">
            <div className="panel-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Onboarding Progress</span>
              <span style={{ color: doneCount === steps.length ? 'var(--green)' : 'var(--amber)', fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
                {doneCount}/{steps.length} complete
              </span>
            </div>

            <div className="prog-bar" style={{ marginBottom: 16 }}>
              <div className="prog-fill" style={{ width: `${(doneCount / steps.length) * 100}%`, background: 'var(--green)' }} />
            </div>

            {steps.map(step => (
              <div key={step.id} className="onboard-step">
                <div
                  className={`onboard-check${onboarding[step.id] ? ' done' : ''}`}
                  onClick={() => toggleStep(step.id)}
                >
                  {onboarding[step.id] && (
                    <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#0a0e0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="onboard-step-body">
                  <div className={`onboard-step-label${onboarding[step.id] ? ' done' : ''}`}>{step.label}</div>
                  <div className="onboard-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Billing tab */}
        {tab === 'billing' && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">Current Plan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className={`plan-badge ${factory.plan}`} style={{ fontSize: 13, padding: '4px 12px' }}>{factory.plan}</span>
                <span style={{ fontSize: 20, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>
                  {factory.mrr > 0 ? `৳${factory.mrr.toLocaleString()}/mo` : 'Free Trial'}
                </span>
              </div>
              {factory.trialEnd && (
                <div style={{ fontSize: 12, color: 'var(--amber)', background: 'var(--amber-muted)', padding: '8px 10px', borderRadius: 6, marginBottom: 12 }}>
                  ⚠ Trial expires {factory.trialEnd} — schedule a convert call
                </div>
              )}
            </div>
            <div className="panel-section">
              <div className="panel-section-title">Change Plan</div>
              {Object.values(PLANS).map(plan => (
                <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`plan-badge ${plan.id}`}>{plan.name}</span>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>৳{plan.price.toLocaleString()}/mo</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                      {plan.workerLimit ? `Up to ${plan.workerLimit} workers` : 'Unlimited workers'}
                    </div>
                  </div>
                  {factory.plan === plan.id ? (
                    <span style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'IBM Plex Mono' }}>Current</span>
                  ) : (
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '4px 12px', fontSize: 11 }}
                      onClick={() => upgradePlan(plan.id)}
                    >
                      Switch
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Activity tab */}
        {tab === 'activity' && (
          <div className="panel-section">
            <div className="panel-section-title">Recent Activity</div>
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="timeline-item">
                {i < MOCK_ACTIVITY.length - 1 && <div className="timeline-line" />}
                <div className="timeline-dot" style={{ background: a.color === 'green' ? 'var(--green)' : a.color === 'amber' ? 'var(--amber)' : 'var(--text3)' }} />
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const MOCK_ACTIVITY = [
  { color: 'green', text: '<strong>Wages logged</strong> — March 2025 register complete', time: '2 hours ago' },
  { color: 'green', text: '<strong>Logged in</strong> — Compliance officer session started', time: 'Today, 9:14 AM' },
  { color: 'amber', text: '<strong>BSCI cert expiring</strong> — 46 days remaining alert triggered', time: 'Yesterday' },
  { color: 'green', text: '<strong>5 workers added</strong> — Sewing department', time: '3 days ago' },
  { color: 'neutral', text: '<strong>Account created</strong> — Onboarding started', time: factory => factory?.joinedDate || '2025-01-15' },
]
