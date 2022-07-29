---
title: "enrich-pubsub (GCP) and enrich-kinesis (AWS)"
date: "2020-10-22"
sidebar_position: 10
---

## enrich-pubsub

enrich-pubsub is a standalone JVM application that reads from and writes to PubSub topics. It can be run from anywhere, as long as it has permissions to access the topics. For example, run it as a [Kubernetes](http://Configuration Beam Enrich specific options Beam Enrich comes with a set of predefined CLI options:  --job-name, the name of the job as it will appear in the Dataflow console --raw=projects/{project}/subscriptions/{raw-topic-subscription} which describes the input PubSub subscription Beam Enrich will consume from --enriched=projects/{project}/topics/{enriched-topic} which is the PubSub topic the successfully enriched events will be sinked to --bad=projects/{project}/topics/{bad-topic}, the PubSub topic where events that have failed enrichment will end up --pii=projects/{project}/topics/{pii-topic}, the PubSub topic where events resulting from the PII enrichment will end up, optional --resolver=iglu_resolver.json, the necessary Iglu resolver to lookup the schemas in your data --enrichments=enrichments the optional directory containing the enrichments that need to be performed It’s important to note that every enrichment relying on local files will need to have the necessary files stored in Google Cloud Storage, e.g. the IP lookups enrichment:  {   "schema": "iglu:com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0",   "data": {     "name": "ip_lookups",     "vendor": "com.snowplowanalytics.snowplow",     "enabled": true,     "parameters": {       "geo": {         "database": "GeoLite2-City.mmdb",         "uri": "gs://gcs-bucket/maxmind"       }     }   } }Copy Code language: JSON / JSON with Comments (json) Dataflow options To run on Dataflow, Beam Enrich will rely on a set of additional configuration options:  --runner=DataFlowRunner which specifies that we want to run on Dataflow --project={project}, the name of the GCP project --streaming=true to notify Dataflow that we’re running a streaming application --zone=europe-west2-a, the zone where the Dataflow nodes (effectively GCP Compute Engine nodes) will be launched --region=europe-west2, the region where the Dataflow job will be launched --gcpTempLocation=gs://location/, the GCS bucket where temporary files necessary to run the job (e.g. JARs) will be stored The list of all the options can be found at https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options.) job, or on a [GCP compute instance](https://cloud.google.com/compute), or even just from your laptop.

It is published on Docker Hub and can be run with the following command:

```
docker run \
  -it --rm \
  -v $PWD:/snowplow \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/snowplow-gcp-account-11aa55ff6b1b.json \
  snowplow/snowplow-enrich-pubsub:3.2.2 \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

Above assumes that you have following directory structure:

1. GCP credentials [JSON file](https://cloud.google.com/docs/authentication/getting-started)
2. `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/migrated/setup-snowplow-on-gcp/setup-validation-and-enrich-beam-enrich/add-additional-enrichments/)
3. Iglu Resolver [configuration JSON](/docs/migrated/iglu/iglu-resolver/)
4. enrich-pubSub [configuration HOCON](/docs/migrated/pipeline-components-and-applications/enrichment-components/enrich-pubsub/enrich-pubsub-configuration-reference/)

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar snowplow-enrich-pubsub-3.2.2.jar \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

## enrich-kinesis

enrich-kinesis is a standalone JVM application that reads from and writes to Kinesis streams. It can be run from anywhere, as long as it has permissions to access the streams.

It is published on Docker Hub and can be run with the following command:

```
docker run \
  -it --rm \
  -v $PWD:/snowplow \
  -e AWS_ACCESS_KEY_ID=xxx \
  -e AWS_SECRET_ACCESS_KEY=xxx \
  snowplow/snowplow-enrich-kinesis:3.2.2 \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```

Above assumes that you have following directory structure:

- `enrichments` directory, (possibly empty) with all [enrichment configuration JSONs](/docs/migrated/setup-snowplow-on-gcp/setup-validation-and-enrich-beam-enrich/add-additional-enrichments/)
- Iglu Resolver [configuration JSON](/docs/migrated/iglu/iglu-resolver/)
- enrich-kinesis [configuration HOCON](/docs/migrated/pipeline-components-and-applications/enrichment-components/enrich-pubsub/enrich-pubsub-configuration-reference/)

Depending on where the app runs, `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` might not be required.

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar snowplow-enrich-kinesis-3.2.2.jar \
  --enrichments /snowplow/enrichments \
  --iglu-config /snowplow/resolver.json \
  --config /snowplow/config.hocon
```
