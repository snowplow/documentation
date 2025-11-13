---
title: "Google Cloud Storage Loader"
sidebar_position: 6
---


```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

[Cloud Storage Loader](https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/) is a [Dataflow](https://cloud.google.com/dataflow/) job which dumps event from an input [PubSub](https://cloud.google.com/pubsub/) subscription into a [Cloud Storage](https://cloud.google.com/storage/) bucket.

Cloud Storage loader is built on top of [Apache Beam](https://beam.apache.org/) and its Scala wrapper [SCIO](https://github.com/spotify/scio).

## Running

Cloud Storage Loader comes both as a Docker image and a ZIP archive.

### Docker

Docker image can be found on [Docker Hub](https://hub.docker.com/r/snowplow/snowplow-google-cloud-storage-loader).

A container can be run as follows:

<CodeBlock language="bash">{
`docker run \\
  -v $PWD/config:/snowplow/config \\ # if running outside GCP
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \\ # if running outside GCP
  snowplow/snowplow-google-cloud-storage-loader:${versions.gcsLoader} \\
  --runner=DataFlowRunner \\
  --jobName=[JOB-NAME] \\
  --project=[PROJECT] \\
  --streaming=true \\
  --workerZone=[ZONE] \\
  --inputSubscription=projects/[PROJECT]/subscriptions/[SUBSCRIPTION] \\
  --outputDirectory=gs://[BUCKET]/YYYY/MM/dd/HH/ \\ # partitions by date
  --outputFilenamePrefix=output \\ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \\ # optional
  --outputFilenameSuffix=.txt \\ # optional
  --windowDuration=5 \\ # optional, in minutes
  --compression=none \\ # optional, gzip, bz2 or none
  --numShards=1 # optional
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

### ZIP archive

Archive is hosted on GitHub at this URI:
<CodeBlock language="bash">{
`https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/releases/download/${versions.gcsLoader}/snowplow-google-cloud-storage-loader-${versions.gcsLoader}.zip`
}</CodeBlock>

Once unzipped the artifact can be run as follows:

<CodeBlock language="bash">{
`./bin/snowplow-google-cloud-storage-loader \\
  --runner=DataFlowRunner \\
  --project=[PROJECT] \\
  --streaming=true \\
  --workerZone=[ZONE] \\
  --inputSubscription=projects/[PROJECT]/subscriptions/[SUBSCRIPTION] \\
  --outputDirectory=gs://[BUCKET]/YYYY/MM/dd/HH/ \\ # partitions by date
  --outputFilenamePrefix=output \\ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \\ # optional
  --outputFilenameSuffix=.txt \\ # optional
  --windowDuration=5 \\ # optional, in minutes
  --compression=none \\ # optional, gzip, bz2 or none
  --numShards=1 # optional
`}</CodeBlock>

To display the help message:

```bash
./bin/snowplow-google-cloud-storage-loader --help
```

To display documentation about Cloud Storage Loader-specific options:

```bash
./bin/snowplow-google-cloud-storage-loader --help=com.snowplowanalytics.storage.googlecloudstorage.loader.Options
```

## Configuration

### Cloud Storage Loader specific options

- `--inputSubscription=String` The Cloud Pub/Sub subscription to read from, formatted like projects/[PROJECT]/subscriptions/[SUB]. Required.
- `--outputDirectory=gs://[BUCKET]/` The Cloud Storage directory to output files to, ending in /. Required.
- `--outputFilenamePrefix=String` The prefix for output files. Default: output. Optional.
- `--shardTemplate=String` A valid shard template as described [here](https://javadoc.io/static/com.google.cloud.dataflow/google-cloud-dataflow-java-sdk-all/1.7.0/com/google/cloud/dataflow/sdk/io/ShardNameTemplate.html), which will be part of the filenames. Default: `-W-P-SSSSS-of-NNNNN`. Optional.
- `--outputFilenameSuffix=String` The suffix for output files. Default: .txt. Optional.
- `--windowDuration=Int` The window duration in minutes. Default: 5. Optional.
- `--compression=String` The compression used (gzip, bz2 or none). Note that bz2 can't be loaded into BigQuery. Default: no compression. Optional.
- `--numShards=Int` The maximum number of output shards produced when writing. Default: 1. Optional.
- `--dateFormat=YYYY/MM/dd/HH/`  A date format string used for partitioning via date in `outputDirectory` and `partitionedOutputDirectory`. Default: `YYYY/MM/dd/HH/`. Optional.
For example, the date format `YYYY/MM/dd/HH/` would produce a directory structure like this:
  ```bash
  gs://bucket/
    └── 2022
      └── 12
        └── 15
          ├── ...
          ├── 18
          ├── 19
          ├── 20
          └── ...
  ```
- `--partitionedOutputDirectory=gs://[BUCKET]/` The Cloud Storage directory to output files to, partitioned by schema, ending with /. Unpartitioned data will be sent to `outputDirectory`. Optional.

### Dataflow options

To run the Cloud Storage Loader on Dataflow, it is also necessary to specify additional configuration options. None of these options have default values, and they are all required.

- `--runner=DataFlowRunner` Passing the string `DataFlowRunner` specifies that we want to run on Dataflow.
- `--jobName=[NAME]` Specify a name for your Dataflow job that will be created.
- `--project=[PROJECT]` The name of your GCP project.
- `--streaming=true` Pass `true` to notify Dataflow that we're running a streaming application.
- `--workerZone=[ZONE]` The [zone](https://cloud.google.com/compute/docs/regions-zones) where the Dataflow nodes (effectively [GCP Compute Engine](https://cloud.google.com/compute/) nodes) will be launched.
- `--region=[REGION]` The [region](https://cloud.google.com/compute/docs/regions-zones) where the Dataflow job will be launched.
- `--gcpTempLocation=gs://[BUCKET]/` The GCS bucket where temporary files necessary to run the job (e.g. JARs) will be stored.

The list of all the options can be found at [https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options](https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options).
