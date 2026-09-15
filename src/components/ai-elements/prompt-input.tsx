import type { ChatStatus } from 'ai'
import type {
  ComponentProps,
  FormEvent,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
} from 'react'
import { useCallback, useState } from 'react'
import { ArrowUpIcon, LoaderCircleIcon, SquareIcon, XIcon } from 'lucide-react'
import { Button } from '@site/src/components/ui/button'
import { Textarea } from '@site/src/components/ui/textarea'
import { cn } from '@site/src/lib/utils.js'

export interface PromptInputMessage {
  text: string
}

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>
}

export const PromptInput = ({
  className,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()
      const form = event.currentTarget
      const formData = new FormData(form)
      const value = formData.get('message')
      const text = typeof value === 'string' ? value : ''
      if (!text.trim()) {
        return
      }
      form.reset()
      try {
        await onSubmit({ text }, event)
      } catch {
        // Keep the composer usable; the chat surface reports errors.
      }
    },
    [onSubmit]
  )

  return (
    <form
      className={cn('w-full', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col overflow-hidden rounded-md border border-solid border-input bg-background focus-within:ring-1 focus-within:ring-ring">
        {children}
      </div>
    </form>
  )
}

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>

export const PromptInputTextarea = ({
  onKeyDown,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const [isComposing, setIsComposing] = useState(false)

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) {
        return
      }
      if (e.key === 'Enter') {
        if (isComposing || e.nativeEvent.isComposing || e.shiftKey) {
          return
        }
        e.preventDefault()
        const { form } = e.currentTarget
        const submitButton = form?.querySelector<HTMLButtonElement>(
          'button[type="submit"]'
        )
        if (submitButton?.disabled) {
          return
        }
        form?.requestSubmit()
      }
    },
    [onKeyDown, isComposing]
  )

  const handleCompositionEnd = useCallback(() => setIsComposing(false), [])
  const handleCompositionStart = useCallback(() => setIsComposing(true), [])

  return (
    <Textarea
      className={cn('max-h-48 min-h-16 [field-sizing:content]', className)}
      name="message"
      onCompositionEnd={handleCompositionEnd}
      onCompositionStart={handleCompositionStart}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={2}
      {...props}
    />
  )
}

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <div
    className={cn('flex items-center justify-between gap-1 p-2', className)}
    {...props}
  />
)

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus
  onStop?: () => void
}

export const PromptInputSubmit = ({
  className,
  variant = 'default',
  size = 'icon-sm',
  status,
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === 'submitted' || status === 'streaming'

  let Icon = <ArrowUpIcon className="size-4" />
  if (status === 'submitted') {
    Icon = <LoaderCircleIcon className="size-4 animate-spin" />
  } else if (status === 'streaming') {
    Icon = <SquareIcon className="size-4" />
  } else if (status === 'error') {
    Icon = <XIcon className="size-4" />
  }

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isGenerating && onStop) {
        e.preventDefault()
        onStop()
        return
      }
      onClick?.(e)
    },
    [isGenerating, onStop, onClick]
  )

  return (
    <Button
      aria-label={isGenerating ? 'Stop generating' : 'Send message'}
      className={cn('rounded-full', className)}
      onClick={handleClick}
      size={size}
      type={isGenerating && onStop ? 'button' : 'submit'}
      variant={isGenerating ? 'outline' : variant}
      {...props}
    >
      {children ?? Icon}
    </Button>
  )
}
