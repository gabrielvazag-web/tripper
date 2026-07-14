import { createStore, get, set, del } from 'idb-keyval'
import { newId } from '../lib/id'

const store = createStore('africatrip-images', 'anexos')

/** Salva qualquer arquivo (foto ou PDF) localmente e devolve o id pra referenciar depois. */
export async function saveAttachment(file: File): Promise<string> {
  const id = newId('img')
  await set(id, file, store)
  return id
}

export async function getAttachmentBlob(id: string): Promise<Blob | undefined> {
  return get<Blob>(id, store)
}

export async function deleteAttachment(id: string): Promise<void> {
  await del(id, store)
}
