---
title: "Enrich Kinesis (AWS)"
date: "2020-10-22"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`enrich-kinesis` is a standalone JVM application that reads from and writes to Kinesis streams. It can be run from anywhere, as long as it has permissions to access the streams.

It is published on Docker Hub and can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -it --rm \\
  -v $PWD:/snowplow \\
  -e AWS_ACCESS_KEY_ID=xxx \\
  -e AWS_SECRET_ACCESS_KEY=xxx \\
  snowplow/snowplow-enrich-kinesis:${versions.enrich} \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Above assumes that you have following directory structure:

- `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-gcp/setup-validation-and-enrich/add-additional-enrichments/index.md)
- Iglu Resolver [configuration JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md)
- [configuration HOCON](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md)

Depending on where the app runs, `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` might not be required.

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

<CodeBlock language="bash">{
`java -jar snowplow-enrich-kinesis-${versions.enrich}.jar \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Configuration guide can be found on [this page](/docs/pipeline-components-and-applications/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/pipeline-components-and-applications/enrichment-components/monitoring/index.md).
