---
title: "Getting started with the Snowtype CLI"
sidebar_position: 1
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Introduction to the Snowtype CLI

Snowtype is a command-line interface that assists developers in implementing custom Snowplow tracking faster, more accurately and more intuitively. Since Snowplow events are always bound to a schema to ensure data quality, we can use this feature to enable type-checking, provide inline documentation and reduce time writing custom code. All that integrated into **your development workflow**.

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

