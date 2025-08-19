---
title: "Databricks Streaming Loader"
sidebar_label: "Databricks Streaming Loader"
sidebar_position: 5
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import LoaderDiagram from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/_diagram.md';
import DeployOverview from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/_deploy-overview.md';
```

## Overview

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS" default>
    <LoaderDiagram stream="Kinesis" cloud="AWS"/>
    <DeployOverview cloud="AWS" stream="kinesis"/>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <LoaderDiagram stream="Pub/Sub" cloud="GCP"/>
    <DeployOverview cloud="GCP" stream="pubsub"/>
  </TabItem>
  <TabItem value="azure" label="Azure">
    <LoaderDiagram stream="Kafka" cloud="Azure"/>
    <DeployOverview cloud="Azure" stream="kafka"/>
  </TabItem>
</Tabs>

:::tip Schemas in Databricks

For more information on how events are stored in Databricks, check the [mapping between Snowplow schemas and the corresponding Databricks column types](/docs/destinations/warehouses-lakes/schemas-in-warehouse/index.md?warehouse=databricks).

:::

## Configuring the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```json reference
https://github.com/snowplow-incubator/databricks-loader/blob/main/config/config.kinesis.minimal.hocon
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```json reference
https://github.com/snowplow-incubator/databricks-loader/blob/main/config/config.pubsub.minimal.hocon
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```json reference
https://github.com/snowplow-incubator/databricks-loader/blob/main/config/config.kafka.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/index.md) for all possible configuration parameters.

### Iglu

The Databricks Streaming Loader requires an [Iglu resolver file](/docs/api-reference/iglu/iglu-resolver/index.md) which describes the Iglu repositories that host your schemas.  This should be the same Iglu configuration file that you used in the Enrichment process.

## Configuring the Databricks Lakeflow Declarative Pipeline

Create a Pipeline in your Databricks workspace, and copy the following sql into the associated notebook:

```sql
CREATE STREAMING LIVE TABLE events
CLUSTER BY (load_tstamp, event_name)
TBLPROPERTIES (
  'delta.dataSkippingStatsColumns' =
      'load_tstamp,collector_tstamp,derived_tstamp,dvce_created_tstamp,true_tstamp,event_name'
)
AS SELECT
  *,
  current_timestamp() as load_tstamp
FROM cloud_files(
  "/Volumes/<CATALOG_NAME>/<VOLUME_NAME>/<SCHEMA_NAME>/events",
  "parquet",
  map(
    "cloudfiles.inferColumnTypes", "false",
    "cloudfiles.includeExistingFiles", "true",
    "cloudfiles.schemaEvolutionMode", "addNewColumns",
    "cloudfiles.partitionColumns", "",
    "cloudfiles.useManagedFileEvents", "true",
    "datetimeRebaseMode", "CORRECTED",
    "int96RebaseMode", "CORRECTED",
    "mergeSchema", "true"
  )
)
```

Replace `/Volumes/<CATALOG_NAME>/<VOLUME_NAME>/<SCHEMA_NAME>/events` with the correct path to your volume.

Note that the volume must be an [external volume](https://docs.databricks.com/aws/en/volumes/) in to order to use the cloud files option `cloudfiles.useManagedFileEvents`, which is highly recommended for this integration.

## Metrics

The Databricks Streaming Loader can be configured to send the following custom metrics to a [StatsD](https://www.datadoghq.com/statsd-monitoring/) receiver:

| Metric                      | Definition |
|-----------------------------|------------|
| `events_good`               | A count of events that are successfully written to the Databricks volume. |
| `events_bad`                | A count of failed events that could not be loaded, and were instead sent to the bad output stream. |
| `latency_millis`            | The time in milliseconds from when events are written to the source stream of events (i.e. by Enrich) until when they are read by the loader. |
| `e2e_latency_millis`        | The end-to-end latency of the snowplow pipeline. The time in milliseconds from when an event was received by the collector, until it is written to the Databricks volume. |

See the `monitoring.metrics.statsd` options in the [configuration reference](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/index.md) for how to configure the StatsD receiver.

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Databricks Streaming Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
