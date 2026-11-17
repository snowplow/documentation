---
title: "Set up Signals in your project with one Snowplow CLI command"
sidebar_label: "Signals setup in Snowplow CLI"
description: "The new snowplow-cli signals setup command writes Signals credentials to your project, installs the Snowplow plugin in your coding agent, and starts the agent with a setup prompt."
keywords: ["snowplow cli", "signals setup", "coding agent", "snowplow mcp", "release notes"]
date: "2026-11-10"
category:
  - "Release notes"
components:
  - "Signals"
  - "Developer tools"
---

Snowplow CLI has a new `signals setup` command. Run it in your project's root directory to get the project and your coding agent ready for Signals:

```bash
npx @snowplow/snowplow-cli signals setup
```

The command logs you in to Console, creates an API key with Signals permissions only, and writes the connection values to `.env`. It then installs the Snowplow plugin in Claude Code, Cursor, or Codex, and offers to start your agent with a prompt that adds the tracking, the Signals configuration, and the code that uses it.

The new `signals status` command checks that the credentials in `.env` work.

The setup command needs Node.js 18 or later. See the [Signals quickstart](/docs/signals/quickstart/) and the [command reference](/docs/api-reference/snowplow-cli/reference/#signals-setup).
