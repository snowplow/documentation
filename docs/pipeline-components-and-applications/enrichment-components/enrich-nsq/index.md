---
title: "Enrich NSQ (cloud agnostic)"
sidebar_position: 35
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`enrich-nsq` is a standalone JVM application that reads from and writes to NSQ.
It can be run from anywhere, as long as it can communicate with your NSQ cluster.

It is published on Docker Hub and can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -it --rm \\
  -v $PWD:/snowplow \\
  snowplow/snowplow-enrich-nsq:${versions.enrich} \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>


Above assumes that you have following directory structure:

1. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/enriching-your-data/available-enrichments/index.md)
2. Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
3. [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md)

It is possible to use environment variables in all of the above.

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

<CodeBlock language="bash">{
`java -jar snowplow-enrich-nsq-${versions.enrich}.jar \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Configuration guide can be found on [this page](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/pipeline-components-and-applications/enrichment-components/monitoring/index.md).

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Enrich NSQ" since="3.8.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```