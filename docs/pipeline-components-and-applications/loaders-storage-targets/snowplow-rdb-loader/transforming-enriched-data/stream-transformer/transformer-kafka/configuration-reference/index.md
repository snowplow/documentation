---
title: "Transformer Kafka configuration reference"
sidebar_position: 22
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

<p>The configuration reference in this page is written for Transformer Kafka <code>{`${versions.rdbLoader}`}</code></p>

An example of the minimal required config for the Transformer Kafka can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/azure/transformer.kafka.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/azure/transformer.kafka.config.reference.hocon).

```mdx-code-block
import License from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

```mdx-code-block
import Kafka from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/transformer-kafka/_index.mdx"
import StreamTransformerCommon from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/stream-transformer-common/_index.mdx"
import Common from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/common/_index.mdx"

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
