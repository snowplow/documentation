---
title: "What is deployed?"
sidebar_position: 300
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Diagram from '@site/docs/getting-started-on-snowplow-open-source/_diagram.md';
```

**Let’s take a look at what is deployed on AWS upon running the quick start example script.**

You can very easily edit the script or run each of the terraform modules independently, giving you the flexibility to design the topology of your pipeline according to your needs.

<!-- see https://github.com/facebook/docusaurus/issues/8357 -->
<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="postgres" label="Postgres" default>

<Diagram warehouse="Postgres" compute="EC2" stream="Kinesis" bucket="S3"/>

  </TabItem>
  <TabItem value="redshift" label="Redshift">

<Diagram warehouse="Redshift" compute="EC2" stream="Kinesis" bucket="S3"/>

#### Redshift Loader

For more information about the Redshift Loader, see the [documentation on the loading process](/docs/storing-querying/loading-process/index.md?warehouse=redshift&cloud=aws-micro-batching).

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

<Diagram warehouse="Snowflake" compute="EC2" stream="Kinesis" bucket="S3"/>

#### Snowflake Loader

For more information about the Snowflake Loader, see the [documentation on the loading process](/docs/storing-querying/loading-process/index.md?warehouse=snowflake&cloud=aws-micro-batching).

  </TabItem>
  <TabItem value="databricks" label="Databricks">

<Diagram warehouse="Databricks" compute="EC2" stream="Kinesis" bucket="S3"/>

#### Databricks Loader

For more information about the Databricks Loader, see the [documentation on the loading process](/docs/storing-querying/loading-process/index.md?warehouse=databricks&cloud=aws-micro-batching).

  </TabItem>
</Tabs>

## Collector Load Balancer

This is an Application Load Balancer (ALB) for your inbound HTTP/S traffic. Traffic is routed from the load balancer to the collector instances.

For further details on the resources, default and required input variables, and outputs see the [terraform-aws-alb module](https://github.com/snowplow-devops/terraform-aws-alb) github repository.

## Stream Collector

This is a Snowplow event collector that receives raw Snowplow events over HTTP, serializes them to a [Thrift](http://thrift.apache.org/) record format, and then writes them to Kinesis. More details can be found [here](/docs/pipeline-components-and-applications/stream-collector/index.md).

Find out more about the Collector terraform module, and explore the full set of variables here: [https://registry.terraform.io/modules/snowplow-devops/collector-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/collector-kinesis-ec2/aws/latest).

## Enrich

This is a Snowplow app written in scala which:

- Reads raw Snowplow events off a Kinesis stream populated by the Scala Stream Collector
- Validates each raw event
- Enriches each event (e.g. infers the location of the user from his/her IP address)
- Writes the enriched Snowplow event to another stream

It is designed to be used downstream of the [Scala Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md). More details can be found [here](/docs/pipeline-components-and-applications/enrichment-components/stream-enrich/index.md).

Find out more about the Enrich modules and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/enrich-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/enrich-kinesis-ec2/aws/latest).

## Kinesis streams

Your kinesis streams are a key component of ensuring a non-lossy pipeline, providing crucial back-up, as well as serving as a mechanism to drive real time use cases from the enriched stream.

Find out more about the Kinesis stream module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/enrich-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/kinesis-stream/aws/latest).

### Raw stream

Collector payloads are written to this raw kinesis stream, before being picked up by the Enrich application. The S3 loader (raw) also reads from this raw stream and writes to the raw S3 folder.

### Enriched stream

Events that have been validated and enriched by the Enrich application are written to this enriched stream. The S3 loader (enriched) reads from this enriched stream and writes to the enriched folder on S3.  Other applications that read from this stream include the Postgres Loader and the Streaming Transformer applications used for preparing data for loading into Snowflake, Redshift and Databricks.

### Bad 1 stream

This bad stream is for events that the collector, enrich or S3 loader (raw and enriched) applications fail to process. An event can fail at the collector point due to, for instance, it being too large for the stream creating a size violation bad row, or it can fail during enrichment due to a schema violation or enrichment failure. More details can be found [here](/docs/understanding-your-pipeline/failed-events/index.md).

### Bad 2 stream

This bad stream is for failed events generated by the S3 loader as it tries to write from the bad 1 stream to the bad folder on S3.

## Iglu

[Iglu](/docs/pipeline-components-and-applications/iglu/index.md) allows you to publish, test and serve schemas via an easy-to-use RESTful interface. It is split into a few services.

### Iglu load balancer

This load balances the inbound traffic and routes traffic to the Iglu Server.

Find out more about the application load balancer module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/alb/aws/latest](https://registry.terraform.io/modules/snowplow-devops/alb/aws/latest).

### Iglu Server

The [Iglu Server](https://github.com/snowplow/iglu/tree/master/2-repositories/iglu-server) serves requests for Iglu schemas stored in your schema registry.

Find out more about the Iglu Server module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest).

### Iglu RDS

This is the Iglu Server database where the Iglu schemas themselves are stored.

Find out more about the RDS module and explore the full set of variables available here:_ [https://registry.terraform.io/modules/snowplow-devops/rds/aws/latest](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest).

## S3 loader

The Snowplow S3 Loaders consume records from your relevant [Amazon Kinesis](http://aws.amazon.com/kinesis/) streams (as outlined above) and writes them to [S3](http://aws.amazon.com/s3/).

Find out more about the S3 loader module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest).

### S3 loader raw

Responsible for reading from the raw stream (i.e. events from the collector that have not yet been validated or enriched) and writing to the raw folder on S3. Any events that have failed to be processed by the raw S3 loader get written to your bad-1 stream.

### S3 loader bad

Responsible for reading from the bad-1 stream and writing to the bad folder on S3. Any events that fail to be processed by the bad S3 loader get written to the bad-2 stream.

### S3 loader enriched

Responsible for reading from the enriched stream and writing to your enriched folder on S3. Any events that fail to be processed by the enriched S3 loader get written to the bad-1 stream.

## S3 loader bucket

Your S3 bucket where the raw, enriched and bad data gets written to by the S3 loader.

* `raw/`: holds the events that come straight out of your collector and have not yet been validated (i.e. quality checked) or enriched by the Enrich application. They are thrift records and are therefore a little tricky to decode - there are not many reasons to use this data, but backing this data up gives you the flexibility to replay this data should something go wrong further downstream in the pipeline.
* `enriched/`: holds all of your enriched data as GZipped blobs of newline delimited TSVs.  Historically this has been used as the staging ground for loading into data warehouses via our "Batch Transformer/Shredder" application - the quick-start now leverages the "Streaming Transformer" which deprecates this need
* `bad/`: holds the data that has failed to be validated by your pipeline
  - You can optionally [configure Athena to be able to query this data directly](/docs/managing-data-quality/exploring-failed-events/querying/index.md)

Find out more about the S3 bucket module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/s3-bucket/aws/latest](https://registry.terraform.io/modules/snowplow-devops/s3-bucket/aws/latest).

<Tabs groupId="warehouse" queryString>
  <TabItem value="postgres" label="Postgres" default>

## Postgres loader

The Snowplow application responsible for reading the enriched and bad data and [loading to Postgres](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md).

Find out more about the Postgres loader module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/postgres-loader-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/postgres-loader-kinesis-ec2/aws/latest).

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

## Snowflake loader

### SQS Queue

SQS queue is used for communication between Transformer Kinesis and Snowflake Loader.

Transformer Kinesis sends an SQS message to the Snowflake Loader after transforming a window of data. Snowflake Loader listens to the SQS queue. When a new message is received, it extracts necessary information from the message and loads that data to Snowflake. More details can be found in [How `transformer` and `loader` interface with other Snowplow components and each other](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md#how-transformer-and-loader-interface-with-other-snowplow-components-and-each-other).

### Transformer Kinesis

This is a Snowplow application that reads the enriched data from the Kinesis stream, transforms it to format expected by Loader and writes it to an S3 bucket.

After transforming is finished, it sends a message to the Loader via the SQS queue to notify that it can load the transformed data. More details can be found in the [Stream Transformer documentation](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/index.md).

Find out more about the Transformer Kinesis module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest).

### Loader

The Snowplow application responsible for [loading transformed enriched data from S3 to Snowflake](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/snowflake-loader/index.md).

Find out more about the Snowflake Loader module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest).

  </TabItem>
  <TabItem value="databricks" label="Databricks">

## Databricks loader

### SQS Queue

SQS queue is used for communication between Transformer Kinesis and the Databricks Loader.

Transformer Kinesis sends SQS message to the Databricks Loader after transforming a window of data. The Databricks Loader listens to an SQS queue. When a new message is received, it extracts necessary information from the message and loads that data to Databricks. More details can be found in [How `transformer` and `loader` interface with other Snowplow components and each other](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md#how-transformer-and-loader-interface-with-other-snowplow-components-and-each-other).

### Transformer Kinesis

This is a Snowplow application that reads the enriched data from the Kinesis stream, transforms it to format expected by Loader and writes it to an S3 bucket.

After transforming is finished, it sends a message to the Loader via the SQS queue to notify that it can load the transformed data. More details can be found in the [Stream Transformer documentation](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/index.md).

Find out more about the Transformer Kinesis module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest).

### Loader

The Snowplow application responsible for [loading transformed enriched data from S3 to Databricks](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/databricks-loader/index.md).

Find out more about the Databricks Loader module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/databricks-loader-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/databricks-loader-ec2/aws/latest).

  </TabItem>
  <TabItem value="redshift" label="Redshift">

## Redshift Loader

### SQS Queue

SQS queue is used for communication between Transformer Kinesis and the Redshift Loader.

Transformer Kinesis sends SQS message to the Redshift Loader after shredding a window of data. The Redshift Loader listens to an SQS queue. When a new message is received, it extracts necessary information from the message and loads that data into Redshift. More details can be found in [How `transformer` and `loader` interface with other Snowplow components and each other](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md#how-transformer-and-loader-interface-with-other-snowplow-components-and-each-other).

### Transformer Kinesis

This is a Snowplow application that reads the enriched data from the Kinesis stream, transforms it to format expected by Loader and writes it to an S3 bucket.

After transforming is finished, it sends a message to the Loader via the SQS queue to notify that it can load the transformed data. More details can be found in the [Stream Transformer documentation](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/index.md).

Find out more about the Transformer Kinesis module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/transformer-kinesis-ec2/aws/latest).

### Loader

The application responsible for [loading transformed enriched data from S3 to Redshift](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/redshift-loader/index.md).

Find out more about the Redshift Loader module and explore the full set of variables available here: [https://registry.terraform.io/modules/snowplow-devops/redshift-loader-ec2/aws/latest](https://registry.terraform.io/modules/snowplow-devops/redshift-loader-ec2/aws/latest).

  </TabItem>
</Tabs>

## DynamoDB

On the first run of each of the applications consuming from Kinesis (e.g. Enrich), the Kinesis Connectors Library creates a DynamoDB table to keep track of what they have consumed from the stream so far. Each Kinesis consumer maintains its own checkpoint information.

The DynamoDB autoscaling module enables autoscaling for a target DynamoDB table. Note that there is a `kcl_write_max_capacity` variable which can be set to your expected RPS, but setting it high will of course incur more cost.

You can find further details here: [https://registry.terraform.io/modules/snowplow-devops/dynamodb-autoscaling/aws/latest](https://registry.terraform.io/modules/snowplow-devops/dynamodb-autoscaling/aws/latest).
