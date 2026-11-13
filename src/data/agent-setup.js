/**
 * The "Connect your coding agent" instructions, shown on the docs home and on
 * the Working with AI page by <AgentSetup>. One copy, so the two pages can't
 * drift apart.
 */

/** Installs the Snowplow MCP server and skills. See /docs/ai/ */
export const INSTALL_COMMAND = 'npx plugins add snowplow/skills'

/**
 * The AGENTS.md snippet. Agents only read llms.txt when they're told to, so
 * the snippet tells them where it is and what to do with it.
 */
export function agentsSnippet(siteUrl = 'https://docs.snowplow.io') {
  const url = siteUrl.replace(/\/$/, '')
  return `## Snowplow

- Before you write Snowplow tracking, schema, pipeline, or Signals code, fetch ${url}/llms.txt and follow its "Instructions for AI agents" section.
- Find pages through the product indexes: ${url}/docs/cdi/llms.txt (Snowplow CDI), ${url}/docs/signals/llms.txt (Signals), and ${url}/docs/api-reference/llms.txt (reference).
- Read any docs page as Markdown: replace the trailing slash in its URL with .md.
- Check the package registry for the current version of a tracker or SDK. Don't copy version numbers from examples.
- Say "self-describing event" and "entity", not "unstructured event" or "context".`
}

export const AGENTS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    file: 'CLAUDE.md',
    fileNote: 'in your project root. Claude Code reads it at the start of every session.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    file: 'AGENTS.md',
    fileNote: 'in your project root. Cursor reads it as a project rule.',
  },
  {
    id: 'codex',
    label: 'Codex',
    file: 'AGENTS.md',
    fileNote: 'in your project root. Codex reads it before it starts a task.',
  },
]
