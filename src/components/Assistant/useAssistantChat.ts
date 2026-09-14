import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { DefaultChatTransport, generateId, isToolUIPart } from 'ai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantApiUrl } from './assistantConfig'
import {
  clearConversation,
  loadConversation,
  saveConversation,
} from './conversationStorage'
import { usePageContext } from './usePageContext'

const TOOL_OUTPUT_PLACEHOLDER = '[documentation content omitted]'

const stripToolOutputs = (messages: UIMessage[]): UIMessage[] =>
  messages.map((message) =>
    message.role === 'assistant'
      ? {
          ...message,
          parts: message.parts.map((part) =>
            isToolUIPart(part) && part.state === 'output-available'
              ? { ...part, output: TOOL_OUTPUT_PLACEHOLDER }
              : part
          ),
        }
      : message
  )

export const useAssistantChat = () => {
  const apiUrl = useAssistantApiUrl()
  const pageContext = usePageContext()
  const pageContextRef = useRef(pageContext)
  pageContextRef.current = pageContext

  const [stored] = useState(() => loadConversation())
  const [conversationId, setConversationId] = useState(
    () => stored?.id ?? generateId()
  )
  const conversationIdRef = useRef(conversationId)
  conversationIdRef.current = conversationId

  const transportRef = useRef(
    new DefaultChatTransport({
      api: apiUrl,
      credentials: 'same-origin',
      body: () => ({ pageContext: pageContextRef.current }),
      prepareSendMessagesRequest: ({
        id,
        messages,
        body,
        trigger,
        messageId,
      }) => ({
        body: {
          ...body,
          id,
          trigger,
          messageId,
          messages: stripToolOutputs(messages),
        },
      }),
    })
  )

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    regenerate,
    stop,
    clearError,
  } = useChat({
    id: conversationId,
    messages: stored?.messages ?? [],
    transport: transportRef.current,
    onFinish({ messages: finished }) {
      saveConversation(conversationIdRef.current, finished)
    },
  })

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.role === 'user') {
      saveConversation(conversationIdRef.current, messages)
    }
  }, [messages])

  const startNewConversation = useCallback(() => {
    stop()
    clearConversation()
    setMessages([])
    setConversationId(generateId())
  }, [setMessages, stop])

  return {
    conversationId,
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    stop,
    clearError,
    startNewConversation,
  }
}

export type AssistantChatState = ReturnType<typeof useAssistantChat>
