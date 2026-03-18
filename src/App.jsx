import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Workers from './pages/Workers'
import Certifications from './pages/Certifications'
import AuditChecklists from './pages/AuditChecklists'
import WageRegister from './pages/WageRegister'
import Incidents from './pages/Incidents'
import FileViewer from './components/ui/FileViewer'
import Toast from './components/ui/Toast'

export default function App() {
  return (
    // FileViewer wraps the whole app — it provides useFileViewer() context
    // AND renders the lightbox overlay when a file is opened.
    <FileViewer>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="workers"        element={<Workers />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="audits"         element={<AuditChecklists />} />
          <Route path="wages"          element={<WageRegister />} />
          <Route path="incidents"      element={<Incidents />} />
        </Route>
      </Routes>
      <Toast />
    </FileViewer>
  )
}
