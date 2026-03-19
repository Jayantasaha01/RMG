/**
 * AuthContext.jsx
 * Handles login/logout state and role-based route protection.
 *
 * Roles:
 *   'admin'   → can access /admin/* and /dashboard/*
 *   'factory' → can only access /dashboard/*
 *
 * In production: replace the MOCK_USERS map with a
 * Supabase auth call:
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
 */
import { createContext, useContext, useState, useCallback } from 'react'

// ── Mock user database (replace with Supabase auth) ───────────────────
const MOCK_USERS = {
  'admin@complyrm.com': {
    id:       'u_admin',
    email:    'admin@complyrm.com',
    password: 'admin123',           // never store plaintext in production
    name:     'Jayanta Saha',
    role:     'admin',
    factory:  null,
  },
  'khaled@khaledtextiles.com': {
    id:       'u_f001',
    email:    'khaled@khaledtextiles.com',
    password: 'factory123',
    name:     'Khaled Rahman',
    role:     'factory',
    factory:  'f001',
    factoryName: 'Khaled Textiles Ltd.',
  },
  'nadia@nadiagarments.com': {
    id:       'u_f002',
    email:    'nadia@nadiagarments.com',
    password: 'factory123',
    name:     'Nadia Islam',
    role:     'factory',
    factory:  'f002',
    factoryName: 'Nadia Garments Ltd.',
  },
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Persist session in sessionStorage so page-refresh doesn't log out during dev
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('complyrm_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))

    const found = MOCK_USERS[email.toLowerCase().trim()]
    if (!found || found.password !== password) {
      setError('Invalid email or password')
      setLoading(false)
      return false
    }

    const { password: _, ...safeUser } = found  // strip password before storing
    setUser(safeUser)
    sessionStorage.setItem('complyrm_user', JSON.stringify(safeUser))
    setLoading(false)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('complyrm_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
