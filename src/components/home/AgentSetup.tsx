import React from 'react'
import clsx from 'clsx'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { AGENTS, INSTALL_COMMAND, agentsSnippet } from '@site/src/data/agent-setup'

/**
 * Tabs for Claude Code, Cursor, and Codex: install the Snowplow MCP server
 * and skills, then add the AGENTS.md snippet that points the agent at
 * llms.txt. Used on the docs home and on the Working with AI page.
 */
export default function AgentSetup({ compact = false }: { compact?: boolean }): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  const snippet = agentsSnippet(siteConfig.url)

  return (
    <div className={clsx('agent-setup', compact && 'agent-setup--compact')}>
      <Tabs groupId="coding-agent">
        {AGENTS.map((agent, index) => (
          <TabItem key={agent.id} value={agent.id} label={agent.label} default={index === 0}>
            <ol className="agent-setup__steps">
              <li>
                <p>Install the Snowplow MCP server and skills:</p>
                <CodeBlock language="bash">{INSTALL_COMMAND}</CodeBlock>
              </li>
              <li>
                <p>
                  Add this to <code>{agent.file}</code> {agent.fileNote}
                </p>
                <CodeBlock language="markdown" title={agent.file}>
                  {snippet}
                </CodeBlock>
              </li>
            </ol>
          </TabItem>
        ))}
      </Tabs>
    </div>
  )
}
