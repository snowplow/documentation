---
title: "Snowplow Micro API reference"
sidebar_label: "Snowplow Micro"
sidebar_position: 115
description: "Snowplow Micro arguments and environment variables."
keywords: ["snowplow micro", "micro api", "micro arguments", "testing tool"]
---

See [this guide](/docs/testing/snowplow-micro/index.md) for learning about Snowplow Micro and getting started with it.


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

| Argument                                 | Description                                                                                                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--collector-config`                     | Configuration file for collector ([usage](/docs/testing/snowplow-micro/advanced-usage/index.md#adding-custom-collector-configuration))       |
| `--iglu`                                 | Configuration file for Iglu Client ([usage](/docs/testing/snowplow-micro/advanced-usage/index.md#adding-custom-iglu-resolver-configuration)) |
| `-t`, `--output-tsv`<br/>_(since 1.4.0)_ | Print events in TSV format to standard output ([usage](/docs/testing/snowplow-micro/basic-usage/index.md#exporting-events))           |
| `-j`, `--output-json`<br/>_(since 2.4.0)_ | Print events in JSON format to standard output ([usage](/docs/testing/snowplow-micro/basic-usage/index.md#exporting-events))           |
| `-d`, `--destination`<br/>_(since 2.4.0)_ | Send data to an HTTP endpoint instead of outputting it via standard output. Requires either `--output-tsv` or `--output-json` ([usage](/docs/testing/snowplow-micro/basic-usage/index.md#exporting-events))           |
| `--yauaa` | Enable YAUAA user agent enrichment ([usage](/docs/testing/snowplow-micro/configuring-enrichments/index.md#yauaa-yet-another-user-agent-analyzer)) |
| `-m`, `--max-events`<br/>_(since 3.0.1)_ | Maximum number of events of each kind (good, bad) to keep in memory (setting this to 0 disables all /micro endpoints) |

## Environment variables

| Variable                  | Version | Description                                                                                                                                                                                               |
| ------------------------- | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MICRO_IGLU_REGISTRY_URL` | 1.5.0+  | The URL for an additional custom Iglu registry ([usage](/docs/testing/snowplow-micro/adding-schemas/index.md#pointing-micro-to-an-iglu-registry))                                |
| `MICRO_IGLU_API_KEY`      | 1.5.0+  | An optional API key for an Iglu registry defined with `MICRO_IGLU_REGISTRY_URL`                                                                                                                           |
| `MICRO_SSL_CERT_PASSWORD` | 1.7.0+  | The password for the optional SSL/TLS certificate in `/config/ssl-certificate.p12`. Enables HTTPS ([usage](/docs/testing/snowplow-micro/advanced-usage/index.md#enabling-https)) |
