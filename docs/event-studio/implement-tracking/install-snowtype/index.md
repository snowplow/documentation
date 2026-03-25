---
title: "Get started with Snowtype"
sidebar_label: "Install Snowtype"
sidebar_position: 1
description: "Install Snowtype, authenticate with your Snowplow account, and initialize your project."
keywords: ["Snowtype", "install", "setup", "getting started", "code generation", "authenticate", "initialize"]
date: "2026-03-19"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through installing Snowtype and connecting it to your Snowplow account.

To use Snowtype, you need:

- [Node.js](https://nodejs.org/en/) version 18 or later
- A Snowplow CDI account
- A Console API key

## Install Snowtype

Navigate to your project directory and install Snowtype as a development dependency:

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install --save-dev @snowplow/snowtype@latest
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn add --dev @snowplow/snowtype@latest
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm add --save-dev @snowplow/snowtype@latest
```

  </TabItem>
</Tabs>

This adds a local `snowtype` executable to your project. You can run it with `npx`, `yarn`, or `pnpm`:

```bash
npx snowtype --help
```

:::note
The examples on this page use `npx`. Replace with `yarn` or `pnpm` if you prefer.
:::

## Authenticate

Snowtype needs a Console API key to read your event specifications and data structures. You can create or find your API key in [Console](https://console.snowplowanalytics.com/settings).

You need both the **API key** and the **API key ID**.

The recommended approach is to set them as environment variables, either in your shell or in a `.env` file at the root of your project:

<Tabs groupId="api-key">
  <TabItem value="env-file" label=".env file" default>

```bash
SNOWPLOW_CONSOLE_API_KEY=your-api-key
SNOWPLOW_CONSOLE_API_KEY_ID=your-api-key-id
```

  </TabItem>
  <TabItem value="shell" label="Shell variable">

```bash
export SNOWPLOW_CONSOLE_API_KEY=your-api-key
export SNOWPLOW_CONSOLE_API_KEY_ID=your-api-key-id
```

  </TabItem>
</Tabs>

You can also pass the credentials directly as CLI flags (`--apiKey` and `--apiKeyId`), but environment variables are easier to manage and keep credentials out of your command history.

## Initialize your project

Run `snowtype init` to create a configuration file for your project:

```bash
npx snowtype init
```

The command will prompt you for:

- Your **organization ID** from Console
- The **tracker** you want to generate code for, e.g. `@snowplow/browser-tracker`
- The **language** for that tracker, if applicable, e.g. `typescript`
- The **output path** where Snowtype should write the generated code

Snowtype saves these choices to a `snowtype.config.json` file in your project root. You can edit this file directly later, or pass the values as flags to skip the prompts. See the [configuration reference](/docs/event-studio/implement-tracking/configuration-reference/index.md) for all available options.
