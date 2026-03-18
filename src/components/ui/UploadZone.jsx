import { useState, useRef } from 'react'
import { fileIcon, fmtSize } from '../../hooks/useAttachments'

/**
 * Reusable upload zone with drag-and-drop support.
 *
 * Props:
 *   id          – unique id (used as input id)
 *   icon        – emoji shown in the zone
 *   label       – main prompt text (JSX, <span> for highlighted word)
 *   hint        – small text below label
 *   accept      – file accept string, default ".pdf,.jpg,.jpeg,.png"
 *   multiple    – bool
 *   onFiles     – callback(fileList: File[]) called on every change
 */
export default function UploadZone({
  id,
  icon = '📁',
  label = <><span>Click or drag</span> files here</>,
  hint = 'PDF, JPG, PNG',
  accept = '.pdf,.jpg,.jpeg,.png',
  multiple = true,
  onFiles,
}) {
  const [dragging, setDragging] = useState(false)
  const [chips, setChips]       = useState([])
  const inputRef                = useRef(null)

  const addFiles = (fileList) => {
    const files = Array.from(fileList)
    if (!files.length) return
    setChips(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type, size: fmtSize(f.size) }))])
    onFiles?.(files)
  }

  return (
    <div>
      <div
        className={`upload-zone${dragging ? ' drag-over' : ''}${chips.length ? ' has-files' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="upload-zone-icon">{icon}</div>
        <div className="upload-zone-label">{label}</div>
        {hint && <div className="upload-zone-hint">{hint}</div>}
      </div>

      {chips.length > 0 && (
        <div className="file-chips">
          {chips.map((c, i) => (
            <span key={i} className="file-chip" title={c.name}>
              <span>{fileIcon(c.type)}</span>
              <span className="file-chip-name">{c.name}</span>
              <span className="file-chip-size">{c.size}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
