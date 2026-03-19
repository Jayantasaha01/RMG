import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const DEMO_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@complyrm.com',       password: 'admin123',   role: 'admin',   desc: 'Full admin console + all factories' },
  { label: 'Factory', email: 'khaled@khaledtextiles.com', password: 'factory123', role: 'factory', desc: 'Khaled Textiles compliance dashboard' },
]

export default function Login() {
  const { login, loading, error, setError } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) {
      // Admin → admin console, factory → compliance app
      const dest = email.toLowerCase() === 'admin@complyrm.com' ? '/admin' : from
      navigate(dest, { replace: true })
    }
  }

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)', fontFamily: 'IBM Plex Sans, sans-serif',
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: '42%', background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 44px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="none" width="18" height="18">
              <rect x="2" y="6" width="5" height="8" rx="1" fill="white"/>
              <rect x="9" y="3" width="5" height="11" rx="1" fill="white"/>
              <path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>ComplyRMG</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compliance Platform</div>
          </div>
        </div>

        {/* Main pitch */}
        <div>
          <div style={{ fontSize: 32, fontWeight: 600, fontFamily: 'Space Grotesk', color: 'var(--text)', lineHeight: 1.25, letterSpacing: '-0.5px', marginBottom: 16 }}>
            BSCI & WRAP compliance.<br />
            <span style={{ color: '#3b82f6' }}>Simplified.</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 340 }}>
            Manage worker records, track certifications, log incidents, and prepare for audits — all in one place built for Bangladesh's RMG sector.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {['Worker NID tracking', 'Cert expiry alerts', 'BSCI checklists', 'Wage compliance', 'PDF export', 'WhatsApp reminders'].map(f => (
              <div key={f} style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', padding: '4px 10px', borderRadius: 20, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', color: '#3b82f6' }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24 }}>
          {[['4,500+', 'RMG factories in BD'], ['$46B', 'Annual export sector'], ['4M+', 'Workers to protect']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'IBM Plex Mono', color: '#3b82f6' }}>{val}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Space Grotesk', color: 'var(--text)', letterSpacing: '-0.3px' }}>Welcome back</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>Sign in to your ComplyRMG account</div>
          </div>

          {/* Demo account selector */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Demo Accounts — click to fill
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  style={{
                    flex: 1, padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    background: email === acc.email ? 'var(--green-muted)' : 'var(--bg3)',
                    border: `1px solid ${email === acc.email ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: email === acc.email ? 'var(--green)' : 'var(--text)', fontFamily: 'Space Grotesk' }}>
                    {acc.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, lineHeight: 1.4 }}>{acc.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@factory.com"
                required
                style={{
                  width: '100%', background: 'var(--bg2)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text)',
                  fontFamily: 'IBM Plex Sans', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', background: 'var(--bg2)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text)',
                  fontFamily: 'IBM Plex Sans', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}
                onClick={() => alert('Contact admin@complyrm.com to reset your password')}>
                Forgot password?
              </span>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'var(--red-muted)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', background: loading ? 'var(--bg4)' : 'var(--green)',
                color: loading ? 'var(--text3)' : '#0b0f2e', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, fontFamily: 'Space Grotesk',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                letterSpacing: '-0.1px',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6 }}>
            Need access? Contact your ComplyRMG administrator.<br />
            <span style={{ fontFamily: 'IBM Plex Mono' }}>support@complyrm.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
