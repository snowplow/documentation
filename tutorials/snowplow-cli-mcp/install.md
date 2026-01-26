---
position: 2
title: "Install the Snowplow CLI and configure an MCP client"
sidebar_label: "Install the Snowplow CLI"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To use the Snowplow MCP tools with your AI assistant, you'll need to install and authenticate the [Snowplow CLI](/docs/event-studio/snowplow-cli).

## Install

You have three options for running the Snowplow CLI:
* Install via Homebrew
* Run via `npx` - no installation required if you have `node.js` set up
* Download the binary directly (not recommended)

<Tabs groupId="install-method" queryString>
  <TabItem value="homebrew" label="Homebrew" default>

    ```bash
    brew install snowplow/taps/snowplow-cli

    # Run using
    snowplow-cli
    ```

  </TabItem>
  <TabItem value="npx" label="npx">

    ```bash
    # Run using
    npx -y @snowplow/snowplow-cli
    ```

  </TabItem>
  <TabItem value="direct" label="Direct download">

    ```bash
    curl -L -o snowplow-cli https://github.com/snowplow/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64
    chmod u+x snowplow-cli

    # Run using
    snowplow-cli
    ```

  </TabItem>
</Tabs>

## Authenticate

Use the built-in `setup` command to authenticate the Snowplow CLI with your Snowplow account:

```bash
snowplow-cli setup
```

For more details on configuring the Snowplow CLI, check out the [main documentation](/docs/event-studio/snowplow-cli).
