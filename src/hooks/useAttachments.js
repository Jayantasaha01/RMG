import { useRef, useCallback } from 'react'

/**
 * In-memory file store. In production this layer would upload to
 * Cloudflare R2 via the backend and store a remote URL instead.
 *
 * Swap storeFile() to POST to VITE_FILE_UPLOAD_URL and return the
 * remote URL once the backend is wired up.
 */

let _counter = 0

export function useAttachments() {
  const store = useRef({}) // id → fileObj

  const storeFile = useCallback((file, category = 'other') => {
    const id = `f${++_counter}`
    const url = URL.createObjectURL(file)
    const obj = {
      id,
      name: file.name,
      type: file.type,
      url,
      size: fmtSize(file.size),
      category,
    }
    store.current[id] = obj
    return obj
  }, [])

  const getFile = useCallback((id) => store.current[id], [])

  /**
   * Convert a file <input> element's FileList into stored file objects.
   * Also handles files dropped via drag-and-drop stored on input._droppedFiles.
   */
  const collectFiles = useCallback((inputEl, category = 'other') => {
    if (!inputEl) return []
    const fromInput   = inputEl.files   ? Array.from(inputEl.files)          : []
    const fromDropped = inputEl._droppedFiles ?? []
    const all = [...fromInput, ...fromDropped]
    return all.map(f => storeFile(f, category))
  }, [storeFile])

  return { storeFile, getFile, collectFiles }
}

// ── Helpers ────────────────────────────────────────────────────────────
export function fileIcon(mimeType) {
  if (!mimeType) return '📄'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📋'
  return '📄'
}

export function fmtSize(bytes) {
  if (bytes < 1024)       return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}
