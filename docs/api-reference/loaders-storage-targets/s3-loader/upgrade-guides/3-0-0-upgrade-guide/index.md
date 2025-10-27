---
title: "3.0.0 upgrade guide"
date: "2025-10-27"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

S3 loader was using AWS SDK v1 which goes EOL at the end of the year.
Bumping to AWS SDK v2 required a full rewrite of the app.
We took the opportunity to rewrite it with [common-streams](https://github.com/snowplow-incubator/common-streams) libraries.

## Buffering

S3 loader buffers the events into memory before writing them to disk. There are 2 key differences between the previous loader and the new one:

- In the previous loader we had one buffer per shard, each buffer getting written to one file. In the new loader, records from all the shards go to the same buffer and file. The consequence is that the new loader writes fewer bigger files.

- In the previous loader, records were compressed after the buffer was full, before getting written to disk. In the new loader, records get compressed before getting added to the buffer. The consequence is that the new loader writes bigger files (very close to `maxBytes` if this limit is reached before `maxDelay`).

![differences in buffering](@site/static/img/s3-loader-3.x.jpeg)

## LZO deprecation

Starting from `3.0.0` S3 loader should only be used to load enriched events and bad rows (no more `purpose = "RAW"`).
LZO compression format is not supported any more and only the following Docker images with GZIP get published:

- <p><code>{`snowplow/snowplow-s3-loader:${versions.s3Loader22x}`}</code></p>
- <p><code>{`snowplow/snowplow-s3-loader:${versions.s3Loader22x}-distroless`}</code> (lightweight alternative)</p>

## Config file

In `3.0.0` S3 Loader went through a major configuration refactoring. A [sample config](https://github.com/snowplow/snowplow-s3-loader/blob/3.0.0/config/config.aws.reference.hocon) is available in GitHub repository.

These config fields have been removed:

- `region`: it is now retrieved from the credentials provider chain.
- `buffer.recordLimit`: only `maxDelay` and `maxBytes` are now used for the buffering.
- `monitoring.snowplow`: Snowplow tracking (sending events e.g. `app_initialized` or `app_heartbeat`) got removed.
- `output.s3.maxTimeout`

These sections/fields have been renamed:

- `output.s3` -> `output.good`
- `buffer.byteLimit` -> `batching.maxBytes`
- `buffer.timeLimit` -> `batching.maxDelay`
- `input.maxRecords` -> `input.retrievalMode.maxRecords`

For more details, refer to the [configuration reference](/docs/api-reference/loaders-storage-targets/s3-loader/configuration-reference/index.md).