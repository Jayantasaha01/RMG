import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './auth/Login'

import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Workers from './pages/Workers'
import Certifications from './pages/Certifications'
import AuditChecklists from './pages/AuditChecklists'
import WageRegister from './pages/WageRegister'
import Incidents from './pages/Incidents'
import Settings from './pages/Settings'
import FileViewer from './components/ui/FileViewer'
import Toast from './components/ui/Toast'

import { AdminProvider } from './admin/store/AdminContext'
import AdminLayout from './admin/components/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AllFactories from './admin/pages/AllFactories'
import Invoices from './admin/pages/Invoices'
import {
  TrialPipeline,
  OnboardingTracker,
  RevenueBilling,
  PlansAndPricing,
} from './admin/pages/AdminSubPages'

export default function App() {
  const { user } = useAuth()

  return (
    <FileViewer>
      <AdminProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user
            ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
            : <Login />}
          />

          {/* Factory compliance app — requires any authenticated user */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"      element={<Dashboard />} />
            <Route path="workers"        element={<Workers />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="audits"         element={<AuditChecklists />} />
            <Route path="wages"          element={<WageRegister />} />
            <Route path="incidents"      element={<Incidents />} />
            <Route path="settings"       element={<Settings />} />
          </Route>

          {/* Admin console — requires admin role */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="factories"  element={<AllFactories />} />
            <Route path="onboarding" element={<OnboardingTracker />} />
            <Route path="trials"     element={<TrialPipeline />} />
            <Route path="revenue"    element={<RevenueBilling />} />
            <Route path="plans"      element={<PlansAndPricing />} />
            <Route path="invoices"   element={<Invoices />} />
          </Route>
        </Routes>
      </AdminProvider>
      <Toast />
    </FileViewer>
  )
}
