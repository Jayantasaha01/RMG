import { useEffect } from 'react'
import FileChip from './FileChip'
import { useToast } from '../../hooks/useToast'

const CATS = {
  nid:         '🪪 NID / ID Documents',
  appointment: '📄 Appointment Letter',
  other:       '📁 Other Documents',
}

export default function WorkerDrawer({ worker, onClose }) {
  const { toast } = useToast()

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!worker) return null

  const attachments = worker.attachments ?? []
  const grouped = attachments.reduce((acc, f) => {
    const cat = f.category ?? 'other'
    ;(acc[cat] ??= []).push(f)
    return acc
  }, {})

  const wageOk = worker.wage >= 12500

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer panel */}
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">{worker.name}</span>
          <button
            onClick={onClose}
            style={{ color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
          >
            ×
          </button>
        </div>

        {/* Worker info */}
        <div className="drawer-section">
          <div className="drawer-section-title">Worker Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Worker ID',    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{worker.id}</span>],
              ['Department',   worker.dept],
              ['Grade',        `Grade ${worker.grade}`],
              ['Status',       worker.status],
              ['Monthly Wage', <span style={{ color: wageOk ? 'var(--green)' : 'var(--red)' }}>৳{worker.wage.toLocaleString()}</span>],
              ['Date Joined',  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{worker.joined}</span>],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <div className="drawer-field-label">{lbl}</div>
                <div className="drawer-field-val">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div className="drawer-section">
          <div className="drawer-section-title">Documents & Attachments</div>

          {attachments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text3)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
              <div style={{ fontSize: 12 }}>No documents attached yet</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Use "Add Worker" to upload NID, contracts, and other docs</div>
            </div>
          ) : (
            Object.entries(CATS).map(([catKey, catLabel]) => {
              const files = grouped[catKey] ?? []
              if (!files.length) return null
              return (
                <div key={catKey} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {catLabel}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {files.map(f => <FileChip key={f.id} file={f} />)}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick actions */}
        <div className="drawer-section">
          <div className="drawer-section-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => toast('Appointment letter template downloaded', 'green')}
            >
              📄 Download Appointment Letter Template
            </button>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => toast('Maternity file template downloaded', 'green')}
            >
              👶 Download Maternity Personal File Template
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
