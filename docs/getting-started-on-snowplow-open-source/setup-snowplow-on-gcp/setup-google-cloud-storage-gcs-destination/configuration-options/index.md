---
title: "Configuration options"
date: "2020-03-02"
sidebar_position: 10
---

### Cloud Storage Loader specific options

- `--inputSubscription=String` The Cloud Pub/Sub subscription to read from, formatted as projects/\[PROJECT\]/subscriptions/\[SUB\]
- `--outputDirectory=String` The Cloud Storage directory to output files to, ends with /
- `--outputFilenamePrefix=String` Default: output The Cloud Storage prefix to output files to
- `--shardTemplate=String` Default: -W-P-SSSSS-of-NNNNN The shard template which will be part of the filenames
- `--outputFilenameSuffix=String` Default: .txt The suffix of the filenames written out
- `--windowDuration=Int` Default: 5 The window duration in minutes
- `--compression=String` Default: none The compression used (gzip, bz2 or none), bz2 can’t be loaded into BigQuery
- `--numShards=int` Default: 1 The maximum number of output shards produced when writing

### Dataflow options

To run on Dataflow, Beam Enrich will rely on a set of additional configuration options:

- `--runner=DataFlowRunner` which specifies that we want to run on Dataflow
- `--project=[PROJECT]`, the name of the GCP project
- `--streaming=true` to notify Dataflow that we’re running a streaming application
- `--zone=europe-west2-a`, the zone where the Dataflow nodes (effectively [GCP Compute Engine](https://cloud.google.com/compute/) nodes) will be launched
- `--region=europe-west2`, the region where the Dataflow job will be launched
- `--gcpTempLocation=gs://[BUCKET]/`, the GCS bucket where temporary files necessary to run the job (e.g. JARs) will be stored

The list of all the options can be found at https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options.

## Testing

The tests for this codebase can be run with `sbt test`.

## Debugging

You can run the job locally and experiment with its different parts using the [SCIO REPL](https://github.com/spotify/scio/wiki/Scio-REPL) by running `sbt repl/run`.

## Output

The output of the Snowplow Google Cloud Storage Loader can be loaded into BigQuery. This becomes particularly useful if you choose to load the Snowplow bad stream into Cloud Storage. Indeed, loading that data from Cloud Storage into BigQuery is straightforward and makes it easy to investigate bad rows.
