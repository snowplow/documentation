import React from 'react'
import clsx from 'clsx'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

/** Labels for common fence languages, used when a block has no title */
const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  java: 'Java',
  swift: 'Swift',
  objc: 'Objective-C',
  dart: 'Dart',
  go: 'Go',
  rb: 'Ruby',
  ruby: 'Ruby',
  php: 'PHP',
  cs: 'C#',
  csharp: 'C#',
  cpp: 'C++',
  rust: 'Rust',
  scala: 'Scala',
  lua: 'Lua',
  sql: 'SQL',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  hcl: 'HCL',
  html: 'HTML',
}

interface CodeProps {
  className?: string
  metastring?: string
  children?: React.ReactNode
  [key: string]: unknown
}

function codeElementOf(child: React.ReactElement): React.ReactElement<CodeProps> | null {
  // A fenced block in MDX is <pre><code className="language-x" metastring="..."></code></pre>
  const inner = (child.props as { children?: React.ReactNode }).children
  if (React.isValidElement(inner)) return inner as React.ReactElement<CodeProps>
  return null
}

function parseTitle(metastring = ''): string | undefined {
  return metastring.match(/title=(["'])(.*?)\1/)?.[2]
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Language tabs for a set of code blocks that do the same thing. The tabs sit
 * in the code header, and the choice is shared and remembered across the site
 * for the same `groupId` (the same storage as <Tabs groupId>).
 *
 * ```mdx
 * <CodeGroup>
 *
 * ```js title="Browser"
 * ...
 * ```
 *
 * ```kotlin title="Android"
 * ...
 * ```
 *
 * </CodeGroup>
 * ```
 *
 * Each tab is labeled with the block's title, or its language when it has no
 * title.
 */
export default function CodeGroup({
  children,
  groupId = 'code-language',
  className,
}: {
  children: React.ReactNode
  groupId?: string
  className?: string
}): JSX.Element {
  const blocks = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement[]

  const items = blocks.map((block, index) => {
    const code = codeElementOf(block)
    const language = code?.props.className?.match(/language-(\S+)/)?.[1]
    const title = parseTitle(code?.props.metastring)
    const label = title ?? (language ? LANGUAGE_LABELS[language] ?? language : `Example ${index + 1}`)
    // Drop the title from the code block: the tab already shows it
    const content =
      code && title
        ? React.cloneElement(block, {
            children: React.cloneElement(code, {
              metastring: code.props.metastring?.replace(/title=(["']).*?\1/, '').trim(),
            }),
          } as Record<string, unknown>)
        : block
    return { value: slug(label) || `example-${index + 1}`, label, content }
  })

  if (items.length === 0) return <></>

  return (
    <div className={clsx('sp-code-group', className)}>
      <Tabs groupId={groupId} className="sp-code-group__tabs">
        {items.map((item, index) => (
          <TabItem key={item.value} value={item.value} label={item.label} default={index === 0}>
            {item.content}
          </TabItem>
        ))}
      </Tabs>
    </div>
  )
}
