---
title: "Get started with Snowtype"
sidebar_label: "Get started"
sidebar_position: 1
description: "Install Snowtype, authenticate with your Snowplow account, and generate tracking code for the first time."
keywords: ["Snowtype", "install", "setup", "getting started", "code generation"]
date: "2026-03-19"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through installing Snowtype, connecting it to your Snowplow account, and generating tracking code for the first time.

## Prerequisites

To use Snowtype, you need:

- [Node.js](https://nodejs.org/en/) version 18 or later
- A Snowplow CDI account with a Console API key

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
- The **tracker** you want to generate code for (for example, `@snowplow/browser-tracker`)
- The **language** for that tracker, if applicable (for example, `typescript`)
- The **output path** where Snowtype should write the generated code

Snowtype saves these choices to a `snowtype.config.json` file in your project root. You can edit this file directly later, or pass the values as flags to skip the prompts. See the configuration reference ADD LINK for all available options.

:::tip
If you use the Console, you can also find initialization commands on the **Implementation** tab of any [event specification](/docs/event-studio/tracking-plans/event-specifications/index.md), pre-filled with the correct IDs.
:::

## Generate code for the first time

Before generating, add at least one input source to your configuration file ADD LINK.

The easiest way to do this is to find the `snowtype patch` command for the tracking plan you want to add. TODO

Snowtype can generate code from several sources:

- **Event specifications** — add their IDs to the `eventSpecificationIds` array
- **Tracking plans** — add their IDs to the `dataProductIds` array to include all event specifications in the plan
- **Data structures** — add their schema tracking URLs to the `dataStructures` array
- **Iglu Central schemas** — add their schema tracking URLs to the `igluCentralSchemas` array

You can find these IDs and URLs in Console, or use `snowtype patch` to add them interactively. See Generate tracking code ADD LINK for details on each source.

Once your configuration file includes at least one source, generate the code:

```bash
npx snowtype generate
```

Snowtype creates a file at your configured output path containing:

- **Types and interfaces** for each schema, so your editor can validate property names and types
- **Tracking functions** for each event, so you can track events with a single function call instead of constructing payloads manually
- **Entity constructors** for each data structure, so you can create entities to attach to events

The generated code expects the relevant [Snowplow tracker](/docs/sources/index.md) to already be installed in your project. Snowtype doesn't install trackers for you.

:::note
The first time you run `generate`, Snowtype creates a `.snowtype-lock.json` file next to your configuration file. This pins the schema versions used for generation, so subsequent runs produce consistent output. To check for newer schema versions, use `snowtype update` ADD LINK.
:::
