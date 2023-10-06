---
title: "What is deployed?"
sidebar_position: 3
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';
import Diagram from '@site/docs/getting-started-on-snowplow-open-source/_diagram.md';

export const TerraformLinks = (props) => <p>
  For further details on the resources, default and required input variables, and outputs, see the Terraform module (
  <Link to={props.aws}>AWS</Link>,{' '}
  <Link to={props.gcp}>GCP</Link>,{' '}
  <Link to={props.azure}>Azure</Link>
  ).
</p>
```

Let’s take a look at what is deployed when you follow the quick start guide.

:::tip

You can very easily edit the script or run each of the Terraform modules independently, giving you the flexibility to design the topology of your pipeline according to your needs.

:::

## Overview

<!-- see https://github.com/facebook/docusaurus/issues/8357 -->
<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS" default>

<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="postgres" label="Postgres" default>

<Diagram cloud="aws" warehouse="Postgres" compute="EC2" stream="Kinesis" bucket="S3" igludb="RDS"/>

  </TabItem>
  <TabItem value="redshift" label="Redshift">

<Diagram cloud="aws" warehouse="Redshift" compute="EC2" stream="Kinesis" bucket="S3" igludb="RDS"/>

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

<Diagram cloud="aws" warehouse="Snowflake" compute="EC2" stream="Kinesis" bucket="S3" igludb="RDS"/>

  </TabItem>
  <TabItem value="databricks" label="Databricks">

<Diagram cloud="aws" warehouse="Databricks" compute="EC2" stream="Kinesis" bucket="S3" igludb="RDS"/>

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="gcp" label="GCP">

<!-- see https://github.com/facebook/docusaurus/issues/8357 -->
<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="postgres" label="Postgres" default>

<Diagram cloud="gcp" warehouse="Postgres" compute="CE" stream="Pub/Sub" bucket="GCS" igludb="CloudSQL"/>

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

<Diagram cloud="gcp" warehouse="BigQuery" compute="CE" stream="Pub/Sub" bucket="GCS" igludb="CloudSQL"/>

  </TabItem>
</Tabs>

</TabItem>
<TabItem value="azure" label="Azure 🧪">

<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="snowflake" label="Snowflake" default>

<Diagram cloud="azure" warehouse="Snowflake" compute="VMSS" stream="Kafka" bucket="ADLS Gen2" igludb="Postgres"/>

  </TabItem>
  <TabItem value="databricks" label="Databricks" default>

<Diagram cloud="azure" warehouse="Data Lake" compute="VMSS" stream="Kafka" bucket="ADLS Gen2" igludb="Postgres"/>

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics 🧪" default>

<Diagram cloud="azure" warehouse="Data Lake" compute="VMSS" stream="Kafka" bucket="ADLS Gen2" igludb="Postgres"/>

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

## Collector load balancer

This is an application load balancer for your inbound HTTP(S) traffic. Traffic is routed from the load balancer to the Collector instances.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/alb/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/lb/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/lb/azurerm/latest"
/>

## Collector

This is an application that receives raw Snowplow events over HTTP(S), serializes them to a [Thrift](http://thrift.apache.org/) record format, and then writes them to Kinesis (on AWS), Pub/Sub (on GCP) or Kafka / Event Hubs (on Azure). More details can be found [here](/docs/pipeline-components-and-applications/stream-collector/index.md).

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/collector-kinesis-ec2/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/collector-pubsub-ce/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/collector-event-hub-vmss/azurerm/latest"
/>

## Enrich

This is an application that reads the raw Snowplow events, validates them (including validation against [schemas](/docs/understanding-your-pipeline/schemas/index.md)), [enriches](/docs/enriching-your-data/what-is-enrichment/index.md) them and writes the enriched events to another stream. More details can be found [here](/docs/pipeline-components-and-applications/enrichment-components/index.md).

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/enrich-kinesis-ec2/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/enrich-pubsub-ce/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/enrich-event-hub-vmss/azurerm/latest"
/>

## Iglu

The Iglu stack allows you to manage [schemas](/docs/understanding-your-pipeline/schemas/index.md).

### Iglu load balancer

This load balances the inbound traffic and routes traffic to the Iglu Server.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/alb/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/lb/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/lb/azurerm/latest"
/>

### Iglu Server

The [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) serves requests for Iglu schemas stored in your schema registry.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/iglu-server-ce/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/iglu-server-vmss/azurerm/latest"
/>

### Iglu database

This is the Iglu Server database (RDS on AWS, CloudSQL on GCP and PostgreSQL on Azure) where the Iglu [schemas](/docs/understanding-your-pipeline/schemas/index.md) themselves are stored.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/rds/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/cloud-sql/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/postgresql-server/azurerm/latest"
/>

## Streams

The various streams (Kinesis on AWS, Pub/Sub on GCP and Kafka / Event Hubs on Azure) are a key component of ensuring a non-lossy pipeline, providing crucial back-up, as well as serving as a mechanism to drive real time use cases from the enriched stream.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/kinesis-stream/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/pubsub-topic/google/latest"
  azure="https://registry.terraform.io/modules/snowplow-devops/event-hub-namespace/azurerm/latest"
/>

<details>
<summary>AWS only — DynamoDB</summary>

On the first run of each of the applications consuming from Kinesis (e.g. Enrich), the Kinesis Connectors Library creates a DynamoDB table to keep track of what they have consumed from the stream so far. Each Kinesis consumer maintains its own checkpoint information.

The DynamoDB autoscaling module enables autoscaling for a target DynamoDB table. Note that there is a `kcl_write_max_capacity` variable which can be set to your expected RPS, but setting it high will of course incur more cost.

You can find further details in the [DynamoDB Terraform module](https://registry.terraform.io/modules/snowplow-devops/dynamodb-autoscaling/aws/latest).

</details>

### Raw stream

Collector payloads are written to the raw stream, before being picked up by the Enrich application.

:::note AWS only

The S3 loader (raw) also reads from this raw stream and writes to the raw S3 folder.

:::

### Enriched stream

Events that have been validated and enriched by the Enrich application are written to the enriched stream. Depending on your cloud and destination, different loaders pick up the data from this stream, as shown on the diagram [above](#overview).

:::note AWS only

The S3 loader (enriched) also reads from this enriched stream and writes to the enriched folder on S3.

:::

### Bad 1 stream

This bad stream is for [failed events](/docs/understanding-your-pipeline/failed-events/index.md), which get created when the Collector, Enrich or various loader applications fail to process the data.

### Other streams

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

The _Bad 2 stream_ is for failed events generated by the S3 loader as it tries to write from the Bad 1 stream to the bad folder on S3.

If you selected Redshift, Snowflake or Databricks as your destination, the loader will use an extra SQS stream internally as explained in the [loading process](/docs/storing-querying/loading-process/index.md?cloud=aws-micro-batching).

  </TabItem>
  <TabItem value="gcp" label="GCP">

If you selected BigQuery as your destination, the _Bad Rows_ stream will contain events that could not be inserted into BigQuery by the loader. This includes data that is not valid against its schema or that is somehow corrupted in a way that the loader cannot handle. In addition, the loader users a few streams internally, as explained in the [loading process](/docs/storing-querying/loading-process/index.md?warehouse=bigquery).

  </TabItem>
  <TabItem value="azure" label="Azure 🧪">

No other streams.

  </TabItem>
</Tabs>

## Archival and failed events

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

Aside from your main destination, the data is written to S3 by the S3 Loader applications for archival and to deal with [failed events](/docs/understanding-your-pipeline/failed-events/index.md).

See the [S3 Loader](https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest) and [S3](https://registry.terraform.io/modules/snowplow-devops/s3-bucket/aws/latest) Terraform modules for further details on the resources, default and required input variables, and outputs.

The following loaders and folders are available:
* Raw loader, `raw/`: events that come straight out of the Collector and have not yet been validated or enriched by the Enrich application. They are Thrift records and are therefore a little tricky to decode. There are not many reasons to use this data, but backing this data up gives you the flexibility to replay this data should something go wrong further downstream in the pipeline.
* Enriched loader, `enriched/`: enriched events, in GZipped blobs of [enriched TSV](/docs/understanding-your-pipeline/canonical-event/understanding-the-enriched-tsv-format/index.md). Historically, this has been used as the staging ground for loading into data warehouses via the [Batch transformer](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/index.md) application. However, it’s no longer used in the quick start examples.
* Bad loader, `bad/`: [failed events](/docs/understanding-your-pipeline/failed-events/index.md). You can [query them using Athena](/docs/managing-data-quality/exploring-failed-events/querying/index.md).

Also, if you choose Postgres as your destination, the Postgres loader will load all failed events into Postgres.

  </TabItem>
  <TabItem value="gcp" label="GCP">

If you choose Postgres as your destination, the Postgres loader will load all [failed events](/docs/understanding-your-pipeline/failed-events/index.md) into Postgres, although not to GCS.

If you choose BigQuery as your destination, there will be a “dead letter” GCS bucket. It will have the suffix `-bq-loader-dead-letter` and will contain events that the loader fails to be insert into BigQuery, _but not_ any other kind of failed events. To store all failed events, you will need to manually deploy the [GCS Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md) application.

  </TabItem>
  <TabItem value="azure" label="Azure 🧪">

Currently, [failed events](/docs/understanding-your-pipeline/failed-events/index.md) are only available in the `bad` Kafka / Event Hubs topic.

  </TabItem>
</Tabs>

## Loaders

<Tabs groupId="warehouse" queryString>
  <TabItem value="postgres" label="Postgres" default>

The [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) loads enriched events and failed events to Postgres.

<TerraformLinks
  aws="https://registry.terraform.io/modules/snowplow-devops/postgres-loader-kinesis-ec2/aws/latest"
  gcp="https://registry.terraform.io/modules/snowplow-devops/postgres-loader-pubsub-ce/google/latest"
/>

  </TabItem>
  <TabItem value="redshift" label="Redshift">

[RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) is a set of applications that loads enriched events into Redshift.

See the following Terraform modules for further details on the resources, default and required input variables, and outputs:
* [Transformer Kinesis](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest)
* [Redshift Loader](https://registry.terraform.io/modules/snowplow-devops/redshift-loader-ec2/aws/latest)


  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

The [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md) is a set of applications that loads enriched events into BigQuery.

See the [Terraform module](https://registry.terraform.io/modules/snowplow-devops/bigquery-loader-pubsub-ce/google/latest) for further details on the resources, default and required input variables, and outputs.

There will be a new dataset available in BigQuery with the suffix `_snowplow_db`. Within this dataset, there will be a table called `events` — all of your collected events will be available here generally within a few seconds after they are sent into the pipeline.

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

[RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) is a set of applications that loads enriched events into Snowflake.

See the following Terraform modules for further details on the resources, default and required input variables, and outputs:
* Transformer ([AWS — Kinesis](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest), [Azure — Kafka / Event Hubs](https://registry.terraform.io/modules/snowplow-devops/transformer-event-hub-vmss/azurerm/latest))
* Snowflake Loader ([AWS](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest), [Azure](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-vmss/azurerm/latest))


  </TabItem>
  <TabItem value="databricks" label="Databricks (direct)">

[RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) is a set of applications that loads enriched events into Databricks.

See the following Terraform modules for further details on the resources, default and required input variables, and outputs:
* [Transformer Kinesis](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest)
* [Databricks Loader](https://registry.terraform.io/modules/snowplow-devops/databricks-loader-ec2/aws/latest)


  </TabItem>
  <TabItem value="databricks-lake" label="Databricks (via lake)">

[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) is an application that loads enriched events into a data lake so that they can be queried via Databricks (or other means).

See the Lake Loader [Terraform module](https://registry.terraform.io/modules/snowplow-devops/lake-loader-vmss/azurerm/latest) for further details on the resources, default and required input variables, and outputs.

The Terraform stack for the pipeline will deploy a storage account and a storage container where the loader will write the data.

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics 🧪">

[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) is an application that loads enriched events into a data lake so that they can be queried via Synapse Analytics (or Fabric, OneLake, etc).

See the Lake Loader [Terraform module](https://registry.terraform.io/modules/snowplow-devops/lake-loader-vmss/azurerm/latest) for further details on the resources, default and required input variables, and outputs.

The Terraform stack for the pipeline will deploy a storage account and a storage container where the loader will write the data.

  </TabItem>
</Tabs>
