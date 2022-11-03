---
title: "Running Google Cloud Storage Loader"
date: "2020-03-02"
sidebar_position: 0
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Docker images can be found on [Docker Hub](https://hub.docker.com/r/snowplow/snowplow-google-cloud-storage-loader).

Loader can be run with:

<CodeBlock language="bash">{
`docker run \\
  -v $PWD/config:/snowplow/config \\
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \\ # if running outside GCP
  snowplow/snowplow-google-cloud-storage-loader:${versions.gcsLoader} \\
  --runner=DataFlowRunner \\
  --jobName=[JOB-NAME] \\
  --project=[PROJECT] \\
  --streaming=true \\
  --workerZone=[ZONE] \\
  --inputSubscription=projects/[PROJECT]/subscriptions/[SUBSCRIPTION] \\
  --outputDirectory=gs://[BUCKET] \\
  --outputFilenamePrefix=output \\ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \\ # optional
  --outputFilenameSuffix=.txt \\ # optional
  --windowDuration=5 \\ # optional, in minutes
  --compression=none \\ # optional, gzip, bz2 or none
  --numShards=1 \\ # optional
  --dateFormat=YYYY/MM/dd/HH/ \\ # optional
  --labels={\\"label\\": \\"value\\"} \\ #OPTIONAL
  --partitionedOuptutDirectory=gs://[BUCKET]/[SUBDIR] # optional
`}</CodeBlock>

To display the help message:

<CodeBlock language="bash">{
`docker run snowplow/snowplow-google-cloud-storage-loader:${versions.gcsLoader} \\
  --help
`}</CodeBlock>

To display documentation about Cloud Storage Loader-specific options:

<CodeBlock language="bash">{
`docker run snowplow/snowplow-google-cloud-storage-loader:${versions.gcsLoader} \\
  --help=com.snowplowanalytics.storage.googlecloudstorage.loader.Options
`}</CodeBlock>
