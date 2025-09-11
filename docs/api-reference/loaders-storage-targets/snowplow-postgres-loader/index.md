---
title: "Postgres Loader"
description: "Load behavioral event data into PostgreSQL databases for relational analytics and reporting."
schema: "TechArticle"
keywords: ["Postgres Loader", "PostgreSQL Loader", "Database Loader", "SQL Loader", "Relational Database", "Postgres Integration"]
sidebar_position: 7
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

With Snowplow Postgres Loader you can load enriched data or [failed events](/docs/fundamentals/failed-events/index.md) into PostgreSQL database.

:::danger Production use

The Postgres loader is not recommended for production use, especially with large data volumes. We recommend using a fully-fledged data warehouse like Databricks, Snowflake, BigQuery or Redshift, together with a [respective loader](/docs/destinations/warehouses-lakes/index.md).

:::

:::tip Schemas in Postgres

For more information on how events are stored in Postgres, check the [mapping between Snowplow schemas and the corresponding Postgres column types](/docs/destinations/warehouses-lakes/schemas-in-warehouse/index.md?warehouse=postgres).

:::

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/postgres-loader-kinesis-ec2/aws/latest)

A Terraform module which deploys the Snowplow Postgres Loader on AWS EC2 for use with Kinesis. For installing in other environments, please see the other installation options below.

## Getting a Docker image

Snowplow Postgres Loader is [published on DockerHub](https://hub.docker.com/r/snowplow/snowplow-postgres-loader):

<CodeBlock language="bash">{
`docker pull snowplow/snowplow-postgres-loader:${versions.postgresLoader}
`}</CodeBlock>

It accepts very typical configuration for Snowplow Loader:

<CodeBlock language="bash">{
`docker run --rm \\
  -v $PWD/config:/snowplow/config \\
  snowplow/snowplow-postgres-loader:${versions.postgresLoader} \\
  --resolver /snowplow/config/resolver.json \\
  --config /snowplow/config/config.hocon
`}</CodeBlock>

## Iglu

Where `resolver.json` is a typical [Iglu Client](/docs/api-reference/iglu/iglu-resolver/index.md) configuration.

**Please pay attention that schemas for all self-describing JSONs flowing through Postgres Loader must be hosted on Iglu Server 0.6.0 or above.**
Iglu Central is static registry and if you use Snowplow-authored schemas - you need to upload all schemas from there as well.

## Configuration

The configuration file is in HOCON format, and it specifies connection details for the target database and the input stream of events.

```json
{
  "input": {
    "type": "Kinesis"
    "streamName": "enriched-events"
    "region": "eu-central-1"
  }
  "output" : {
    "good": {
      "type": "Postgres"
      "host": "localhost"
      "database": "snowplow"
      "username": "postgres"
      "password": ${POSTGRES_PASSWORD}
      "schema": "atomic"
    }
  }
}
```

The `input` section can alternatively specify a GCP PubSub subscription, instead of a kinesis stream like in the example above.

```json
  "input": {
    "type": "PubSub"
    "projectId": "my-project"
    "subscriptionId": "my-subscription"
  }
```

See [the configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/postgres-loader-configuration-reference/index.md) for a complete description of all parameters.

## Other

Loader creates `events` table on the start and every other table when it first encounters its corresponding schema.

You should ensure that the database and schema specified in the configuration exist before starting the loader.
