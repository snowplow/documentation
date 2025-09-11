---
title: "Code Generation - automatically generate code for Snowplow tracking SDKs"
description: "TypeScript code generation tool for type-safe behavioral event tracking and data structure validation."
schema: "TechArticle"
keywords: ["Snowtype", "TypeScript Types", "Type Generation", "Type Safety", "TypeScript Integration", "Code Generation"]
sidebar_position: 6
sidebar_label: "Code generation (Snowtype)"
sidebar_custom_props:
  offerings:
    - bdp
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

**Snowtype** is a tool that assists with instrumenting, verifying and maintaining tracking code. Snowtype works with Snowplow tracking SDKs.

## Supported trackers

```mdx-code-block
import Trackers from "./_supported-trackers.md"

<Trackers/>
```

## Prerequsites

To use Snowtype, you must have [Node.js](https://nodejs.org/en/) (>=@18) installed.

## Installation

Navigate to your project and install Snowtype using your favorite package manager:

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install --save-dev @snowplow/snowtype
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn add --dev @snowplow/snowtype
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm add --save-dev @snowplow/snowtype
```

  </TabItem>
</Tabs>

## Executing commands

Installing Snowtype will also create a local executable `snowtype` which you can use with `npx`, `yarn` or `pnpm` directly when on your project's directory.

<Tabs groupId="example-commands">
  <TabItem value="npm" label="npm" default>

```bash
npx @snowplow/snowtype init
# Same as
npx snowtype init
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn @snowplow/snowtype init
# Same as
yarn snowtype init
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm @snowplow/snowtype init
# Same as
pnpm snowtype init
```

  </TabItem>
</Tabs>

_We will show example commands using `npm/npx` but it should work the same with any other package manager._
