---
title: "Enrich Kinesis (AWS)"
description: "Standalone JVM application for reading collector payloads from AWS Kinesis streams and writing enriched events back to Kinesis."
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

- `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/pipeline/enrichments/available-enrichments/index.md)
- Iglu Resolver [configuration JSON](/docs/api-reference/iglu/iglu-resolver/index.md)
- [configuration HOCON](/docs/api-reference/enrichment-components/configuration-reference/index.md)

It is possible to use environment variables in all of the above (for Iglu and enrichments starting from `3.7.0` only).

Depending on where the app runs, `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` might not be required.

Configuration guide can be found on [this page](/docs/api-reference/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/api-reference/enrichment-components/monitoring/index.md).

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Enrich Kinesis" since="3.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
