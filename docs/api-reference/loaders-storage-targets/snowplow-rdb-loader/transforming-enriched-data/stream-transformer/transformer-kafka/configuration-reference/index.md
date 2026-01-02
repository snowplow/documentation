---
title: "Transformer Kafka configuration reference"
sidebar_label: "Transformer Kafka configuration reference"
sidebar_position: 22
description: "Configure Transformer Kafka with stream settings, Azure Blob Storage output, windowing, and monitoring for Azure real-time transformation."
keywords: ["transformer kafka config", "kafka transformer settings", "azure transformer config", "event hubs configuration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

<p>The configuration reference in this page is written for Transformer Kafka <code>{`${versions.rdbLoader}`}</code></p>

An example of the minimal required config for the Transformer Kafka can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/azure/transformer.kafka.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/azure/transformer.kafka.config.reference.hocon).

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

```mdx-code-block
import Kafka from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/transformer-kafka/_index.mdx"
import StreamTransformerCommon from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/stream-transformer-common/_index.mdx"
import Common from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/common/_index.mdx"

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <Kafka/>
      <StreamTransformerCommon/>
      <Common/>
    </tbody>
</table>
```
