import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { fileIcon } from '../../hooks/useAttachments'

// ── Context so any component can call openFile(fileObj) ────────────────
const ViewerCtx = createContext(null)

export function useFileViewer() {
  const ctx = useContext(ViewerCtx)
  if (!ctx) throw new Error('useFileViewer must be inside FileViewer')
  return ctx
}

// ── Singleton component mounted once in App.jsx ────────────────────────
export default function FileViewer({ children }) {
  const [file, setFile] = useState(null)

  const openFile  = useCallback((f) => setFile(f), [])
  const closeFile = useCallback(() => setFile(null), [])

  useEffect(() => {
    if (!file) return
    const handler = (e) => { if (e.key === 'Escape') closeFile() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [file, closeFile])

  return (
    <ViewerCtx.Provider value={{ openFile }}>
      {children}

      {file && (
        <div
          className="viewer-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeFile() }}
        >
          {/* Header */}
          <div className="viewer-header">
            <span style={{ fontSize: 18 }}>{fileIcon(file.type)}</span>
            <span className="viewer-filename">{file.name}</span>
            <a
              href={file.url}
              download={file.name}
              className="btn btn-ghost"
              style={{ padding: '5px 12px', fontSize: 11 }}
            >
              ↓ Download
            </a>
            <button
              onClick={closeFile}
              style={{ color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="viewer-body">
            {file.type?.startsWith('image/') ? (
              <img src={file.url} alt={file.name} />
            ) : file.type === 'application/pdf' ? (
              <iframe src={file.url} title={file.name} />
            ) : (
              <div className="viewer-placeholder">
                <div style={{ fontSize: 48, marginBottom: 12 }}>{fileIcon(file.type)}</div>
                <p style={{ fontSize: 13, color: 'var(--text2)' }}>{file.name}</p>
                <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)' }}>
                  Preview not available — use the download button above
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </ViewerCtx.Provider>
  )
}
