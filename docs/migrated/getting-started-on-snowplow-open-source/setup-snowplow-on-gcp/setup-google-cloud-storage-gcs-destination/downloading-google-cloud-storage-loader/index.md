---
title: "Running Google Cloud Storage Loader"
date: "2020-03-02"
sidebar_position: 0
---

Docker images can be found on [Docker Hub](https://hub.docker.com/r/snowplow/snowplow-google-cloud-storage-loader).

Loader can be run with:

```
docker run \
  -v $PWD/config:/snowplow/config \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \ # if running outside GCP
  snowplow/snowplow-google-cloud-storage-loader:0.5.1 \
  --runner=DataFlowRunner \
  --jobName=[JOB-NAME] \
  --project=[PROJECT] \
  --streaming=true \
  --workerZone=[ZONE] \
  --inputSubscription=projects/[PROJECT]/subscriptions/[SUBSCRIPTION] \
  --outputDirectory=gs://[BUCKET] \
  --outputFilenamePrefix=output \ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \ # optional
  --outputFilenameSuffix=.txt \ # optional
  --windowDuration=5 \ # optional, in minutes
  --compression=none \ # optional, gzip, bz2 or none
  --numShards=1 \ # optional
  --dateFormat=YYYY/MM/dd/HH/ \ # optional
  --labels={\"label\": \"value\"} \ #OPTIONAL
  --partitionedOuptutDirectory=gs://[BUCKET]/[SUBDIR] # optional
```

To display the help message:

```
docker run snowplow/snowplow-google-cloud-storage-loader:0.5.1 \
  --help
```

To display documentation about Cloud Storage Loader-specific options:

```
docker run snowplow/snowplow-google-cloud-storage-loader:0.5.1 \
  --help=com.snowplowanalytics.storage.googlecloudstorage.loader.Options
```
