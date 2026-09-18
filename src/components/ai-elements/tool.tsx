import type { DynamicToolUIPart, ToolUIPart } from 'ai'
import type { ComponentProps, ReactNode } from 'react'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@site/src/components/ui/collapsible'
import { cn } from '@site/src/lib/utils.js'

export type ToolProps = ComponentProps<typeof Collapsible>

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn('group not-prose w-full rounded-md', className)}
    {...props}
  />
)

export type ToolPart = ToolUIPart | DynamicToolUIPart

const statusIcons: Record<ToolPart['state'], ReactNode> = {
  'approval-requested': <ClockIcon className="size-4 text-yellow-600" />,
  'approval-responded': <CheckCircleIcon className="size-4 text-blue-600" />,
  'input-available': <ClockIcon className="size-4 animate-pulse" />,
  'input-streaming': <CircleIcon className="size-4" />,
  'output-available': <CheckCircleIcon className="size-4 text-green-600" />,
  'output-denied': <XCircleIcon className="size-4 text-orange-600" />,
  'output-error': <XCircleIcon className="size-4 text-red-600" />,
}

export const getStatusIcon = (status: ToolPart['state']) => statusIcons[status]

export type ToolHeaderProps = ComponentProps<typeof CollapsibleTrigger> & {
  state: ToolPart['state']
  title: ReactNode
  icon?: ReactNode
}

export const ToolHeader = ({
  className,
  title,
  state,
  icon,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex w-full items-center justify-between gap-4 py-1 text-left',
      className
    )}
    {...props}
  >
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0">{icon ?? getStatusIcon(state)}</span>
      <span className="truncate text-sm text-muted-foreground">{title}</span>
    </div>
    <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
)

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      'space-y-2 py-1 pl-6 text-sm text-foreground outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
      className
    )}
    {...props}
  />
)
