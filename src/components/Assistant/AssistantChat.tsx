import React, { useEffect, useMemo, useState } from 'react'
import { SparklesIcon } from 'lucide-react'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@site/src/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
} from '@site/src/components/ai-elements/message'
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@site/src/components/ai-elements/prompt-input'
import { Shimmer } from '@site/src/components/ai-elements/shimmer'
import {
  Suggestion,
  Suggestions,
} from '@site/src/components/ai-elements/suggestion'
import { Button } from '@site/src/components/ui/button'
import { MessageParts } from './MessageParts'
import { STARTER_PROMPTS } from './starterPrompts'
import { trackPromptSubmitted, trackSuggestionClicked } from './tracking'
import type { AssistantChatState } from './useAssistantChat'

type ParsedError = {
  status?: number
  message: string
  retryAfter?: number
}

const parseError = (error: Error): ParsedError => {
  try {
    const parsed: unknown = JSON.parse(error.message)
    if (typeof parsed === 'object' && parsed !== null) {
      const body = parsed as {
        error?: unknown
        status?: unknown
        retryAfter?: unknown
      }
      return {
        message:
          typeof body.error === 'string' ? body.error : 'Something went wrong.',
        ...(typeof body.status === 'number' ? { status: body.status } : {}),
        ...(typeof body.retryAfter === 'number'
          ? { retryAfter: body.retryAfter }
          : {}),
      }
    }
  } catch {
    // Not a JSON error body from the worker.
  }
  return { message: 'Something went wrong.' }
}

const useCountdown = (seconds: number | undefined, onDone: () => void) => {
  const [remaining, setRemaining] = useState(seconds ?? 0)
  useEffect(() => {
    if (seconds === undefined) return
    setRemaining(seconds)
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          onDone()
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds, onDone])
  return remaining
}

const AssistantError = ({
  error,
  onRetry,
  onDismiss,
}: {
  error: Error
  onRetry: () => void
  onDismiss: () => void
}) => {
  const parsed = useMemo(() => parseError(error), [error])
  const remaining = useCountdown(
    parsed.status === 429 ? parsed.retryAfter ?? 60 : undefined,
    onDismiss
  )

  if (parsed.status === 429) {
    return (
      <div className="rounded-md border border-solid border-border bg-muted p-3 text-sm text-foreground">
        You've sent a lot of questions in a short time. You can ask again in{' '}
        {remaining}s.
      </div>
    )
  }

  const message =
    parsed.status === 413
      ? 'That message is too long. Try a shorter question.'
      : parsed.status === 503
      ? 'The assistant is unavailable right now. Please try again later.'
      : 'Something went wrong.'

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-solid border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
      <span>{message}</span>
      <div className="ml-auto flex gap-1">
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

export const AssistantChat = ({ chat }: { chat: AssistantChatState }) => {
  const {
    conversationId,
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    stop,
    clearError,
  } = chat
  const isBusy = status === 'submitted' || status === 'streaming'
  const rateLimited = useMemo(
    () => (error ? parseError(error).status === 429 : false),
    [error]
  )

  const submit = (text: string) => {
    if (status !== 'ready' || !text.trim()) return
    trackPromptSubmitted(conversationId)
    void sendMessage({ text })
  }

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
              <ConversationEmptyState
                icon={<SparklesIcon className="size-8" />}
                title="Ask about Snowplow"
                description="Answers are grounded in these docs and link to the pages they used."
              />
              <Suggestions className="justify-center px-2">
                {STARTER_PROMPTS.map((starter) => (
                  <Suggestion
                    key={starter.prompt}
                    suggestion={starter.prompt}
                    data-sp-button-label="assistant_suggestion"
                    onClick={(prompt) => {
                      trackSuggestionClicked(conversationId, starter.label)
                      submit(prompt)
                    }}
                  >
                    {starter.label}
                  </Suggestion>
                ))}
              </Suggestions>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={status === 'streaming'}
                  />
                </MessageContent>
              </Message>
            ))
          )}
          {status === 'submitted' && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer as="span" className="text-sm">
                  Thinking…
                </Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <AssistantError
              error={error}
              onRetry={() => void regenerate()}
              onDismiss={clearError}
            />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-0 border-t border-solid border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <PromptInput
          className="sp-assistant-form"
          onSubmit={(message) => submit(message.text)}
        >
          <PromptInputTextarea
            placeholder="Ask a question about Snowplow…"
            aria-label="Ask a question about Snowplow"
            disabled={rateLimited}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && status !== 'ready') {
                e.preventDefault()
              }
            }}
          />
          <PromptInputFooter>
            <span className="text-xs text-muted-foreground">
              Enter to send, Shift+Enter for a new line
            </span>
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={rateLimited || (!isBusy && status !== 'ready')}
              data-sp-button-label={
                isBusy ? 'assistant_stop' : 'assistant_send'
              }
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="m-0 mt-2 text-xs text-muted-foreground">
          AI-generated answers can be wrong. Check the linked documentation
          before relying on them.
        </p>
      </div>
    </>
  )
}
