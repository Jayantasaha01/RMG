import { useFileViewer } from './FileViewer'
import { fileIcon } from '../../hooks/useAttachments'

export default function FileChip({ file }) {
  const { openFile } = useFileViewer()

  return (
    <span
      className="file-chip"
      title={file.name}
      onClick={() => openFile(file)}
    >
      <span>{fileIcon(file.type)}</span>
      <span className="file-chip-name">{file.name}</span>
      <span className="file-chip-size">{file.size}</span>
    </span>
  )
}
