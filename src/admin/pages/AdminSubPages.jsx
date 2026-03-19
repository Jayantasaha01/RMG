// ── Trial Pipeline ─────────────────────────────────────────────────────
import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import FactoryPanel from '../components/FactoryPanel'

export function TrialPipeline() {
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()
  const [selected, setSelected] = useState(null)

  const trials  = state.factories.filter(f => f.status === 'trial')
  const pending = state.factories.filter(f => f.status === 'pending')

  function daysLeft(dateStr) {
    return Math.max(0, Math.round((new Date(dateStr) - new Date()) / 86400000))
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Trial Pipeline</div>
        <div className="page-subtitle">{trials.length} TRIALS · {pending.length} PENDING ACTIVATION</div>
      </div>

      {/* Trials */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Active Trials ({trials.length})
        </div>
        <div className="card">
          {trials.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>No active trials</div>
          ) : trials.map((f, i) => {
            const days = f.trialEnd ? daysLeft(f.trialEnd) : 60
            const urgency = days <= 7 ? 'red' : days <= 14 ? 'amber' : 'green'
            const steps = Object.values(f.onboarding)
            const done  = steps.filter(Boolean).length
            return (
              <div
                key={f.id}
                onClick={() => setSelected(f)}
                style={{ padding: '14px 18px', borderBottom: i < trials.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{f.contact} · {f.email}</div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: 'var(--bg4)', borderRadius: 2, maxWidth: 120 }}>
                      <div style={{ width: `${(done / steps.length) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{done}/{steps.length} onboarded</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: `var(--${urgency})` }}>{days}d</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>left in trial</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '4px 12px', fontSize: 11 }}
                    onClick={e => { e.stopPropagation(); dispatch({ type: 'UPGRADE_PLAN', payload: { factoryId: f.id, plan: 'professional' } }); toast(`${f.name} converted to Professional`, 'green') }}
                  >
                    Convert
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px 12px', fontSize: 11 }}
                    onClick={e => { e.stopPropagation(); toast(`Reminder sent to ${f.contact}`, 'green') }}
                  >
                    Remind
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending */}
      <div>
        <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Never Activated ({pending.length})
        </div>
        <div className="card">
          {pending.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>No pending factories</div>
          ) : pending.map((f, i) => (
            <div
              key={f.id}
              onClick={() => setSelected(f)}
              style={{ padding: '14px 18px', borderBottom: i < pending.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Joined {f.joinedDate} — never logged in</div>
              </div>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px 12px', fontSize: 11 }}
                onClick={e => { e.stopPropagation(); toast(`Activation email resent to ${f.email}`, 'green') }}
              >
                Resend Email
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && <FactoryPanel factory={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ── Onboarding Tracker ─────────────────────────────────────────────────
export function OnboardingTracker() {
  const { state } = useAdmin()
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Onboarding Tracker</div>
        <div className="page-subtitle">FACTORY ACTIVATION PROGRESS</div>
      </div>
      <div className="card">
        {/* Header row */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 2, fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Factory</div>
          {state.onboardingSteps.map(s => (
            <div key={s.id} style={{ flex: 1, fontSize: 9, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', minWidth: 60 }}>
              {s.label.split(' ')[0]}
            </div>
          ))}
          <div style={{ width: 50, fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', textAlign: 'center' }}>Score</div>
        </div>

        {state.factories.map((f, fi) => {
          const done = Object.values(f.onboarding).filter(Boolean).length
          const pct  = Math.round((done / state.onboardingSteps.length) * 100)
          return (
            <div
              key={f.id}
              onClick={() => setSelected(f)}
              style={{ padding: '12px 18px', borderBottom: fi < state.factories.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{f.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{f.location}</div>
              </div>
              {state.onboardingSteps.map(s => (
                <div key={s.id} style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 60 }}>
                  {f.onboarding[s.id]
                    ? <span style={{ color: 'var(--green)', fontSize: 14 }}>✓</span>
                    : <span style={{ color: 'var(--border2)', fontSize: 14 }}>○</span>
                  }
                </div>
              ))}
              <div style={{ width: 50, textAlign: 'center' }}>
                <span style={{ fontSize: 13, fontFamily: 'IBM Plex Mono', fontWeight: 600, color: pct === 100 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {selected && <FactoryPanel factory={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ── Revenue & Billing ──────────────────────────────────────────────────
export function RevenueBilling() {
  const { state } = useAdmin()
  const { factories } = state

  const byPlan = { starter: 0, professional: 0, enterprise: 0 }
  factories.filter(f => f.status === 'active').forEach(f => { byPlan[f.plan] = (byPlan[f.plan] || 0) + 1 })
  const totalMRR = factories.reduce((s, f) => s + (f.mrr || 0), 0)
  const arr      = totalMRR * 12

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">MRR & Billing</div>
        <div className="page-subtitle">REVENUE BREAKDOWN BY PLAN</div>
      </div>

      <div className="kpi-grid">
        {[
          { label: 'Monthly Recurring Revenue', val: `৳${totalMRR.toLocaleString()}`, color: 'var(--green)', sub: 'Current MRR' },
          { label: 'Annual Run Rate', val: `৳${(arr / 1000).toFixed(0)}K`, color: 'var(--text)', sub: 'Projected ARR' },
          { label: 'Paying Customers', val: factories.filter(f => f.mrr > 0).length, color: 'var(--blue)', sub: 'Active subscriptions' },
          { label: 'Avg Revenue / Factory', val: `৳${factories.length ? Math.round(totalMRR / factories.length).toLocaleString() : 0}`, color: 'var(--amber)', sub: 'ARPU' },
        ].map(({ label, val, color, sub }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-val" style={{ color }}>{val}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* By plan */}
        <div className="card">
          <div className="card-header"><span className="card-title">Revenue by Plan</span></div>
          <div style={{ padding: 16 }}>
            {[
              { key: 'enterprise',   label: 'Enterprise',   price: 29999, count: byPlan.enterprise },
              { key: 'professional', label: 'Professional', price: 12999, count: byPlan.professional },
              { key: 'starter',      label: 'Starter',      price: 4999,  count: byPlan.starter },
            ].map(({ key, label, price, count }) => {
              const rev = price * count
              const pct = totalMRR ? Math.round((rev / totalMRR) * 100) : 0
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`plan-badge ${key}`}>{label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{count} factory</span>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>৳{rev.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg4)', borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: key === 'enterprise' ? 'var(--amber)' : key === 'professional' ? 'var(--blue)' : 'var(--text3)', borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Per factory */}
        <div className="card">
          <div className="card-header"><span className="card-title">Per Factory Billing</span></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Factory</th><th>Plan</th><th>MRR</th><th>Status</th></tr></thead>
              <tbody>
                {factories.map(f => (
                  <tr key={f.id}>
                    <td className="td-name" style={{ fontSize: 11 }}>{f.name}</td>
                    <td><span className={`plan-badge ${f.plan}`}>{f.plan}</span></td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: f.mrr > 0 ? 'var(--green)' : 'var(--text3)' }}>
                      {f.mrr > 0 ? `৳${f.mrr.toLocaleString()}` : 'Trial'}
                    </td>
                    <td><span style={{ display: 'flex', alignItems: 'center' }}><span className={`status-dot ${f.status}`} /><span style={{ fontSize: 10, textTransform: 'capitalize', color: 'var(--text2)' }}>{f.status}</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Plans & Pricing ────────────────────────────────────────────────────
export function PlansAndPricing() {
  const { state } = useAdmin()
  const { plans }  = state

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Plans & Pricing</div>
        <div className="page-subtitle">SUBSCRIPTION TIERS · FEATURE MATRIX</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {Object.values(plans).map((plan, i) => (
          <div key={plan.id} className="card" style={{ border: i === 1 ? '1.5px solid rgba(96,165,250,0.4)' : undefined }}>
            <div className="card-header">
              <span className={`plan-badge ${plan.id}`} style={{ fontSize: 12, padding: '3px 10px' }}>{plan.name}</span>
              {i === 1 && <span style={{ fontSize: 10, color: 'var(--blue)', fontFamily: 'IBM Plex Mono' }}>Most Popular</span>}
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: 'var(--text)', marginBottom: 4 }}>
                {plan.currency}{plan.price.toLocaleString()}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text3)' }}>/{plan.period}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
                {plan.workerLimit ? `Up to ${plan.workerLimit} workers` : 'Unlimited workers'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)' }}>
                {state.factories.filter(f => f.plan === plan.id && f.status === 'active').length} active factory
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
