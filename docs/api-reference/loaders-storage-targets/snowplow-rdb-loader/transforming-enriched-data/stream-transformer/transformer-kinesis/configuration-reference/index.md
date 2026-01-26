---
title: "Transformer Kinesis configuration reference"
sidebar_label: "Transformer Kinesis configuration reference"
date: "2022-10-13"
sidebar_position: 12
description: "Configure Transformer Kinesis with stream settings, S3 output, windowing, and monitoring for AWS real-time transformation."
keywords: ["transformer kinesis config", "kinesis transformer settings", "stream transformer config", "aws transformer configuration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

<p>The configuration reference in this page is written for Transformer Kinesis <code>{`${versions.rdbLoader}`}</code></p>

An example of the minimal required config for the Transformer Kinesis can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.kinesis.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.kinesis.config.reference.hocon).

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

```mdx-code-block
import Kinesis from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/transformer-kinesis/_index.mdx"
import AwsOnly from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/aws-only/_index.mdx"
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
      <Kinesis/>
      <AwsOnly/>
      <StreamTransformerCommon/>
      <Common/>
    </tbody>
</table>
```
