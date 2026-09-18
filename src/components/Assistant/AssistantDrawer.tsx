import React, { useEffect, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useWindowSize } from '@docusaurus/theme-common'
import { SquarePenIcon, XIcon } from 'lucide-react'
import { Button } from '@site/src/components/ui/button'
import { cn } from '@site/src/lib/utils.js'
import { AssistantChat } from './AssistantChat'
import { useAssistant } from './AssistantContext'
import { trackAssistantClosed, trackAssistantOpened } from './tracking'
import { useAssistantChat } from './useAssistantChat'
import { useResizableWidth } from './useResizableWidth'

const OPEN_CLASS = 'sp-assistant-open'

export default function AssistantDrawer() {
  const { isOpen, close } = useAssistant()
  const chat = useAssistantChat()
  const windowSize = useWindowSize()
  const isMobile = windowSize === 'mobile'
  const resize = useResizableWidth()
  const previousOpen = useRef(false)

  useEffect(() => {
    if (isOpen && !previousOpen.current) {
      trackAssistantOpened(chat.conversationId)
    } else if (!isOpen && previousOpen.current) {
      trackAssistantClosed(chat.conversationId)
    }
    previousOpen.current = isOpen
  }, [isOpen, chat.conversationId])

  useEffect(() => {
    document.documentElement.classList.toggle(OPEN_CLASS, isOpen)
    return () => document.documentElement.classList.remove(OPEN_CLASS)
  }, [isOpen])

  const isBusy = chat.status === 'submitted' || chat.status === 'streaming'

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      modal={isMobile}
    >
      <DialogPrimitive.Portal>
        {isMobile && (
          <DialogPrimitive.Overlay className="sp-assistant fixed inset-0 z-[100000] bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        )}
        <DialogPrimitive.Content
          style={
            {
              '--sp-assistant-width': `${resize.width}px`,
            } as React.CSSProperties
          }
          className={cn(
            'sp-assistant fixed inset-y-0 right-0 z-[100001] flex h-dvh w-full flex-col border-0 border-l border-solid border-border bg-background text-foreground shadow-xl',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right motion-reduce:animate-none',
            'min-[997px]:w-[var(--sp-assistant-width)] min-[997px]:max-w-[calc(100vw-2rem)]',
            resize.isResizing && 'select-none'
          )}
          onInteractOutside={(event) => {
            if (!isMobile) event.preventDefault()
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            const content = event.currentTarget
            if (content instanceof HTMLElement) {
              content.querySelector('textarea')?.focus()
            }
          }}
        >
          {!isMobile && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize assistant panel. Drag, or use the left and right arrow keys."
              aria-valuenow={resize.width}
              aria-valuemin={resize.minWidth}
              aria-valuemax={resize.maxWidth()}
              tabIndex={0}
              title="Drag to resize. Double-click to reset."
              onPointerDown={resize.startResize}
              onKeyDown={resize.onHandleKeyDown}
              onDoubleClick={resize.resetWidth}
              className={cn(
                'absolute inset-y-0 left-0 z-10 w-2 -translate-x-1/2 cursor-col-resize touch-none outline-none',
                'after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-transparent after:transition-colors after:content-[""]',
                'hover:after:bg-primary/60 focus-visible:after:bg-primary',
                resize.isResizing && 'after:bg-primary'
              )}
            />
          )}
          <header className="flex items-center justify-between gap-2 border-0 border-b border-solid border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <DialogPrimitive.Title className="m-0 text-base font-semibold">
                Snowplow Assistant
              </DialogPrimitive.Title>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Beta
              </span>
            </div>
            <DialogPrimitive.Description className="sr-only">
              Ask questions about Snowplow and get answers grounded in the
              documentation.
            </DialogPrimitive.Description>
            <div className="flex items-center gap-1">
              {chat.messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="New conversation"
                  title="New conversation"
                  disabled={isBusy}
                  data-sp-button-label="assistant_new_conversation"
                  onClick={chat.startNewConversation}
                >
                  <SquarePenIcon className="size-4" />
                </Button>
              )}
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close assistant"
                  title="Close assistant"
                  data-sp-button-label="assistant_close"
                >
                  <XIcon className="size-4" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </header>
          <AssistantChat chat={chat} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
