---
title: "Snowtype (Code generation) - automatically generate code for Snowplow tracking SDKs"
sidebar_position: 6
sidebar_label: "Snowtype (Code generation)"
sidebar_custom_props:
  offerings:
    - cdi
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

**Snowtype** is a code generation tool that automates the creation of type-safe tracking code for Snowplow SDKs. Snowtype connects directly to your data structures and event specifications. This eliminates manual instrumentation work and ensures that your tracking code is compliant with the schemas and produces high quality data.

Snowtype streamlines the development workflow by providing several key advantages:

- **Type safety enforcement:** Generates strongly-typed code that validates events and entities at compile time, preventing schema violations before data reaches your pipeline.
- **Automated code generation:** Converts event specifications into production-ready SDK code, reducing implementation time from weeks to days.
- **Integrated documentation:** Syncs inline code documentation with your data structures and products, maintaining consistency between design and implementation.
- **Development workflow integration:** Fits seamlessly into CI/CD processes, enabling GitOps-style data product management and automated updates when schemas evolve.
- **Reduced maintenance overhead:** Automatically updates tracking code when data structures change, eliminating the need for manual synchronization across multiple codebases.

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

## Executing commands

Installing Snowtype will also create a local executable `snowtype` which you can use with `npx`, `yarn` or `pnpm` directly when on your project's directory.

<Tabs groupId="example-commands">
  <TabItem value="npm" label="npm" default>

```bash
npx @snowplow/snowtype@latest init
# Same as
npx snowtype init
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn @snowplow/snowtype@latest init
# Same as
yarn snowtype init
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm @snowplow/snowtype@latest init
# Same as
pnpm snowtype init
```

  </TabItem>
</Tabs>

_We will show example commands using `npm/npx` but it should work the same with any other package manager._
