import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Camera, FileText, Trash2, X } from 'lucide-react'
import { deleteAttachment, getAttachmentBlob, saveAttachment } from '../../store/attachmentStore'

export function AttachmentField({ imageId, onChange }: { imageId?: string; onChange: (id: string | undefined) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!imageId) {
      setPreviewUrl(null)
      return
    }
    let url: string | undefined
    getAttachmentBlob(imageId).then((blob) => {
      if (!blob) return
      url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setIsPdf(blob.type === 'application/pdf')
      setNomeArquivo(blob instanceof File ? blob.name : null)
    })
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [imageId])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const previousId = imageId
    const newImageId = await saveAttachment(file)
    onChange(newImageId)
    if (previousId) await deleteAttachment(previousId)
  }

  async function handleRemove() {
    if (imageId) await deleteAttachment(imageId)
    onChange(undefined)
  }

  function handleOpen() {
    if (!previewUrl) return
    if (isPdf) {
      window.open(previewUrl, '_blank', 'noopener')
    } else {
      setLightboxOpen(true)
    }
  }

  return (
    <div>
      <p className="text-body-sm text-muted mb-xxs dark:text-on-dark-soft">Anexo</p>

      {previewUrl ? (
        <div className="flex items-center gap-sm">
          <button onClick={handleOpen} className="shrink-0" aria-label={isPdf ? 'Abrir PDF' : 'Ver imagem'}>
            {isPdf ? (
              <span className="w-16 h-16 rounded-md border border-hairline dark:border-hairline-dark bg-surface-strong dark:bg-white/10 flex items-center justify-center">
                <FileText size={24} className="text-ink dark:text-on-dark" />
              </span>
            ) : (
              <img src={previewUrl} alt="Anexo" className="w-16 h-16 rounded-md object-cover border border-hairline dark:border-hairline-dark" />
            )}
          </button>
          <div className="flex flex-col gap-xs min-w-0">
            {isPdf && nomeArquivo && <p className="text-body-sm text-ink dark:text-on-dark truncate">{nomeArquivo}</p>}
            <button onClick={() => inputRef.current?.click()} className="text-body-sm text-ink dark:text-on-dark active:opacity-70 text-left">
              Trocar arquivo
            </button>
            <button onClick={handleRemove} className="inline-flex items-center gap-xxs text-body-sm text-error active:opacity-70">
              <Trash2 size={14} /> Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-xs h-10 px-base rounded-md border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-sm text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
        >
          <Camera size={16} /> Anexar imagem ou PDF
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />

      {lightboxOpen &&
        previewUrl &&
        !isPdf &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-lg" onClick={() => setLightboxOpen(false)}>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-lg right-lg p-xs rounded-full bg-white/10 active:bg-white/20"
              aria-label="Fechar"
            >
              <X size={22} className="text-white" />
            </button>
            <img src={previewUrl} alt="Anexo" className="max-w-full max-h-full rounded-lg object-contain" />
          </div>,
          document.body,
        )}
    </div>
  )
}
