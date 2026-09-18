import React from 'react'
import { SparklesIcon } from 'lucide-react'
import {
  prefetchAssistantDrawer,
  useOptionalAssistant,
} from './AssistantContext'

export default function AskAiNavbarItem() {
  const assistant = useOptionalAssistant()
  if (!assistant) return null

  return (
    <button
      type="button"
      className="sp-assistant-navbar-button"
      aria-label="Ask the Snowplow AI assistant"
      aria-haspopup="dialog"
      aria-expanded={assistant.isOpen}
      data-sp-button-label="assistant_open"
      onClick={assistant.open}
      onMouseEnter={prefetchAssistantDrawer}
      onFocus={prefetchAssistantDrawer}
    >
      <SparklesIcon className="sp-assistant-navbar-icon" aria-hidden="true" />
      <span className="sp-assistant-navbar-label">Ask AI</span>
    </button>
  )
}
