import React from 'react'
import type { UIMessage } from 'ai'
import { isToolUIPart } from 'ai'
import { MessageResponse } from '@site/src/components/ai-elements/message'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@site/src/components/ai-elements/sources'
import { AssistantLink } from './AssistantLink'
import { ToolActivity } from './ToolActivity'

type MessagePartsProps = {
  message: UIMessage
  isLastMessage: boolean
  isStreaming: boolean
}

const markdownComponents = { a: AssistantLink }

export const MessageParts = ({
  message,
  isLastMessage,
  isStreaming,
}: MessagePartsProps) => {
  const sourceParts = message.parts.filter((part) => part.type === 'source-url')
  const lastPart = message.parts.at(-1)
  const isTextStreaming =
    isLastMessage && isStreaming && lastPart?.type === 'text'

  return (
    <>
      {sourceParts.length > 0 && (
        <Sources>
          <SourcesTrigger count={sourceParts.length} />
          <SourcesContent>
            {sourceParts.map((part) => (
              <Source
                key={part.sourceId}
                href={part.url}
                title={part.title ?? part.url}
              />
            ))}
          </SourcesContent>
        </Sources>
      )}

      {message.parts.map((part, index) => {
        const key = `${message.id}-${index}`

        if (part.type === 'text') {
          if (message.role !== 'assistant') {
            return (
              <span key={key} className="whitespace-pre-wrap">
                {part.text}
              </span>
            )
          }
          return (
            <MessageResponse
              key={key}
              mode="streaming"
              isAnimating={
                isTextStreaming && index === message.parts.length - 1
              }
              components={markdownComponents}
              linkSafety={{ enabled: false }}
              controls={{ code: true, table: false, mermaid: false }}
            >
              {part.text}
            </MessageResponse>
          )
        }

        if (isToolUIPart(part)) {
          return <ToolActivity key={key} part={part} />
        }

        return null
      })}
    </>
  )
}
