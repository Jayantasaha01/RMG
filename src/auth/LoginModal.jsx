import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const DEMO_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@complyrm.com',        password: 'admin123',   desc: 'Full admin console + all factories' },
  { label: 'Factory', email: 'khaled@khaledtextiles.com', password: 'factory123', desc: 'Khaled Textiles compliance dashboard' },
]

export default function LoginModal({ open, onClose }) {
  const { login, loading, error, setError } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  // Reset on open
  useEffect(() => {
    if (open) { setEmail(''); setPassword(''); setShowPass(false); setError?.('') }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) {
      onClose()
      const dest = email.toLowerCase().trim() === 'admin@complyrm.com' ? '/admin' : '/dashboard'
      navigate(dest, { replace: true })
    }
  }

  function fillDemo(acc) {
    setEmail(acc.email)
    setPassword(acc.password)
    setError?.('')
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 900 }}
      />

      {/* Panel slides in from right */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        maxWidth: '100vw',
        background: 'var(--bg2)',
        borderLeft: '1px solid rgba(74,122,74,0.32)',
        zIndex: 901,
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.22s ease',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <rect x="2" y="6" width="5" height="8" rx="1" fill="white"/>
                <rect x="9" y="3" width="5" height="11" rx="1" fill="white"/>
                <path d="M1 14.5h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>ComplyRMG</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 28px', flex: 1 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.4px', margin: '0 0 6px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', margin: 0 }}>
              Sign in to your factory or admin account
            </p>
          </div>

          {/* Demo selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Demo accounts — click to fill
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  style={{
                    flex: 1, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    background: email === acc.email ? 'var(--green-muted)' : 'var(--bg2)',
                    border: `1px solid ${email === acc.email ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: email === acc.email ? 'var(--green)' : 'var(--text)', fontFamily: 'Space Grotesk, sans-serif' }}>
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
              <label style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError?.('') }}
                placeholder="you@factory.com"
                required
                autoFocus
                style={{
                  width: '100%', background: 'var(--bg3)', borderRadius: 8, padding: '11px 14px',
                  fontSize: 13, color: 'var(--text)', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none',
                  border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`, transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError?.('') }}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', background: 'var(--bg3)', borderRadius: 8, padding: '11px 40px 11px 14px',
                    fontSize: 13, color: 'var(--text)', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none',
                    border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`, transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--green)'}
                  onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 13 }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <span
                style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}
                onClick={() => alert('Contact support@complyrm.com to reset your password')}
              >
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
                width: '100%', padding: '12px',
                background: loading ? 'var(--bg4)' : 'var(--green)',
                color: loading ? 'var(--text3)' : '#0b0f2e',
                border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>
          Need access? Contact your ComplyRMG administrator or email{' '}
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#3b82f6' }}>support@complyrm.com</span>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  )
}
