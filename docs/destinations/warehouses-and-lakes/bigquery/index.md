---
title: "BigQuery Loader"
sidebar_position: 2
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import ThemedImage from '@theme/ThemedImage';
```


Under the umbrella of Snowplow BigQuery Loader, we have a family of applications that can be used to load enriched Snowplow data into BigQuery.

:::tip Schemas in BigQuery

For more information on how events are stored in BigQuery, check the [mapping between Snowplow schemas and the corresponding BigQuery column types](/docs/understanding-tracking-design/json-schema-type-casting-rules/index.md).

:::

There are currently four applications, which are described in detail below. A typical deployment would consist of three of them:

- a loader app, which consumes the enriched stream and loads the data into the storage target. This comes in two flavours (Loader and StreamLoader) that are alternatives to each other and should not both be used at the same time.
- a Mutator app, which keeps track of the fields present in the enriched data and updates the BigQuery table accordingly;
- a Repeater app, which handles so-called failed inserts.

## Technical Architecture

The available tools are:

1. **Snowplow BigQuery StreamLoader**, a standalone Scala app that can be deployed on [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine).
2. **Snowplow BigQuery Loader**, an alternative to StreamLoader, in the form of a [Google Cloud Dataflow](https://cloud.google.com/dataflow) job.
3. **Snowplow BigQuery Mutator**, a Scala app that performs table updates to add new columns as required.
4. **Snowplow BigQuery Repeater**, a Scala app that reads failed inserts (caused by _table update lag_) and re-tries inserting them into BigQuery after some delay, sinking failures into a dead-letter bucket.

<center>
<ThemedImage 
alt='Big Query Loader Technical Diagram'
sources={{
light: require('./images/BQL_100_technical_diagram_light.drawio.png').default, 
dark: require('./images/BQL_100_technical_diagram_dark.drawio.png').default
}}
/>
</center>


### Snowplow BigQuery StreamLoader

- Reads Snowplow enriched events from a dedicated Pub/Sub subscription.
- Uses the JSON transformer from the [Snowplow Scala Analytics SDK](https://github.com/snowplow/snowplow-scala-analytics-sdk) to convert those enriched events into JSON.
- Uses [Iglu Client](https://github.com/snowplow/iglu-scala-client/) to fetch JSON schemas for self-describing events and entities.
- Uses [Iglu Schema DDL](https://github.com/snowplow/iglu/tree/master/0-common/schema-ddl) to transform self-describing events and entities into BigQuery format.
- Writes transformed data into BigQuery.
- Writes all encountered Iglu types into a dedicated Pub/Sub topic (the `types` topic).
- Writes all data that failed to be validated against its schema into a dedicated `badRows` Pub/Sub topic.
- Writes all data that was successfully transformed, but could not be loaded into a dedicated `failedInserts` topic.

### Snowplow BigQuery Loader

An [Apache Beam](https://beam.apache.org/) job intended to run on Google Cloud Dataflow. An alternative to the StreamLoader application, it has the same algorithm.

### Snowplow BigQuery Mutator

The Mutator app is in charge of performing automatic table updates, which means you do not have to pause loading and manually update the table every time you're adding a new custom self-describing event or entity.

- Reads messages from a dedicated subscription to the `types` topic.
- Finds out if a message contains a type that has not been encountered yet (by checking internal cache).
- If a message contains a new type, double-checks it with the connected BigQuery table.
- If the type is not in the table, fetches its JSON schema from an Iglu registry.
- Transforms the JSON schema into BigQuery column definition.
- Adds the column to the connected BigQuery table.

### Snowplow BigQuery Repeater

The Repeater app is in charge of handling failed inserts. It reads ready-to-load events from a dedicated subscription on the `failedInserts` topic and re-tries inserting them into BigQuery to overcome 'table update lag'.

#### Table update lag

The loader app inserts data into BigQuery in near real-time. At the same time, it sinks messages containing information about the fields of an event into the `types` topic. It can take up to 10-15 seconds for Mutator to fetch, parse the message and execute an `ALTER TABLE` statement against the table. Additionally, the new column takes some time to propagate and become visible to all workers trying to write to it.

If a new type arrives from the input subscription in this period of time, BigQuery might reject the row containing it and it will be sent to the `failedInserts` topic. This topic contains JSON objects _ready to be loaded into BigQuery_ (ie not canonical Snowplow Enriched event format).

In order to load this data again from `failedInserts` to BigQuery you can use Repeater, which reads a subscription on `failedInserts` and performs `INSERT` statements.

Repeater has several important behaviour aspects:

- If a pulled record is not a valid Snowplow event, it will result into a `loader_recovery_error` bad row.
- If a pulled record is a valid event, Repeater will wait some time (15 minutes by default) after the `etl_tstamp` before attempting to re-insert it, in order to let Mutator do its job.
- If the database responds with an error, the row will get transformed into a `loader_recovery_error` bad row.
- All entities in the dead-letter bucket are valid Snowplow [bad rows](https://github.com/snowplow/snowplow-badrows).

### Topics, subscriptions and message formats

The Snowplow BigQuery Loader apps use Pub/Sub topics and subscriptions to store intermediate data and communicate with each other.

<table><tbody><tr><td><strong>Kind</strong></td><td><strong>Populated by</strong></td><td><strong>Consumed by</strong></td><td><strong>Data format</strong></td></tr><tr><td>Input subscription</td><td>Enriched events topic</td><td>Loader / StreamLoader</td><td>canonical <code>TSV + JSON</code> enriched format</td></tr><tr><td>Types topic</td><td>Loader / StreamLoader</td><td>Types subscription</td><td><code>iglu:com.snowplowanalytics.snowplow/shredded_type/jsonschema/1-0-0</code></td></tr><tr><td>Types subscription</td><td>Types topic</td><td>Mutator</td><td><code>iglu:com.snowplowanalytics.snowplow/shredded_type/jsonschema/1-0-0</code></td></tr><tr><td>Bad row topic</td><td>Loader / StreamLoader</td><td><a href="/docs/destinations/warehouses-and-lakes/google-cloud-storage/">GCS Loader</a></td><td><code>iglu:com.snowplowanalytics.snowplow.badrows/loader_iglu_error/jsonschema/2-0-0</code><br/><code>iglu:com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/2-0-0</code><br/><code>iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-1</code></td></tr><tr><td>Failed insert topic</td><td>Loader / StreamLoader</td><td>Failed insert subscription</td><td><code>BigQuery JSON</code></td></tr><tr><td>Failed insert subscription</td><td>Failed insert topic</td><td>Repeater</td><td><code>BigQuery JSON</code></td></tr></tbody></table>

## Setup guide

### Configuration file

Loader / StreamLoader, Mutator and Repeater accept the same configuration file in HOCON format. An example of a minimal configuration file can look like this:

```json
{
  "projectId": "com-acme"

  "loader": {
    "input": {
      "subscription": "enriched-sub"
    }

    "output": {
      "good": {
        "datasetId": "snowplow"
        "tableId": "events"
      }

      "bad": {
        "topic": "bad-topic"
      }

      "types": {
        "topic": "types-topic"
      }

      "failedInserts": {
        "topic": "failed-inserts-topic"
      }
    }
  }

  "mutator": {
    "input": {
      "subscription": "types-sub"
    }

    "output": {
      "good": ${loader.output.good} # will be automatically inferred
    }
  }

  "repeater": {
    "input": {
      "subscription": "failed-inserts-sub"
    }

    "output": {
      "good": ${loader.output.good} # will be automatically inferred

      "deadLetters": {
        "bucket": "gs://dead-letter-bucket"
      }
    }
  }

  "monitoring": {} # disabled
}
```

The loader takes command line arguments `--config` with a path to the configuration hocon file and `--resolver` with a path to the Iglu resolver file. If you are running the docker image then you should mount the configuration files into the container:

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-streamloader:${versions.bqLoader} \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json
`}</CodeBlock>

Or you can pass the whole config as a base64-encoded string using the `--config` option, like so:

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/resolver.json:/resolver.json \\
    snowplow/snowplow-bigquery-streamloader:${versions.bqLoader} \\
    --config=ewogICJwcm9qZWN0SWQiOiAiY29tLWFjbWUiCgogICJsb2FkZXIiOiB7CiAgICAiaW5wdXQiOiB7CiAgICAgICJzdWJzY3JpcHRpb24iOiAiZW5yaWNoZWQtc3ViIgogICAgfQoKICAgICJvdXRwdXQiOiB7CiAgICAgICJnb29kIjogewogICAgICAgICJkYXRhc2V0SWQiOiAic25vd3Bsb3ciCiAgICAgICAgInRhYmxlSWQiOiAiZXZlbnRzIgogICAgICB9CgogICAgICAiYmFkIjogewogICAgICAgICJ0b3BpYyI6ICJiYWQtdG9waWMiCiAgICAgIH0KCiAgICAgICJ0eXBlcyI6IHsKICAgICAgICAidG9waWMiOiAidHlwZXMtdG9waWMiCiAgICAgIH0KCiAgICAgICJmYWlsZWRJbnNlcnRzIjogewogICAgICAgICJ0b3BpYyI6ICJmYWlsZWQtaW5zZXJ0cy10b3BpYyIKICAgICAgfQogICAgfQogIH0KCiAgIm11dGF0b3IiOiB7CiAgICAiaW5wdXQiOiB7CiAgICAgICJzdWJzY3JpcHRpb24iOiAidHlwZXMtc3ViIgogICAgfQoKICAgICJvdXRwdXQiOiB7CiAgICAgICJnb29kIjogJHtsb2FkZXIub3V0cHV0Lmdvb2R9ICMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGluZmVycmVkCiAgICB9CiAgfQoKICAicmVwZWF0ZXIiOiB7CiAgICAiaW5wdXQiOiB7CiAgICAgICJzdWJzY3JpcHRpb24iOiAiZmFpbGVkLWluc2VydHMtc3ViIgogICAgfQoKICAgICJvdXRwdXQiOiB7CiAgICAgICJnb29kIjogJHtsb2FkZXIub3V0cHV0Lmdvb2R9ICMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGluZmVycmVkCgogICAgICAiZGVhZExldHRlcnMiOiB7CiAgICAgICAgImJ1Y2tldCI6ICJnczovL2RlYWQtbGV0dGVyLWJ1Y2tldCIKICAgICAgfQogICAgfQogIH0KCiAgIm1vbml0b3JpbmciOiB7fSAjIGRpc2FibGVkCn0= \\
    --resolver=/resolver.json
`}</CodeBlock>

The `--config` command option is actually optional. For some setups it is more convenient to provide configuration parameters using JVM system properties or environment variables, as documented in [the Lightbend config readme](https://github.com/lightbend/config/blob/v1.4.1/README.md).

For example, to override the `repeater.input.subscription` setting using system properties:

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-streamloader:${versions.bqLoader} \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    -Drepeater.input.subscription="failed-inserts-sub"
`}</CodeBlock>

Or to use environment variables for every setting:

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/resolver.json:/resolver.json \\
    snowplow/snowplow-bigquery-repeater:${versions.bqLoader} \\
    --resolver=/resolver.json \\
    -Dconfig.override_with_env_vars=true
`}</CodeBlock>

See the [configuration reference](/docs/destinations/warehouses-and-lakes/bigquery/snowplow-bigquery-loader-configuration-reference/index.md) for more details and advanced settings.

### Command line options

All apps accept a config HOCON as specified above, and an Iglu resolver config passed via the `--resolver` option. The latter must conform to the `iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-3` schema.

#### StreamLoader

StreamLoader accepts `--config` and `--resolver` arguments, as well as any JVM system properties that can be used to override the configuration.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-streamloader:${versions.bqLoader} \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    -Dconfig.override_with_env_vars=true
`}</CodeBlock>

The `--config` flag is optional, but if missing, all configuration options must be specified in some other way (system properties or environment variables).

#### The Dataflow Loader

The Dataflow Loader accepts the same two arguments as StreamLoader and [any other](https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options) supported by Google Cloud Dataflow.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-loader:${versions.bqLoader} \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    --labels={"key1":"val1","key2":"val2"} # optional Dataflow args
`}</CodeBlock>

The optional `labels` argument is an example of a Dataflow natively supported argument. It accepts a JSON with key-value pairs that will be used as [labels](https://cloud.google.com/compute/docs/labeling-resources) to the Cloud Dataflow job.

This can be launched from any machine authenticated to submit Dataflow jobs.

#### Mutator

Mutator has three subcommands: `listen`, `create` and `add-column`.

##### `listen`

`listen` is the primary command and is used to automate table migrations.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-mutator:${versions.bqLoader} \\
    listen \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    --verbose # optional, for debugging only
`}</CodeBlock>

##### `add-column`

`add-column` can be used once to add a column to the table specified via the `loader.output.good` setting. This should eliminate the risk of table update lag and the necessity to run a Repeater, but requires 'manual' intervention.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-mutator:${versions.bqLoader} \\
    add-column \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    --shred-property=CONTEXTS \\
    --schema="iglu:com.acme/app_context/jsonschema/1-0-0"
`}</CodeBlock>

The specified schema must be present in one of the Iglu registries in the resolver configuration.

##### `create`

`create` creates an empty table with `atomic` structure. It can optionally be partitioned by a `TIMESTAMP` field.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-mutator:${versions.bqLoader} \\
    create \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    --partitionColumn=load_tstamp \\ # optional TIMESTAMP column by which to partition the table
    --requirePartitionFilter # optionally require a filter on the partition column in all queries
`}</CodeBlock>

See the Google documentation for more information about [partitioned tables](https://cloud.google.com/bigquery/docs/creating-partitioned-tables).

#### Repeater

We recommend constantly running Repeater on a small / cheap node or Docker container.

<CodeBlock language="bash">{
`docker run \\
    -v /path/to/configs:/configs \\
    snowplow/snowplow-bigquery-repeater:${versions.bqLoader} \\
    --config=/configs/bigquery.hocon \\
    --resolver=/configs/resolver.json \\
    --bufferSize=20 \\ # size of the batch to send to the dead-letter bucket
    --timeout=20 \\ # duration after which bad rows will be sunk into the dead-letter bucket  
    --backoffPeriod=900 \\ # seconds to wait before attempting an insert (calculated against etl_tstamp)
    --verbose # optional, for debugging only
`}</CodeBlock>

`bufferSize`, `timeout` and `backoffPeriod` are optional parameters.

### Docker support

All applications are available as Docker images on Docker Hub, based on Ubuntu Focal and OpenJDK 11:

<CodeBlock language="bash">{
`$ docker pull snowplow/snowplow-bigquery-streamloader:${versions.bqLoader}
$ docker pull snowplow/snowplow-bigquery-loader:${versions.bqLoader}
$ docker pull snowplow/snowplow-bigquery-mutator:${versions.bqLoader}
$ docker pull snowplow/snowplow-bigquery-repeater:${versions.bqLoader}
`}</CodeBlock>

<p>We also provide an alternative lightweight set of images based on <a href="https://github.com/GoogleContainerTools/distroless">Google's "distroless" base image</a>, which may provide some security advantages for carrying fewer dependencies. These images are distinguished with the <code>{`${versions.bqLoader}-distroless`}</code> tag:</p>

<CodeBlock language="bash">{
`$ docker pull snowplow/snowplow-bigquery-streamloader:${versions.bqLoader}-distroless
$ docker pull snowplow/snowplow-bigquery-loader:${versions.bqLoader}-distroless
$ docker pull snowplow/snowplow-bigquery-mutator:${versions.bqLoader}-distroless
$ docker pull snowplow/snowplow-bigquery-repeater:${versions.bqLoader}-distroless
`}</CodeBlock>

Mutator, Repeater and Streamloader are also available as fatjar files attached to [releases](https://github.com/snowplow-incubator/snowplow-bigquery-loader/releases) in the project's Github repository.
