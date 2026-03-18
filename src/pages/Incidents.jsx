import { useState, useRef } from 'react'
import { useApp } from '../store/AppContext'
import { useToast } from '../hooks/useToast'
import { useAttachments } from '../hooks/useAttachments'
import Modal from '../components/ui/Modal'
import UploadZone from '../components/ui/UploadZone'
import FileChip from '../components/ui/FileChip'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'

const TYPES = ['Minor Injury','Medical Treatment','Lost Time Injury','Near Miss','Fire Incident','Property Damage']
const ICONS  = { 'Minor Injury':'🤕','Medical Treatment':'🏥','Lost Time Injury':'🚨','Near Miss':'⚠️','Fire Incident':'🔥','Property Damage':'📦' }
const COLORS = { 'Minor Injury':'amber','Medical Treatment':'amber','Lost Time Injury':'red','Near Miss':'amber','Fire Incident':'red','Property Damage':'blue' }

export default function Incidents() {
  const { state, dispatch } = useApp()
  const { toast }           = useToast()
  const { storeFile }       = useAttachments()

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm]       = useState({ type: TYPES[0], date: '', location: '', desc: '', action: '' })
  const pendingFiles          = useRef([])

  const field = (k) => ({ value: form[k], onChange: (e) => setForm(p => ({ ...p, [k]: e.target.value })) })

  function openAdd() {
    setForm({ type: TYPES[0], date: '', location: '', desc: '', action: '' })
    pendingFiles.current = []
    setAddOpen(true)
  }

  function handleAdd() {
    if (!form.date || !form.location) { toast('Please fill in date and location', 'amber'); return }
    const attachments = pendingFiles.current.map(f => storeFile(f, 'evidence'))
    dispatch({
      type: 'ADD_INCIDENT',
      payload: {
        id: `i${Date.now()}`,
        type:     form.type,
        date:     form.date,
        location: form.location,
        desc:     form.desc,
        action:   form.action,
        resolved: false,
        attachments,
      },
    })
    setAddOpen(false)
    toast(`Incident logged${attachments.length ? ` with ${attachments.length} attachment(s)` : ''}`, 'green')
  }

  function resolve(id) {
    dispatch({ type: 'RESOLVE_INCIDENT', payload: id })
    toast('Incident marked as resolved', 'green')
  }

  const open     = state.incidents.filter(i => !i.resolved).length
  const resolved = state.incidents.filter(i =>  i.resolved).length
  const nearMiss = state.incidents.filter(i => i.type === 'Near Miss').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Incident & Accident Log</div>
          <div className="page-subtitle">BSCI REQUIREMENT — ALL INCIDENTS MUST BE DOCUMENTED</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <PlusIcon /> Log Incident
        </button>
      </div>

      <div className="stats-grid stats-grid-4">
        <StatCard label="Open Incidents" value={open}     color="red"   meta="Need resolution" />
        <StatCard label="Resolved"       value={resolved} color="green" meta="Last 90 days" />
        <StatCard label="Near Misses"    value={nearMiss} color="amber" meta="Logged this year" />
        <StatCard label="Days Since LTI" value={18}       color="blue"  meta="Last LTI incident" />
      </div>

      <div className="card">
        {state.incidents.map((inc, idx) => {
          const color = COLORS[inc.type] ?? 'amber'
          const files = inc.attachments ?? []
          return (
            <div key={inc.id} className="incident-item" style={{ borderBottom: idx < state.incidents.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {/* Icon */}
              <div style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `var(--${color}-muted)`, fontSize: 18, flexShrink: 0 }}>
                {ICONS[inc.type] ?? '⚠️'}
              </div>

              {/* Body */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{inc.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{inc.date} · {inc.location}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, lineHeight: 1.5 }}>{inc.desc}</div>
                {inc.action && (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--green)' }}>✓ {inc.action}</div>
                )}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {files.map(f => <FileChip key={f.id} file={f} />)}
                  </div>
                )}
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <Badge color={inc.resolved ? 'green' : 'amber'}>{inc.resolved ? 'Resolved' : 'Open'}</Badge>
                {!inc.resolved && (
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '3px 10px', fontSize: 11 }}
                    onClick={() => resolve(inc.id)}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add incident modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Log Incident / Accident"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Log Incident</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Incident Type</label>
            <select className="form-input" {...field('type')}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Incident</label>
            <input className="form-input" type="date" {...field('date')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Location / Section</label>
          <input className="form-input" placeholder="e.g. Sewing Floor B, Line 3" {...field('location')} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} placeholder="Describe what happened…" {...field('desc')} style={{ resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Corrective Action Taken</label>
          <textarea className="form-input" rows={2} placeholder="Steps taken to prevent recurrence…" {...field('action')} style={{ resize: 'vertical' }} />
        </div>
        <hr className="divider-line" />
        <span className="upload-section-label">📎 Attach Photos or Investigation Report</span>
        <UploadZone
          icon="📷"
          label={<><span>Click or drag</span> incident photos or investigation PDF</>}
          hint="Multiple files allowed · PDF, JPG, PNG"
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
