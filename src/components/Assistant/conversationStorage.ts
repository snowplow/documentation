import type { UIMessage } from 'ai'
import { CONVERSATION_STORAGE_KEY, MAX_STORED_BYTES } from './assistantConfig'

export type StoredConversation = {
  id: string
  messages: UIMessage[]
  updatedAt: number
}

const isBrowser = () => typeof window !== 'undefined'

export const loadConversation = (): StoredConversation | null => {
  if (!isBrowser()) return null
  try {
    const raw = window.sessionStorage.getItem(CONVERSATION_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as StoredConversation).id === 'string' &&
      Array.isArray((parsed as StoredConversation).messages)
    ) {
      return parsed as StoredConversation
    }
    return null
  } catch {
    return null
  }
}

const serialize = (conversation: StoredConversation): string =>
  JSON.stringify(conversation)

export const saveConversation = (id: string, messages: UIMessage[]): void => {
  if (!isBrowser()) return
  let trimmed = [...messages]
  let payload = serialize({ id, messages: trimmed, updatedAt: Date.now() })
  while (payload.length > MAX_STORED_BYTES && trimmed.length > 2) {
    trimmed = trimmed.slice(2)
    payload = serialize({ id, messages: trimmed, updatedAt: Date.now() })
  }
  try {
    window.sessionStorage.setItem(CONVERSATION_STORAGE_KEY, payload)
  } catch {
    // Quota exceeded or storage disabled: the conversation simply is not persisted.
  }
}

export const clearConversation = (): void => {
  if (!isBrowser()) return
  try {
    window.sessionStorage.removeItem(CONVERSATION_STORAGE_KEY)
  } catch {
    // Ignore storage errors.
  }
}
