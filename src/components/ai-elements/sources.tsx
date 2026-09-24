import type { ComponentProps } from 'react'
import { BookIcon, ChevronDownIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@site/src/components/ui/collapsible'
import { cn } from '@site/src/lib/utils.js'

export type SourcesProps = ComponentProps<typeof Collapsible>

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn('not-prose mb-2 text-xs text-primary', className)}
    {...props}
  />
)

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number
}

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn('flex items-center gap-2', className)}
    {...props}
  >
    {children ?? (
      <>
        <p className="m-0 font-medium">
          Used {count} {count === 1 ? 'source' : 'sources'}
        </p>
        <ChevronDownIcon className="size-4" />
      </>
    )}
  </CollapsibleTrigger>
)

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      'mt-3 flex w-fit flex-col gap-2',
      'outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
      className
    )}
    {...props}
  />
)

export type SourceProps = ComponentProps<'a'>

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    {...props}
  >
    {children ?? (
      <>
        <BookIcon className="size-4 shrink-0" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
)
