import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import LoginModal from '../auth/LoginModal'

// ── Shared styles for landing (overrides dark app styles) ────────────
const S = {
  green:        '#3b82f6',
  greenDark:    '#1d4ed8',
  greenMuted:   'rgba(59,130,246,0.12)',
  blue:         '#7c3aed',
  blueMuted:    'rgba(124,58,237,0.12)',
  dark:         '#0b0f2e',
  bg2:          '#13184a',
  bg3:          '#1a2060',
  border:       'rgba(99,102,241,0.22)',
  text:         '#ffffff',
  text2:        '#a5b4fc',
  text3:        '#6366f1',
  amber:        '#f59e0b',
  red:          '#ef4444',
  gradientBg:   'linear-gradient(135deg, #0b0f2e 0%, #13184a 50%, #1a1060 100%)',
  gradientAccent:'linear-gradient(135deg, #3b82f6, #7c3aed)',
  gradientText:  'linear-gradient(135deg, #60a5fa, #a78bfa)',
}

const mono   = "'IBM Plex Mono', monospace"
const sans   = "'IBM Plex Sans', sans-serif"
const display= "'Space Grotesk', sans-serif"

// ── Feature data ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🪪',
    title: 'Worker Records & NID Tracking',
    desc: 'Store NID scans, appointment letters, maternity files, and contracts for every worker. Auditors get instant access to a complete, verified digital file.',
    tags: ['BSCI Required', 'Drag & Drop Upload'],
  },
  {
    icon: '📋',
    title: 'Certification Expiry Tracker',
    desc: 'Never miss a BSCI, WRAP, OEKO-TEX, or Fire Safety renewal. Auto reminders via WhatsApp and email at 60 and 30 days before expiry.',
    tags: ['Auto Reminders', 'WhatsApp Alerts'],
  },
  {
    icon: '✅',
    title: 'BSCI & WRAP Audit Checklists',
    desc: 'Full BSCI and WRAP checklists built in. Mark items complete, attach evidence documents per item, and track readiness % in real time.',
    tags: ['BSCI', 'WRAP', 'Evidence Upload'],
  },
  {
    icon: '💸',
    title: 'Wage Register & Compliance',
    desc: 'Log monthly wages, auto-flag workers below ৳12,500 minimum. Export an audit-ready register PDF with signature blocks for HR, Finance, and Owner.',
    tags: ['Wage Violation Alerts', 'PDF Export'],
  },
  {
    icon: '⚠️',
    title: 'Incident & Accident Log',
    desc: 'BSCI-required accident register with corrective action tracking. Attach photos or investigation PDFs. One-click PDF export for auditors.',
    tags: ['H&S Required', 'Photo Attachments'],
  },
  {
    icon: '📄',
    title: 'Invoice & Billing System',
    desc: 'Admins create and send professional invoices to factories. Email preview before sending, mark paid, and export branded PDF with bKash payment instructions.',
    tags: ['Admin Only', 'PDF Invoices'],
  },
]

const WORKFLOW = [
  { step: '01', title: 'Onboard your factory', desc: 'Your compliance officer gets login access. Walk through a guided setup checklist in under 30 minutes.' },
  { step: '02', title: 'Upload worker records', desc: 'Import workers, upload NID scans and contracts. NID verification status updates automatically on your audit checklist.' },
  { step: '03', title: 'Track certificates & wages', desc: 'Add certs with expiry dates. Log monthly wages. Violations and near-expiry alerts surface automatically.' },
  { step: "04", title: "Run mock audit anytime", desc: "Your BSCI/WRAP readiness score updates live. Export a full audit pack as PDF — ready for any buyer's auditor." },
]

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '৳4,999',
    period: '/mo',
    workers: 'Up to 200 workers',
    features: ['Worker records + NID tracking', 'Certification expiry tracker', 'BSCI + WRAP checklists', 'Wage register + violation alerts', 'PDF export (all documents)', 'Email support'],
    cta: 'Start free trial',
    highlight: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '৳12,999',
    period: '/mo',
    workers: 'Up to 800 workers',
    features: ['Everything in Starter', 'All 6+ audit templates', 'Buyer portal access', 'WhatsApp reminders', 'Incident log + photo attachments', 'Priority support'],
    cta: 'Most popular',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '৳29,999',
    period: '/mo',
    workers: 'Unlimited workers',
    features: ['Everything in Professional', 'Multi-factory dashboard', 'Custom audit templates', 'Dedicated onboarding call', 'API access', 'Account manager'],
    cta: 'Contact sales',
    highlight: false,
  },
]

const STATS = [
  { val: '4,500+', label: 'RMG factories in Bangladesh' },
  { val: '$46B',   label: 'Annual garment exports' },
  { val: '4M+',    label: 'Workers protected' },
  { val: '10+',    label: 'Audit standards supported' },
]

const TESTIMONIALS = [
  {
    name: 'Khaled Rahman',
    role: 'Owner, Khaled Textiles Ltd.',
    location: 'Gazipur, Dhaka',
    text: 'Before ComplyRMG we spent 3 weeks scrambling before every BSCI audit. Now our readiness score is 91% and we are always prepared. H&M auditors were impressed.',
    score: 91,
  },
  {
    name: 'Rupa Chowdhury',
    role: 'Compliance Officer, Shilpa Sweaters',
    location: 'Mirpur, Dhaka',
    text: 'The WhatsApp reminders for certificate expiry have saved us from losing two buyer orders. The wage violation alerts caught a payroll error before it became an audit finding.',
    score: 78,
  },
]

// ── Main component ────────────────────────────────────────────────────
export default function Landing() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  // Interest form state
  const [interest, setInterest] = useState({ name: '', factory: '', email: '', phone: '', workers: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  // Navbar scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // If already logged in, redirect
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }, [user, navigate])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  function handleInterest(e) {
    e.preventDefault()
    // In production: POST to /api/interest or use a form service (Formspree, etc.)
    console.log('Interest form submitted:', interest)
    setSubmitted(true)
  }

  const ifield = k => ({
    value: interest[k],
    onChange: e => setInterest(p => ({ ...p, [k]: e.target.value })),
  })

  return (
    <div style={{ background: S.gradientBg, color: S.text, fontFamily: sans, minHeight: '100vh' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(10,14,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${S.border}` : '1px solid transparent',
        transition: 'all 0.3s',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: 30, height: 30, background: S.gradientAccent, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <rect x="2" y="6" width="5" height="8" rx="1" fill="white"/>
              <rect x="9" y="3" width="5" height="11" rx="1" fill="white"/>
              <path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: S.text, letterSpacing: '-0.3px' }}>ComplyRMG</span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="nav-desktop">
          {[['Features', 'features'], ['How it works', 'workflow'], ['Pricing', 'pricing'], ['Contact', 'contact']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: S.text2, fontSize: 13, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, transition: 'color 0.15s', fontFamily: sans }}>
              {label}
            </button>
          ))}
        </div>

        {/* CTA + login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setLoginOpen(true)}
            style={{ background: 'none', border: `1px solid ${S.border}`, color: S.text2, fontSize: 13, cursor: 'pointer', padding: '7px 16px', borderRadius: 7, transition: 'all 0.15s', fontFamily: sans }}
            onMouseEnter={e => { e.target.style.borderColor = S.green; e.target.style.color = S.text }}
            onMouseLeave={e => { e.target.style.borderColor = S.border; e.target.style.color = S.text2 }}
          >
            Sign in
          </button>
          <button
            onClick={() => scrollTo('contact')}
            style={{ background: S.green, border: 'none', color: S.dark, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 18px', borderRadius: 7, fontFamily: display, letterSpacing: '-0.1px' }}
          >
            Get started →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(124,58,237,0.12) 0%, transparent 50%), linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)`, backgroundSize: '100% 100%, 40px 40px, 40px 40px', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.greenMuted, border: `1px solid rgba(59,130,246,0.3)`, borderRadius: 20, padding: '5px 14px', marginBottom: 28, fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.06em' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.green, animation: 'pulse 2s infinite', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }} />
          NOW AVAILABLE · DHAKA, BANGLADESH
        </div>

        <h1 style={{ fontFamily: display, fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: 820, margin: '0 auto 24px', color: S.text }}>
          BSCI & WRAP Compliance<br />
          <span style={{ background: S.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>built for Bangladesh's</span><br />
          garment factories.
        </h1>

        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: S.text2, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
          Manage worker records, track certifications, prepare audit checklists, and flag wage violations — all in one platform designed for RMG compliance officers in Dhaka.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => scrollTo('contact')}
            style={{ background: S.green, color: S.dark, border: 'none', padding: '13px 30px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: display, letterSpacing: '-0.2px' }}
          >
            Start 60-day free trial →
          </button>
          <button
            onClick={() => setLoginOpen(true)}
            style={{ background: 'transparent', color: S.text, border: `1px solid ${S.border}`, padding: '13px 24px', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontFamily: sans }}
          >
            Sign in to your account
          </button>
        </div>

        {/* Hero stats strip */}
        <div style={{ display: 'flex', gap: 40, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          {STATS.map(({ val, label }) => (
            <div key={val} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 600, fontFamily: mono, color: S.green }}>{val}</div>
              <div style={{ fontSize: 12, color: S.text3, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 5%', borderTop: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Everything you need</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.8px', color: S.text, margin: 0 }}>Built for how factories actually work</h2>
            <p style={{ fontSize: 15, color: S.text2, marginTop: 14, maxWidth: 540, margin: '14px auto 0' }}>Every feature maps directly to a BSCI, WRAP, or RSC audit requirement — not generic compliance software forced onto RMG.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: S.bg2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 26px', transition: 'border-color 0.15s, transform 0.15s', cursor: 'default' }}
                onMouseEnter={e => { e.currentColor.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: display, fontSize: 16, fontWeight: 600, color: S.text, marginBottom: 8, letterSpacing: '-0.2px' }}>{f.title}</div>
                <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.65, marginBottom: 14 }}>{f.desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {f.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, fontFamily: mono, padding: '2px 8px', borderRadius: 4, background: S.greenMuted, color: S.green, border: `1px solid rgba(74,222,128,0.2)` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ─────────────────────────────────────────── */}
      <section id="workflow" style={{ padding: '100px 5%', background: S.bg2, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>How it works</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.8px', color: S.text, margin: 0 }}>Audit-ready in 4 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0 }}>
            {WORKFLOW.map((w, i) => (
              <div key={w.step} style={{ padding: '28px 24px', borderRight: i < WORKFLOW.length - 1 ? `1px solid ${S.border}` : 'none', position: 'relative' }}>
                <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', marginBottom: 16 }}>{w.step}</div>
                <div style={{ fontFamily: display, fontSize: 16, fontWeight: 600, color: S.text, marginBottom: 10, letterSpacing: '-0.2px' }}>{w.title}</div>
                <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.65, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>From the factories</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.7px', color: S.text, margin: 0 }}>What compliance officers say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: S.bg2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '28px' }}>
                <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: S.text3, marginTop: 2 }}>{t.role}</div>
                    <div style={{ fontSize: 10, fontFamily: mono, color: S.text3, marginTop: 1 }}>{t.location}</div>
                  </div>
                  <div style={{ textAlign: 'center', background: S.greenMuted, borderRadius: 10, padding: '10px 14px', border: `1px solid rgba(74,222,128,0.2)` }}>
                    <div style={{ fontSize: 22, fontWeight: 600, fontFamily: mono, color: S.green }}>{t.score}%</div>
                    <div style={{ fontSize: 9, fontFamily: mono, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>BSCI Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 5%', background: S.bg2, borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Simple pricing</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.8px', color: S.text, margin: '0 0 12px' }}>Pay for what you need</h2>
            <p style={{ fontSize: 14, color: S.text2 }}>All plans include a 60-day free trial. No credit card required.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: S.dark,
                border: `${plan.highlight ? '2px' : '1px'} solid ${plan.highlight ? S.green : S.border}`,
                borderRadius: 16, padding: '30px 28px',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: S.green, color: S.dark, fontSize: 10, fontFamily: mono, fontWeight: 600, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontFamily: display, fontSize: 14, fontWeight: 600, color: S.text2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{plan.name}</div>
                <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 600, color: S.text, marginBottom: 4 }}>
                  {plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: S.text3 }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: 12, color: S.text3, marginBottom: 24, fontFamily: mono }}>{plan.workers}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: S.text2 }}>
                      <span style={{ color: S.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollTo('contact')}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: display,
                    background: plan.highlight ? S.green : 'transparent',
                    color: plan.highlight ? S.dark : S.text,
                    border: plan.highlight ? 'none' : `1px solid ${S.border}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!plan.highlight) { e.target.style.borderColor = S.blue; e.target.style.color = S.blue } }}
                  onMouseLeave={e => { if (!plan.highlight) { e.target.style.borderColor = S.border; e.target.style.color = S.text } }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEREST / CONTACT FORM ───────────────────────────── */}
      <section id="contact" style={{ padding: '100px 5%', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: S.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Get in touch</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.8px', color: S.text, margin: '0 0 14px' }}>Start your free trial today</h2>
            <p style={{ fontSize: 14, color: S.text2, lineHeight: 1.7 }}>
              Fill in your details and we will set up your factory's ComplyRMG account within 24 hours — including an onboarding call with your compliance officer.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 32px', background: S.bg2, border: `1px solid rgba(74,222,128,0.3)`, borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <div style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: S.text, marginBottom: 12 }}>Request received!</div>
              <p style={{ fontSize: 14, color: S.text2, lineHeight: 1.7 }}>
                We'll contact <strong style={{ color: S.green }}>{interest.email}</strong> within 24 hours to set up your account.<br />
                WhatsApp us at <span style={{ fontFamily: mono, color: S.green }}>+880 1700-000000</span> for faster response.
              </p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: 'none', border: `1px solid ${S.border}`, color: S.text2, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontFamily: sans }}>
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleInterest} style={{ background: S.bg2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '36px 36px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { k: 'name',    label: 'Your Name',            placeholder: 'Khaled Rahman' },
                  { k: 'factory', label: 'Factory Name',         placeholder: 'Sunshine Textiles Ltd.' },
                  { k: 'email',   label: 'Email Address *',      placeholder: 'you@factory.com', type: 'email', required: true },
                  { k: 'phone',   label: 'Phone / WhatsApp',     placeholder: '+880 1711 XXXXXX' },
                  { k: 'workers', label: 'Approx. Worker Count', placeholder: '250' },
                ].map(({ k, label, placeholder, type = 'text', required }) => (
                  <div key={k} style={{ gridColumn: k === 'workers' ? '1' : undefined }}>
                    <label style={{ fontSize: 11, fontFamily: mono, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      {...ifield(k)}
                      style={{ width: '100%', background: S.bg3, border: `1px solid ${S.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: S.text, fontFamily: sans, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = S.green}
                      onBlur={e => e.target.style.borderColor = S.border}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontFamily: mono, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Message (optional)</label>
                <textarea
                  placeholder="Tell us about your audit timeline, buyer requirements, or any specific compliance challenges…"
                  rows={4}
                  {...ifield('message')}
                  style={{ width: '100%', background: S.bg3, border: `1px solid ${S.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: S.text, fontFamily: sans, outline: 'none', resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = S.green}
                  onBlur={e => e.target.style.borderColor = S.border}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '13px', background: S.green, color: S.dark, border: 'none', borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: display, letterSpacing: '-0.2px' }}
              >
                Send request — start free trial →
              </button>
              <p style={{ fontSize: 11, color: S.text3, textAlign: 'center', marginTop: 14 }}>
                No credit card required · 60-day free trial · Setup within 24 hours
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ padding: '48px 5%', background: S.bg2, borderTop: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, background: S.green, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 16 16" fill="none" width="14"><rect x="2" y="6" width="5" height="8" rx="1" fill="white"/><rect x="9" y="3" width="5" height="11" rx="1" fill="white"/><path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <span style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: S.text }}>ComplyRMG</span>
            </div>
            <p style={{ fontSize: 12, color: S.text3, lineHeight: 1.7 }}>BSCI & WRAP compliance platform built for Bangladesh's RMG sector. Dhaka, Bangladesh.</p>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              {[['📧', 'support@complyrm.com'], ['💬', '+880 1700-000000']].map(([icon, label]) => (
                <div key={label} style={{ fontSize: 11, fontFamily: mono, color: S.text3 }}>{icon} {label}</div>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
            { title: 'Compliance', links: ['BSCI Guide', 'WRAP Guide', 'RSC Resources', 'Bangladesh Labour Law'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontFamily: mono, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: 13, color: S.text2, marginBottom: 8, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = S.green}
                  onMouseLeave={e => e.target.style.color = S.text2}
                >{link}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, color: S.text3 }}>© {new Date().getFullYear()} ComplyRMG. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setLoginOpen(true)} style={{ background: 'none', border: `1px solid ${S.border}`, color: S.text2, fontSize: 12, cursor: 'pointer', padding: '6px 14px', borderRadius: 6, fontFamily: sans }}>
              Sign in →
            </button>
          </div>
        </div>
      </footer>

      {/* ── Login Modal ─────────────────────────────────────── */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </div>
  )
}
