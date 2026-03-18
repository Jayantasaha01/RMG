import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { useToast } from '../hooks/useToast'
import { useAttachments } from '../hooks/useAttachments'
import { useFileViewer } from '../components/ui/FileViewer'
import StatCard from '../components/ui/StatCard'

export default function AuditChecklists() {
  const { state, dispatch } = useApp()
  const { toast }           = useToast()
  const { storeFile }       = useAttachments()
  const { openFile }        = useFileViewer()

  const [listKey, setListKey] = useState('bsci')
  const [openSections, setOpenSections] = useState({ 0: true })

  const list = state.checklists[listKey]
  const allItems = list.flatMap(s => s.items)
  const done     = allItems.filter(i => i.checked).length
  const total    = allItems.length
  const pct      = total ? Math.round((done / total) * 100) : 0

  function toggleSection(si) {
    setOpenSections(prev => ({ ...prev, [si]: !prev[si] }))
  }

  function toggleItem(si, ii) {
    dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: { listKey, sectionIdx: si, itemIdx: ii } })
  }

  function attachEvidence(si, ii, files) {
    if (!files.length) return
    const stored = Array.from(files).map(f => storeFile(f, 'evidence'))
    dispatch({ type: 'ATTACH_CHECKLIST_EVIDENCE', payload: { listKey, sectionIdx: si, itemIdx: ii, files: stored } })
    toast(`${files.length} evidence file(s) attached`, 'green')
    // Re-open the section
    setOpenSections(prev => ({ ...prev, [si]: true }))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Audit Checklists</div>
          <div className="page-subtitle">BSCI · WRAP · RSC — AUDIT READINESS TRACKER</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>Showing:</span>
          <select
            className="search-input"
            style={{ maxWidth: 160 }}
            value={listKey}
            onChange={e => { setListKey(e.target.value); setOpenSections({ 0: true }) }}
          >
            <option value="bsci">BSCI Checklist</option>
            <option value="wrap">WRAP Checklist</option>
          </select>
        </div>
      </div>

      <div className="stats-grid stats-grid-3">
        <StatCard label="Completed"     value={done}        color="green" meta="Items marked" />
        <StatCard label="Pending"       value={total - done} color="amber" meta="Need attention" />
        <StatCard label="Overall Score" value={`${pct}%`}   color="blue"  meta="Readiness" />
      </div>

      <div className="card">
        {list.map((sec, si) => {
          const secDone = sec.items.filter(i => i.checked).length
          const secPct  = Math.round((secDone / sec.items.length) * 100)
          const isOpen  = !!openSections[si]

          return (
            <div key={si}>
              {/* Section header */}
              <div className="checklist-header" onClick={() => toggleSection(si)}>
                <svg
                  viewBox="0 0 10 10" width="10" fill="none"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text3)', flexShrink: 0 }}
                >
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: 'var(--text)' }}>{sec.section}</span>
                <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: secPct === 100 ? 'var(--green)' : secPct > 60 ? 'var(--amber)' : 'var(--red)' }}>
                  {secDone}/{sec.items.length} · {secPct}%
                </span>
              </div>

              {/* Items */}
              {isOpen && sec.items.map((item, ii) => {
                const evidence = item.evidence ?? []
                return (
                  <div key={ii} className="check-item">
                    {/* Checkbox */}
                    <div
                      className={`check-box${item.checked ? ' checked' : ''}`}
                      onClick={() => toggleItem(si, ii)}
                    >
                      {item.checked && (
                        <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#0a0e0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Text */}
                    <div style={{
                      flex: 1, fontSize: 12, color: 'var(--text2)', lineHeight: 1.5,
                      textDecoration: item.checked ? 'line-through' : 'none',
                      opacity: item.checked ? 0.5 : 1,
                    }}>
                      {item.text}
                    </div>

                    {/* Tag */}
                    <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', flexShrink: 0 }}>
                      {item.tag}
                    </span>

                    {/* Evidence count / view */}
                    {evidence.length > 0 && (
                      <span
                        style={{ cursor: 'pointer', fontSize: 11, color: 'var(--green)', marginLeft: 4, flexShrink: 0 }}
                        onClick={() => openFile(evidence[0])}
                      >
                        {evidence.length} file{evidence.length > 1 ? 's' : ''} ↗
                      </span>
                    )}

                    {/* Attach evidence button */}
                    <label className={`checklist-attach-btn${evidence.length ? ' has-files' : ''}`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        onChange={e => attachEvidence(si, ii, e.target.files)}
                      />
                      📎 {evidence.length > 0 ? `${evidence.length} file${evidence.length > 1 ? 's' : ''}` : 'Evidence'}
                    </label>
                  </div>
                )
              })}

              {/* Section divider */}
              <div style={{ borderBottom: '1px solid var(--border)' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
