---
title: "Transformer Pub/Sub configuration reference"
sidebar_label: "Transformer PubSub configuration reference"
date: "2022-10-13"
sidebar_position: 12
description: "Configure Transformer Pub/Sub with stream settings, GCS output, windowing, and monitoring for GCP real-time transformation."
keywords: ["transformer pubsub config", "pubsub transformer settings", "gcp transformer config", "stream transformer configuration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

<p>The configuration reference in this page is written for Transformer Pubsub <code>{`${versions.rdbLoader}`}</code></p>

An example of the minimal required config for the Transformer Pubsub can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/gcp/transformer.pubsub.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/gcp/transformer.pubsub.config.reference.hocon).

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

```mdx-code-block
import Pubsub from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/transformer-pubsub/_index.mdx"
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
      <Pubsub/>
      <StreamTransformerCommon/>
      <Common/>
    </tbody>
</table>
```
