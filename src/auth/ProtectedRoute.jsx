import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * ProtectedRoute
 *
 * Props:
 *   requiredRole  – 'admin' | 'factory' | undefined (any authenticated user)
 *   children      – the route's element
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user }    = useAuth()
  const location    = useLocation()

  if (!user) {
    // Not logged in → redirect to login, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Wrong role → send factory users back to dashboard, admin to /admin
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}
