---
title: "Enrich Pubsub (GCP)"
description: "Google Cloud Pub/Sub enrichment component API reference for scalable behavioral data processing."
schema: "TechArticle"
keywords: ["Enrich PubSub", "Google PubSub", "GCP Enrichment", "Stream Processing", "PubSub Integration", "Cloud Processing"]
date: "2020-10-22"
sidebar_position: 20
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`enrich-pubsub` is a standalone JVM application that reads from and writes to PubSub topics.
It can be run from anywhere, as long as it has permissions to access the topics.

It is published on Docker Hub and can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -it --rm \\
  -v $PWD:/snowplow \\
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/snowplow-gcp-account-11aa55ff6b1b.json \\
  snowplow/snowplow-enrich-pubsub:${versions.enrich} \\
  --enrichments /snowplow/enrichments \\
  --iglu-config /snowplow/resolver.json \\
  --config /snowplow/config.hocon
`}</CodeBlock>

Above assumes that you have following directory structure:

1. GCP credentials [JSON file](https://cloud.google.com/docs/authentication/getting-started)
2. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/pipeline/enrichments/available-enrichments/index.md)
3. Iglu Resolver [configuration JSON](/docs/api-reference/iglu/iglu-resolver/index.md)
4. enrich-pubSub [configuration HOCON](/docs/api-reference/enrichment-components/configuration-reference/index.md)

It is possible to use environment variables in all of the above (for Iglu and enrichments starting from `3.7.0` only).

Configuration guide can be found on [this page](/docs/api-reference/enrichment-components/configuration-reference/index.md) and information about the monitoring on [this one](/docs/api-reference/enrichment-components/monitoring/index.md).

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Enrich PubSub" since="3.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
