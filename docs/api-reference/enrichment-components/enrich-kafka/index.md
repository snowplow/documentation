---
title: "Enrich Kafka (Azure)"
description: "Apache Kafka enrichment component API reference for stream-based behavioral event processing."
schema: "TechArticle"
keywords: ["Enrich Kafka", "Kafka Processing", "Stream Processing", "Kafka Enrichment", "Real Time", "Message Processing"]
date: "2022-10-03"
sidebar_position: 30
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`enrich-kafka` is a standalone JVM application that reads from and writes to Kafka.
It can be run from anywhere, as long as it can communicate with your Kafka cluster.

It is published on Docker Hub and can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -it --rm \\
  -v $PWD:/snowplow \\
  snowplow/snowplow-enrich-kafka:${versions.enrich} \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>


Above assumes that you have following directory structure:

1. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/pipeline/enrichments/available-enrichments/index.md)
2. Iglu Resolver [configuration JSON](/docs/api-reference/iglu/iglu-resolver/index.md)
3. [configuration HOCON](/docs/api-reference/enrichment-components/configuration-reference/index.md)

It is possible to use environment variables in all of the above (for Iglu and enrichments starting from `3.7.0` only).

Configuration guide can be found on [this page](/docs/api-reference/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/api-reference/enrichment-components/monitoring/index.md).

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Enrich Kafka" since="3.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
