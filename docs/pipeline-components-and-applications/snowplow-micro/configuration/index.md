---
title: "Configuration"
sidebar_position: 0
description: "Snowplow Micro arguments and environment variables."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::tip

You can always run Micro with the `--help` argument to find out what is supported:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --help`
}</CodeBlock>

:::

## Arguments

| Argument | Description |
|----------|-------------|
| `--collector-config` | Configuration file for collector ([usage](/docs/getting-started-with-micro/advanced-usage/index.md#adding-custom-collector-configuration)) |
| `--iglu` | Configuration file for Iglu Client ([usage](/docs/getting-started-with-micro/advanced-usage/index.md#adding-custom-iglu-resolver-configuration)) |
| `-t`, `--output-tsv`<br/>_(since 1.4.0)_ | Print events in TSV format to standard output ([usage](/docs/getting-started-with-micro/basic-usage/index.md#exporting-events-to-tsv))

## Environment variables

| Variable | Description |
|----------|-------------|
| `MICRO_IGLU_REGISTRY_URL`<br/>_(since 1.5.0)_ | The URL for an additional custom Iglu registry ([usage](/docs/getting-started-with-micro/adding-schemas/index.md#pointing-micro-to-an-iglu-registry)) |
| `MICRO_IGLU_API_KEY`<br/>_(since 1.5.0)_ | An optional API key for an Iglu registry defined with `MICRO_IGLU_REGISTRY_URL` |