import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, FileText, Trash2, X } from 'lucide-react'
import { attachmentFileName, deleteAttachment, getAttachmentUrl, isPdfPath, saveAttachment } from '../../store/attachmentStore'
import { useTrip } from '../../store/TripContext'
import { backdrop, popIn } from '../../lib/motion'

export function AttachmentField({ imageId, onChange }: { imageId?: string; onChange: (id: string | undefined) => void }) {
  const { tripId } = useTrip()
  const [url, setUrl] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isPdf = imageId ? isPdfPath(imageId) : false
  const nomeArquivo = imageId ? attachmentFileName(imageId) : null

  useEffect(() => {
    if (!imageId) {
      setUrl(null)
      return
    }
    let cancelled = false
    getAttachmentUrl(imageId).then((u) => {
      if (!cancelled) setUrl(u ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [imageId])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const previousId = imageId
    setUploading(true)
    try {
      const newImageId = await saveAttachment(tripId, file)
      onChange(newImageId)
      if (previousId) await deleteAttachment(previousId)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (imageId) await deleteAttachment(imageId)
    onChange(undefined)
  }

  function handleOpen() {
    if (!url) return
    if (isPdf) {
      window.open(url, '_blank', 'noopener')
    } else {
      setLightboxOpen(true)
    }
  }

  return (
    <div>
      <p className="text-body-sm text-muted mb-xxs dark:text-on-dark-soft">Anexo</p>

      {imageId ? (
        <div className="flex items-center gap-sm">
          <button onClick={handleOpen} className="shrink-0" aria-label={isPdf ? 'Abrir PDF' : 'Ver imagem'} disabled={!url}>
            {isPdf ? (
              <span className="w-16 h-16 rounded-md border border-hairline dark:border-hairline-dark bg-surface-strong dark:bg-white/10 flex items-center justify-center">
                <FileText size={24} className="text-ink dark:text-on-dark" />
              </span>
            ) : url ? (
              <img src={url} alt="Anexo" className="w-16 h-16 rounded-md object-cover border border-hairline dark:border-hairline-dark" />
            ) : (
              <span className="w-16 h-16 rounded-md border border-hairline dark:border-hairline-dark bg-surface-strong dark:bg-white/10 animate-pulse" />
            )}
          </button>
          <div className="flex flex-col gap-xs min-w-0">
            {nomeArquivo && <p className="text-body-sm text-ink dark:text-on-dark truncate">{nomeArquivo}</p>}
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
          disabled={uploading}
          className="inline-flex items-center gap-xs h-10 px-base rounded-md border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-sm text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5 disabled:opacity-60"
        >
          <Camera size={16} /> {uploading ? 'Enviando…' : 'Anexar imagem ou PDF'}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />

      {createPortal(
        <AnimatePresence>
          {lightboxOpen && url && !isPdf && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-lg"
              onClick={() => setLightboxOpen(false)}
              variants={backdrop}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-lg right-lg p-xs rounded-full bg-white/10 active:bg-white/20"
                aria-label="Fechar"
              >
                <X size={22} className="text-white" />
              </button>
              <motion.img
                src={url}
                alt="Anexo"
                className="max-w-full max-h-full rounded-lg object-contain"
                variants={popIn}
                initial="hidden"
                animate="show"
                exit="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
