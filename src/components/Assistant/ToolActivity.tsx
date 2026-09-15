import React from 'react'
import type { DynamicToolUIPart, ToolUIPart } from 'ai'
import { getToolName } from 'ai'
import { CircleCheckIcon, CircleXIcon, LoaderCircleIcon } from 'lucide-react'
import {
  Tool,
  ToolContent,
  ToolHeader,
} from '@site/src/components/ai-elements/tool'
import { Shimmer } from '@site/src/components/ai-elements/shimmer'
import { AssistantLink } from './AssistantLink'

type ToolPart = ToolUIPart | DynamicToolUIPart

const DOCS_ORIGIN = 'https://docs.snowplow.io'

const readPath = (input: unknown): string | undefined => {
  if (typeof input !== 'object' || input === null) return undefined
  const path = (input as { path?: unknown }).path
  return typeof path === 'string' ? path : undefined
}

const titleFromOutput = (output: unknown): string | undefined => {
  if (typeof output !== 'string') return undefined
  const heading = output.split('\n').find((line) => line.startsWith('# '))
  return heading?.slice(2).trim() || undefined
}

const titleFromPath = (path: string | undefined): string | undefined => {
  if (!path) return undefined
  const segment = path
    .replace(/\.md$/, '')
    .split('/')
    .filter((part) => part && part !== 'index')
    .at(-1)
  return segment
    ? segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
    : undefined
}

const pageUrl = (path: string | undefined): string | undefined =>
  path ? `${DOCS_ORIGIN}${path.replace(/\.md$/, '/')}` : undefined

export const ToolActivity = ({ part }: { part: ToolPart }) => {
  const toolName = getToolName(part)
  const isIndex = toolName === 'fetch_documentation_index'
  const path = readPath(part.input)
  const title =
    (part.state === 'output-available'
      ? titleFromOutput(part.output)
      : undefined) ?? titleFromPath(path)
  const url = pageUrl(path)

  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <div className="flex items-center gap-2 py-1">
        <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-muted-foreground" />
        <Shimmer as="span" className="text-sm">
          {isIndex
            ? 'Loading the documentation index…'
            : title
            ? `Searching documentation: ${title}…`
            : 'Searching documentation…'}
        </Shimmer>
      </div>
    )
  }

  if (part.state === 'output-error') {
    return (
      <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
        <CircleXIcon className="size-4 shrink-0 text-red-600" />
        <span>
          {isIndex
            ? "Couldn't load the documentation index"
            : "Couldn't load a documentation page"}
        </span>
      </div>
    )
  }

  if (part.state === 'output-available') {
    const label = isIndex
      ? 'Loaded the documentation index'
      : `Searched documentation: ${title ?? 'Snowplow docs'}`
    if (!url || isIndex) {
      return (
        <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
          <CircleCheckIcon className="size-4 shrink-0 text-green-600" />
          <span className="truncate">{label}</span>
        </div>
      )
    }
    return (
      <Tool>
        <ToolHeader
          state={part.state}
          title={label}
          icon={<CircleCheckIcon className="size-4 text-green-600" />}
        />
        <ToolContent>
          <AssistantLink href={url} className="text-xs">
            {url}
          </AssistantLink>
        </ToolContent>
      </Tool>
    )
  }

  return null
}
