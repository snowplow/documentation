import type { ComponentProps } from 'react'
import { useCallback } from 'react'
import { Button } from '@site/src/components/ui/button'
import { cn } from '@site/src/lib/utils.js'

export type SuggestionsProps = ComponentProps<'div'>

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <div
    className={cn('flex flex-wrap items-center gap-2', className)}
    {...props}
  >
    {children}
  </div>
)

export type SuggestionProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  suggestion: string
  onClick?: (suggestion: string) => void
}

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = 'outline',
  size = 'sm',
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion)
  }, [onClick, suggestion])

  return (
    <Button
      className={cn(
        'h-auto cursor-pointer whitespace-normal rounded-full px-4 py-1.5 text-left',
        className
      )}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  )
}
