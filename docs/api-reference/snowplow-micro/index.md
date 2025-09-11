---
title: "Snowplow Micro"
sidebar_position: 115
description: "Snowplow Micro API reference for lightweight behavioral event validation and testing workflows."
schema: "TechArticle"
keywords: ["Snowplow Micro", "Local Testing", "Testing Tool", "Development Environment", "Micro Pipeline", "Local Analytics"]
---

See [this guide](/docs/data-product-studio/data-quality/snowplow-micro/index.md) for learning about Snowplow Micro and getting started with it.


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
| `--collector-config`                     | Configuration file for collector ([usage](/docs/data-product-studio/data-quality/snowplow-micro/advanced-usage/index.md#adding-custom-collector-configuration))       |
| `--iglu`                                 | Configuration file for Iglu Client ([usage](/docs/data-product-studio/data-quality/snowplow-micro/advanced-usage/index.md#adding-custom-iglu-resolver-configuration)) |
| `-t`, `--output-tsv`<br/>_(since 1.4.0)_ | Print events in TSV format to standard output ([usage](/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/index.md#exporting-events-to-tsv))           |

## Environment variables

| Variable                  | Version | Description                                                                                                                                                                                               |
| ------------------------- | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MICRO_IGLU_REGISTRY_URL` | 1.5.0+  | The URL for an additional custom Iglu registry ([usage](/docs/data-product-studio/data-quality/snowplow-micro/adding-schemas/index.md#pointing-micro-to-an-iglu-registry))                                |
| `MICRO_IGLU_API_KEY`      | 1.5.0+  | An optional API key for an Iglu registry defined with `MICRO_IGLU_REGISTRY_URL`                                                                                                                           |
| `MICRO_SSL_CERT_PASSWORD` | 1.7.0+  | The password for the optional SSL/TLS certificate in `/config/ssl-certificate.p12`. Enables HTTPS ([usage](/docs/data-product-studio/data-quality/snowplow-micro/advanced-usage/index.md#enabling-https)) |
