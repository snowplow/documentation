---
title: "enrich-rabbitmq-experimental (cloud agnostic)"
date: "2020-10-22"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::caution

This asset is experimental. It might get drop in some future depending on the results of our experiments.

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

1. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-gcp/setup-validation-and-enrich/add-additional-enrichments/index.md)
2. Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
3. [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md)

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

<CodeBlock language="bash">{
`java -jar snowplow-enrich-pubsub-${versions.enrich}.jar \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Configuration guide can be find on [this page](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/pipeline-components-and-applications/enrichment-components/monitoring/index.md).

