---
title: "(deprecated) Beam Enrich"
date: "2020-11-09"
sidebar_position: 0
---

Beam Enrich is built on top of [Apache Beam](https://beam.apache.org/) and it runs on [GCP's Dataflow](https://cloud.google.com/dataflow/). It can be run from anywhere, as long as it can communicate with Dataflow and have enough permissions to create a Dataflow job. For example, run it as a [Kubernetes](https://cloud.google.com/kubernetes-engine/) job or from a [Compute Engine](https://cloud.google.com/compute/) instance.

## Run Beam Enrich

Beam Enrich is published [on Docker Hub](https://hub.docker.com/repository/docker/snowplow/beam-enrich).

```
docker pull snowplow/beam-enrich:2.0.5
```

The docker container can be run with the following command:

```
docker run \
  -v $PWD/config:/snowplow/config \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \ # if running outside GCP
  snowplow/beam-enrich:latest \
  --runner=DataFlowRunner \
  --project=project-id \
  --streaming=true \
  --zone=europe-west2-a \
  --gcpTempLocation=gs://location/ \
  --job-name=beam-enrich \
  --raw=projects/project/subscriptions/raw-topic-subscription \
  --enriched=projects/project/topics/enriched-topic \
  --bad=projects/project/topics/bad-topic \
  --pii=projects/project/topics/pii-topic \
  --resolver=/snowplow/config/iglu_resolver.json \
  --enrichments=/snowplow/config/enrichments
```

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar beam-enrich-2.0.5.jar \
  -runner=DataFlowRunner \
  --project=project-id \
  --streaming=true \
  --zone=europe-west2-a \
  --gcpTempLocation=gs://location/ \
  --job-name=beam-enrich \
  --raw=projects/project/subscriptions/raw-topic-subscription \
  --enriched=projects/project/topics/enriched-topic \
  --bad=projects/project/topics/bad-topic \
  --pii=projects/project/topics/pii-topic \
  --resolver=/snowplow/config/iglu_resolver.json \
  --enrichments=/snowplow/config/enrichments
```

## Configuration[](/docs/migrated/pipeline-components-and-applications/enrichment-components/beam-enrich/setting-up-beam-enrich/#configuration)

### [](https://github.com/snowplow/snowplow/wiki/setting-up-beam-enrich#beam-enrich-specific-options)Beam Enrich specific options[](/docs/migrated/pipeline-components-and-applications/enrichment-components/beam-enrich/setting-up-beam-enrich/#beam-enrich-specific-options)

Beam Enrich comes with a set of predefined CLI options:

- `--job-name`, the name of the job as it will appear in the Dataflow console
- `--raw=projects/{project}/subscriptions/{raw-topic-subscription}` which describes the input PubSub subscription Beam Enrich will consume from
- `--enriched=projects/{project}/topics/{enriched-topic}` which is the PubSub topic the successfully enriched events will be sinked to
- `--bad=projects/{project}/topics/{bad-topic}`, the PubSub topic where events that have failed enrichment will end up
- `--pii=projects/{project}/topics/{pii-topic}`, the PubSub topic where events resulting from the PII enrichment will end up, optional
- `--resolver=iglu_resolver.json`, the necessary Iglu resolver to lookup the schemas in your data
- `--enrichments=enrichments` the optional directory containing the enrichments that need to be performed

It’s important to note that every enrichment relying on local files will need to have the necessary files stored in [Google Cloud Storage](https://cloud.google.com/storage/), e.g. the IP lookups enrichment:

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0",
  "data": {
    "name": "ip_lookups",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "geo": {
        "database": "GeoLite2-City.mmdb",
        "uri": "gs://gcs-bucket/maxmind"
      }
    }
  }
}
```

### [](https://github.com/snowplow/snowplow/wiki/setting-up-beam-enrich#dataflow-options)Dataflow options[](/docs/migrated/pipeline-components-and-applications/enrichment-components/beam-enrich/setting-up-beam-enrich/#dataflow-options)

To run on Dataflow, Beam Enrich will rely on a set of additional configuration options:

- `--runner=DataFlowRunner` which specifies that we want to run on Dataflow
- `--project={project}`, the name of the GCP project
- `--streaming=true` to notify Dataflow that we’re running a streaming application
- `--zone=europe-west2-a`, the zone where the Dataflow nodes (effectively [GCP Compute Engine](https://cloud.google.com/compute/) nodes) will be launched
- `--region=europe-west2`, the region where the Dataflow job will be launched
- `--gcpTempLocation=gs://location/`, the GCS bucket where temporary files necessary to run the job (e.g. JARs) will be stored

The list of all the options can be found at [https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options](https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options).
