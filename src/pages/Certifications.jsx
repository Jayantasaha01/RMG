import { useState, useRef } from 'react'
import { useApp } from '../store/AppContext'
import { useToast } from '../hooks/useToast'
import { useAttachments } from '../hooks/useAttachments'
import { useFileViewer } from '../components/ui/FileViewer'
import { daysUntil, certStatusColor, certStatusLabel } from '../utils/helpers'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import UploadZone from '../components/ui/UploadZone'

const CERT_NAMES = ['BSCI Audit','WRAP Certification','GOTS Certification','OEKO-TEX Standard 100','Fire Safety Certificate','Boiler Inspection','Drinking Water Test','RSC Inspection','Group Insurance','Other']

export default function Certifications() {
  const { state, dispatch } = useApp()
  const { toast }           = useToast()
  const { storeFile }       = useAttachments()
  const { openFile }        = useFileViewer()

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm]       = useState({ name: CERT_NAMES[0], issuer: '', certno: '', issued: '', expiry: '' })
  const pendingFiles          = useRef([])

  const field = (k) => ({ value: form[k], onChange: (e) => setForm(p => ({ ...p, [k]: e.target.value })) })

  function openAdd() {
    setForm({ name: CERT_NAMES[0], issuer: '', certno: '', issued: '', expiry: '' })
    pendingFiles.current = []
    setAddOpen(true)
  }

  function handleAdd() {
    if (!form.expiry) { toast('Please enter an expiry date', 'amber'); return }
    const attachments = pendingFiles.current.map(f => storeFile(f, 'certificate'))
    dispatch({
      type: 'ADD_CERT',
      payload: {
        id: `c${Date.now()}`,
        name:   form.name,
        type:   'Compliance',
        issuer: form.issuer || 'Unknown',
        certno: form.certno || '-',
        issued: form.issued || new Date().toISOString().split('T')[0],
        expiry: form.expiry,
        attachments,
      },
    })
    setAddOpen(false)
    toast(`${form.name} added${attachments.length ? ` with ${attachments.length} file(s)` : ''}`, 'green')
  }

  // Stats
  let valid = 0, expiring = 0, expired = 0
  state.certs.forEach(c => {
    const d = daysUntil(c.expiry)
    if (d < 0) expired++
    else if (d <= 60) expiring++
    else valid++
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Certifications & Audit Docs</div>
          <div className="page-subtitle">EXPIRY TRACKING · AUTO REMINDERS</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <PlusIcon /> Add Certification
        </button>
      </div>

      <div className="stats-grid stats-grid-3">
        <StatCard label="Valid"          value={valid}    color="green" meta="Active certs" />
        <StatCard label="Expiring Soon"  value={expiring} color="amber" meta="Within 60 days" />
        <StatCard label="Expired"        value={expired}  color="red"   meta="Need renewal" />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Certification','Type','Issued By','Issue Date','Expiry Date','Days Left','Status','File','Action'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {state.certs.map((c, ci) => {
                const days  = daysUntil(c.expiry)
                const color = certStatusColor(days)
                const label = certStatusLabel(days)
                const files = c.attachments ?? []
                return (
                  <tr key={c.id}>
                    <td className="td-name">{c.name}</td>
                    <td><Badge color="neutral">{c.type}</Badge></td>
                    <td style={{ color: 'var(--text2)' }}>{c.issuer}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>{c.issued}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>{c.expiry}</td>
                    <td><Badge color={color}>{days < 0 ? 'Expired' : `${days}d`}</Badge></td>
                    <td><Badge color={color}>{label}</Badge></td>
                    <td>
                      {files.length > 0 ? (
                        <span
                          className="attach-count has-files"
                          style={{ cursor: 'pointer' }}
                          onClick={() => openFile(files[0])}
                        >
                          📎 {files.length} file{files.length > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="attach-count" style={{ opacity: 0.45 }}>📎 No file</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '3px 10px', fontSize: 11 }}
                        onClick={() => toast('Renewal reminder sent via WhatsApp ✓', 'green')}
                      >
                        Remind
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add cert modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Certification"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Save Certification</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Certification Name</label>
          <select className="form-input" {...field('name')}>
            {CERT_NAMES.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Issued By</label>
            <input className="form-input" placeholder="Bureau Veritas" {...field('issuer')} />
          </div>
          <div className="form-group">
            <label className="form-label">Certificate No.</label>
            <input className="form-input" placeholder="BD-2024-XXXXX" {...field('certno')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Issue Date</label>
            <input className="form-input" type="date" {...field('issued')} />
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input className="form-input" type="date" {...field('expiry')} />
          </div>
        </div>
        <hr className="divider-line" />
        <span className="upload-section-label">📎 Upload Certificate Document</span>
        <UploadZone
          icon="🏅"
          label={<><span>Click or drag</span> the certificate scan or PDF</>}
          hint="PDF, JPG, PNG · Multiple files allowed"
          onFiles={files => { pendingFiles.current = files }}
        />
      </Modal>
    </div>
  )
}

const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
