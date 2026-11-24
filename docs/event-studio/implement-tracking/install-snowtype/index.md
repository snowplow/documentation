---
title: "Get started with Snowtype"
sidebar_label: "Install Snowtype"
sidebar_position: 1
description: "Install Snowtype, authenticate with your Snowplow account, and initialize your project."
keywords: ["Snowtype", "install", "setup", "getting started", "code generation", "authenticate", "initialize"]
date: "2026-03-19"
content_type: how-to
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page walks you through installing Snowtype and connecting it to your Snowplow account.

To use Snowtype, you'll need:

- [Node.js](https://nodejs.org/en/) version 18 or later
- A Snowplow CDI account

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

Snowtype needs to authenticate with Console to read your event specifications and data structures. There are two ways to do it:

* [Log in with your browser](#log-in-with-your-browser): for interactive use, when you run Snowtype yourself in a terminal. This is the default.
* [Use an API key](#use-an-api-key): for non-interactive use, such as CI, where nobody can sign in.

### Log in with your browser

<AppliesTo feature="snowtype-login" />

Run the `login` command:

```bash
npx snowtype login
```

The command prints a sign-in link and offers to open it in your browser. If you belong to more than one organization, it asks you to select a default one.

After that, Snowtype uses this login when no API key is set.

[Snowplow CLI](/docs/api-reference/snowplow-cli/index.md#configure) shares the same login, so you only need to log in with one of the two tools.

To log out, run:

```bash
npx snowtype logout
```

This also logs Snowplow CLI out. It doesn't affect API keys.

### Use an API key

For non-interactive use, such as CI, use a Console API key. [Create an API key](/docs/account-management/index.md#create-an-api-key) in Console under **Settings** > **Manage organization** > **View and manage API keys**. Snowtype only reads data, so the key needs the **View** permission on tracking plans and data structures, and nothing else.

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

If an API key is set, Snowtype uses it instead of the saved login.

## Initialize your project

Run `snowtype init` to create a configuration file for your project:

```bash
npx snowtype init
```

The command will prompt you for:

- Your **organization ID** from Console
- The **tracker** you want to generate code for, e.g. `@snowplow/browser-tracker`
- The **language** for that tracker, if applicable, e.g. `typescript`
- The **format** (language) you want the configuration file to be in
- The **output path** where Snowtype should write the generated code

To find your organization ID, go to [Console](https://console.snowplowanalytics.com/settings) > **Settings** > **Manage organization**.

Snowtype saves these choices to a `snowtype.config.json` file in your project root. You can edit this file directly later, or pass the values as flags to skip the prompts. See the [configuration reference](/docs/event-studio/implement-tracking/configuration-reference/index.md) for all available options.
