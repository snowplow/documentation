---
title: "🧪 Enrich RabbitMQ (cloud agnostic)"
date: "2020-10-22"
sidebar_position: 40
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::caution

This asset is experimental. It might get dropped in the future depending on the results of our experiments.

:::

`enrich-rabbitmq` is a standalone JVM application that reads from and writes to RabbitMQ.
It can be run from anywhere, as long as it can communicate with RabbitMQ cluster.

It is published on Docker Hub and can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -it --rm \\
  -v $PWD:/snowplow \\
  snowplow/snowplow-enrich-rabbitmq-experimental:${versions.enrich} \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>


Above assumes that you have following directory structure:

1. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/enriching-your-data/available-enrichments/index.md)
2. Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
3. [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md)

It is possible to use environment variables in all of the above (for Iglu and enrichments starting from `3.7.0` only).

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

<CodeBlock language="bash">{
`java -jar snowplow-enrich-rabbitmq-${versions.enrich}.jar \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Configuration guide can be found on [this page](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/pipeline-components-and-applications/enrichment-components/monitoring/index.md).

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Enrich RabbitMQ" since="3.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
