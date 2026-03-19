import { useState, useRef } from 'react'
import { useApp } from '../store/AppContext'
import { useToast } from '../hooks/useToast'
import { useAttachments } from '../hooks/useAttachments'
import { nextWorkerId } from '../utils/helpers'
import { generateWorkerRecordsPDF } from '../utils/pdfExport'
import Modal from '../components/ui/Modal'
import UploadZone from '../components/ui/UploadZone'
import WorkerDrawer from '../components/ui/WorkerDrawer'
import Badge from '../components/ui/Badge'

const MIN_WAGE = 12500
const DEPTS    = ['Sewing', 'Finishing', 'Cutting', 'Quality', 'Store']
const GRADES   = [
  { value: '7', label: 'Grade 7 (Min ৳12,500)' },
  { value: '6', label: 'Grade 6 (৳13,000+)' },
  { value: '5', label: 'Grade 5 (৳14,000+)' },
  { value: '4', label: 'Grade 4 (৳15,500+)' },
  { value: '3', label: 'Grade 3 (Supervisor)' },
]
const STATUSES = ['Active', 'On Leave', 'Maternity', 'Probation']

export default function Workers() {
  const { state, dispatch } = useApp()
  const { toast }           = useToast()
  const { storeFile }       = useAttachments()

  const [search,    setSearch]    = useState('')
  const [deptFlt,   setDeptFlt]   = useState('')
  const [statusFlt, setStatusFlt] = useState('')
  const [addOpen,   setAddOpen]   = useState(false)
  const [drawer,    setDrawer]    = useState(null)   // worker object | null

  // Form state
  const [form, setForm] = useState({ name: '', nidNum: '', dept: 'Sewing', grade: '7', wage: '', doj: '', status: 'Active' })
  const pendingNid   = useRef([])
  const pendingAppt  = useRef([])
  const pendingExtra = useRef([])

  const field = (k) => ({ value: form[k], onChange: (e) => setForm(p => ({ ...p, [k]: e.target.value })) })

  function openAdd() {
    setForm({ name: '', nidNum: '', dept: 'Sewing', grade: '7', wage: '', doj: '', status: 'Active' })
    pendingNid.current   = []
    pendingAppt.current  = []
    pendingExtra.current = []
    setAddOpen(true)
  }

  function handleAdd() {
    if (!form.name.trim()) { toast('Please enter a worker name', 'amber'); return }
    const wage = parseInt(form.wage) || MIN_WAGE
    const attachments = [
      ...pendingNid.current.map(f   => storeFile(f, 'nid')),
      ...pendingAppt.current.map(f  => storeFile(f, 'appointment')),
      ...pendingExtra.current.map(f => storeFile(f, 'other')),
    ]
    const hasNid = attachments.some(a => a.category === 'nid')
    dispatch({
      type: 'ADD_WORKER',
      payload: {
        id: nextWorkerId(state.workers),
        name:   form.name.trim(),
        dept:   form.dept,
        grade:  form.grade,
        wage,
        status: form.status,
        joined: form.doj || new Date().toISOString().split('T')[0],
        nid:    hasNid ? 'verified' : 'pending',
        attachments,
      },
    })
    setAddOpen(false)
    toast(`Worker ${form.name} added successfully`, 'green')
  }

  // Filtered list
  const filtered = state.workers.filter(w => {
    const q = search.toLowerCase()
    if (q && !w.name.toLowerCase().includes(q) && !w.id.includes(q) && !w.dept.toLowerCase().includes(q)) return false
    if (deptFlt   && w.dept   !== deptFlt)   return false
    if (statusFlt && w.status !== statusFlt) return false
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Worker Records</div>
          <div className="page-subtitle">NID VERIFIED · AUDIT READY</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => {
            generateWorkerRecordsPDF({ workers: state.workers, factory: 'Khaled Textiles Ltd.' })
            toast('Worker records PDF downloaded', 'green')
          }}>
            ↓ Export PDF
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <PlusIcon /> Add Worker
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="search-input flex-1"
            placeholder="Search by name, ID or department…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select className="search-input" value={deptFlt} onChange={e => setDeptFlt(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="search-input" value={statusFlt} onChange={e => setStatusFlt(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Worker ID','Name','Department','Grade','Monthly Wage','NID Status','Status','Joined','Docs'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => {
                const docCount = (w.attachments ?? []).length
                const nidHasFile = (w.attachments ?? []).some(a => a.category === 'nid')
                const nidColor = (nidHasFile || w.nid === 'verified') ? 'green' : 'amber'
                const nidLabel = nidHasFile ? 'Verified ✓' : w.nid === 'verified' ? 'Verified' : 'Pending'
                const statusColor = w.status === 'Active' ? 'green' : w.status === 'Maternity' ? 'blue' : 'neutral'
                return (
                  <tr key={w.id} style={{ cursor: 'pointer' }} onClick={() => setDrawer(w)}>
                    <td className="td-id">{w.id}</td>
                    <td className="td-name">{w.name}</td>
                    <td>{w.dept}</td>
                    <td>Grade {w.grade}</td>
                    <td style={{ color: w.wage >= MIN_WAGE ? 'var(--green)' : 'var(--red)', fontFamily: 'IBM Plex Mono' }}>
                      ৳{w.wage.toLocaleString()}
                    </td>
                    <td><Badge color={nidColor}>{nidLabel}</Badge></td>
                    <td><Badge color={statusColor}>{w.status}</Badge></td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>{w.joined}</td>
                    <td>
                      <span
                        className={`attach-count${docCount > 0 ? ' has-files' : ''}`}
                        onClick={e => { e.stopPropagation(); setDrawer(w) }}
                      >
                        📎 {docCount} doc{docCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Worker Record"
        wide
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Save Worker</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="রহিমা বেগম" {...field('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">NID Number</label>
            <input className="form-input" placeholder="19XX XXXX XXXX" {...field('nidNum')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" {...field('dept')}>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Grade</label>
            <select className="form-input" {...field('grade')}>
              {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Monthly Basic Wage (৳)</label>
            <input className="form-input" type="number" placeholder="12500" {...field('wage')} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Joining</label>
            <input className="form-input" type="date" {...field('doj')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Employment Status</label>
          <select className="form-input" {...field('status')}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <hr className="divider-line" />
        <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          📎 Document Attachments
        </div>

        <div className="multi-upload-grid">
          <div>
            <span className="upload-section-label">NID / Birth Certificate</span>
            <UploadZone icon="🪪" label={<><span>Click or drag</span> NID scan / birth cert</>} onFiles={files => { pendingNid.current = files }} />
          </div>
          <div>
            <span className="upload-section-label">Appointment Letter</span>
            <UploadZone icon="📄" label={<><span>Click or drag</span> appointment letter</>} onFiles={files => { pendingAppt.current = files }} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="upload-section-label">Additional Documents (Medical, Maternity, Training…)</span>
          <UploadZone icon="📁" label={<><span>Click or drag</span> any additional documents</>} hint="Multiple files · PDF, JPG, PNG" onFiles={files => { pendingExtra.current = files }} />
        </div>
      </Modal>

      {/* Worker drawer */}
      {drawer && <WorkerDrawer worker={drawer} onClose={() => setDrawer(null)} />}
    </div>
  )
}

const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
