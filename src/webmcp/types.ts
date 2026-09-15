// Minimal typings for the WebMCP browser API, a W3C Web Machine Learning
// Community Group draft: https://webmachinelearning.github.io/webmcp/
//
// Only the slice of the API this site uses is declared here, so the site
// doesn't take a dependency on a spec that is still changing. The draft moved
// the entry point from `navigator.modelContext` to `document.modelContext`, so
// `getModelContext` looks for both.

// Hints the agent uses when deciding whether a tool needs confirmation.
export type ToolAnnotations = {
  readOnlyHint?: boolean
  untrustedContentHint?: boolean
  consequentialHint?: boolean
}

export type JsonSchema = {
  type: 'object'
  properties: Record<string, Record<string, unknown>>
  required?: string[]
}

export type WebMcpTool = {
  name: string
  description: string
  inputSchema: JsonSchema
  annotations?: ToolAnnotations
  // Whatever this resolves with is serialized to JSON once by the browser and
  // handed to the agent, so tools return plain data.
  execute: (
    input?: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ) => Promise<unknown>
}

type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal }
  ) => Promise<void>
}

type WebMcpDocument = Document & { modelContext?: ModelContext }
type WebMcpNavigator = Navigator & { modelContext?: ModelContext }

// Returns the browser's model context, or null when the browser has no WebMCP
// support. The tools are a progressive enhancement: readers without an agent
// never notice them.
export function getModelContext(): ModelContext | null {
  if (typeof document === 'undefined') {
    return null
  }
  const fromDocument = (document as WebMcpDocument).modelContext
  if (fromDocument) {
    return fromDocument
  }
  return (navigator as WebMcpNavigator).modelContext ?? null
}

// Tool arguments arrive as untyped JSON. These throw on bad input; `reportErrors`
// turns that into an `error` field the agent can read. A rejected `execute` would
// not: the browser replaces the reason with a bare `UnknownError`, losing the
// message.
export function readString(
  input: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = input?.[key]
  if (value === undefined || value === null) {
    return undefined
  }
  if (typeof value !== 'string') {
    throw new Error(`\`${key}\` must be a string, got ${typeof value}.`)
  }
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

export function requireString(
  input: Record<string, unknown> | undefined,
  key: string
): string {
  const value = readString(input, key)
  if (value === undefined) {
    throw new Error(`\`${key}\` is required and must be a non-empty string.`)
  }
  return value
}

export function readNumber(
  input: Record<string, unknown> | undefined,
  key: string
): number | undefined {
  const value = input?.[key]
  if (value === undefined || value === null) {
    return undefined
  }
  const parsed = typeof value === 'string' ? Number(value) : value
  if (typeof parsed !== 'number' || !Number.isFinite(parsed)) {
    throw new Error(`\`${key}\` must be a number.`)
  }
  return parsed
}

// Wraps a tool so a thrown message comes back as data the agent can act on.
export function reportErrors(tool: WebMcpTool): WebMcpTool {
  return {
    ...tool,
    async execute(input, options) {
      try {
        return await tool.execute(input, options)
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) }
      }
    },
  }
}
