import { supabase } from '../lib/supabase'

const BUCKET = 'anexos'

/** Sobe um arquivo (foto ou PDF) pro Storage da viagem e devolve o caminho pra guardar no lugar de imagemId. */
export async function saveAttachment(tripId: string, file: File): Promise<string> {
  const path = `${tripId}/${crypto.randomUUID()}/${file.name}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error
  return path
}

/** URL assinada temporária (1h) pra exibir/abrir o arquivo. */
export async function getAttachmentUrl(path: string): Promise<string | undefined> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60)
  if (error) return undefined
  return data.signedUrl
}

export async function deleteAttachment(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path])
}

export function attachmentFileName(path: string): string {
  return path.split('/').pop() ?? path
}

export function isPdfPath(path: string): boolean {
  return path.toLowerCase().endsWith('.pdf')
}
