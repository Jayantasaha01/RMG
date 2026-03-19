import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import { PLANS } from '../data/adminSeedData'

const STEPS = ['Factory Details', 'Plan & Billing', 'Review & Launch']

export default function OnboardFactory() {
  const { dispatch } = useAdmin()
  const { toast }    = useToast()
  const navigate     = useNavigate()

  const [step, setStep]       = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const [form, setForm] = useState({
    name: '', contact: '', email: '', phone: '', address: '',
    plan: 'starter', trialDays: '60', notes: '',
  })

  const f = (k) => ({ value: form[k], onChange: (e) => setForm(p => ({ ...p, [k]: e.target.value })) })

  function validateStep0() {
    if (!form.name.trim())    { toast('Factory name is required', 'amber');    return false }
    if (!form.contact.trim()) { toast('Contact person is required', 'amber'); return false }
    if (!form.email.trim())   { toast('Email is required', 'amber');           return false }
    return true
  }

  function next() {
    if (step === 0 && !validateStep0()) return
    setStep(s => s + 1)
  }

  function submit() {
    const newFactory = {
      id:              `f${Date.now()}`,
      name:            form.name.trim(),
      contact:         form.contact.trim(),
      email:           form.email.trim(),
      phone:           form.phone.trim(),
      address:         form.address.trim(),
      plan:            form.plan,
      status:          form.trialDays ? 'trial' : 'active',
      workers:         0,
      joinedDate:      new Date().toISOString().split('T')[0],
      lastActive:      new Date().toISOString().split('T')[0],
      bsciScore:       0,
      certsUploaded:   0,
      incidentsOpen:   0,
      wageViolations:  0,
      monthlyRevenue:  form.trialDays ? 0 : PLANS[form.plan].price,
      notes:           form.notes.trim(),
    }
    dispatch({ type: 'ADD_FACTORY', payload: newFactory })
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setInviteLink(`https://rmg-five.vercel.app/login?factory=${newFactory.id}&invite=${slug}`)
    setSubmitted(true)
    toast(`${form.name} onboarded successfully!`, 'green')
  }

  const Label = ({ children }) => (
    <label style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
      {children}
    </label>
  )

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
        {form.name} is onboarded!
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, lineHeight: 1.6 }}>
        The factory has been added to your admin dashboard.
        {form.trialDays && ` They start a ${form.trialDays}-day free trial on the ${PLANS[form.plan].label} plan.`}
      </div>

      <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">🔗 Invite Link</span></div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>
            Send this link to the factory's compliance officer to get them started:
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--green)', wordBreak: 'break-all' }}>
            {inviteLink}
          </div>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 10, fontSize: 11 }}
            onClick={() => { navigator.clipboard?.writeText(inviteLink); toast('Link copied!', 'green') }}
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate('/admin/factories')}>
          View All Factories
        </button>
        <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setStep(0); setForm({ name:'',contact:'',email:'',phone:'',address:'',plan:'starter',trialDays:'60',notes:'' }) }}>
          Onboard Another
        </button>
      </div>
    </div>
  )

  // ── Stepper ───────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Onboard New Factory</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, fontFamily: 'IBM Plex Mono, monospace' }}>FACTORY ONBOARDING WIZARD</div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', background: i <= step ? 'var(--green)' : 'var(--bg4)', color: i <= step ? '#0a0e0a' : 'var(--text3)', transition: 'all 0.2s' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: i === step ? 'var(--text)' : 'var(--text3)', fontWeight: i === step ? 500 : 400 }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? 'var(--green)' : 'var(--border)', margin: '0 12px', transition: 'all 0.2s' }} />}
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ padding: 20 }}>

          {/* Step 0: Factory details */}
          {step === 0 && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Factory Information</div>
              <div className="form-group">
                <Label>Factory Name *</Label>
                <input className="form-input" placeholder="e.g. Khaled Textiles Ltd." {...f('name')} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <Label>Contact Person *</Label>
                  <input className="form-input" placeholder="Mohammad Khaled" {...f('contact')} />
                </div>
                <div className="form-group">
                  <Label>Email Address *</Label>
                  <input className="form-input" type="email" placeholder="contact@factory.com" {...f('email')} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <Label>Phone Number</Label>
                  <input className="form-input" placeholder="+880 1XXX-XXXXXX" {...f('phone')} />
                </div>
                <div className="form-group">
                  <Label>Factory Address</Label>
                  <input className="form-input" placeholder="Gazipur Sadar, Dhaka" {...f('address')} />
                </div>
              </div>
              <div className="form-group">
                <Label>Admin Notes</Label>
                <textarea className="form-input" rows={2} placeholder="e.g. Exports to H&M. Needs help with BSCI." {...f('notes')} style={{ resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* Step 1: Plan */}
          {step === 1 && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Subscription Plan</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>Choose the plan for <strong style={{ color: 'var(--text)' }}>{form.name}</strong></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div key={key} onClick={() => setForm(p => ({ ...p, plan: key }))} style={{ padding: '14px 16px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${form.plan === key ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`, background: form.plan === key ? 'var(--green-muted)' : 'var(--bg3)', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.plan === key ? 'var(--green)' : 'var(--text)', marginBottom: 4 }}>{plan.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {plan.maxWorkers ? `Up to ${plan.maxWorkers} workers` : 'Unlimited workers'} · BSCI, WRAP, all checklists
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', color: form.plan === key ? 'var(--green)' : 'var(--text)' }}>৳{plan.price.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>/month</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <Label>Free Trial Days (0 = no trial)</Label>
                <select className="form-input" {...f('trialDays')}>
                  <option value="0">No trial — start billing immediately</option>
                  <option value="30">30 days free trial</option>
                  <option value="60">60 days free trial</option>
                  <option value="90">90 days free trial</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Review & Launch</div>
              {[
                { label: 'Factory Name', val: form.name },
                { label: 'Contact', val: `${form.contact} · ${form.email}` },
                { label: 'Address', val: form.address || '—' },
                { label: 'Plan', val: `${PLANS[form.plan].label} · ৳${PLANS[form.plan].price.toLocaleString()}/mo` },
                { label: 'Trial', val: form.trialDays === '0' ? 'No trial — billing starts immediately' : `${form.trialDays}-day free trial` },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', width: 120, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              {form.notes && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 6, fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  📝 {form.notes}
                </div>
              )}
              <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--green-muted)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 6, fontSize: 12, color: 'var(--green)' }}>
                ✓ An invite link will be generated after onboarding so the factory can log in and start.
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={() => step === 0 ? navigate('/admin/factories') : setStep(s => s - 1)}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < 2
            ? <button className="btn btn-primary" onClick={next}>Next →</button>
            : <button className="btn btn-primary" onClick={submit}>🚀 Launch Factory</button>
          }
        </div>
      </div>
    </div>
  )
}
