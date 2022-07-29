---
title: "Postgres Loader"
date: "2020-07-02"
sidebar_position: 1000
---

With Snowplow Postgres Loader you can load enriched data or plain self-describing JSONs into PostgreSQL database.

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest)

A Terraform module which deploys the Snowplow Postgres Loader on AWS EC2 for use with Kinesis. For installing in other environments, please see the other installation options below.

## Getting a Docker image

Snowplow Postgres Loader is [published on DockerHub](https://hub.docker.com/r/snowplow/snowplow-postgres-loader):

```
docker pull snowplow/snowplow-postgres-loader:0.3.2
```

It accepts very typical configuration for Snowplow Loader:

```
docker run --rm \
  -v $PWD/config:/snowplow/config \
  snowplow/snowplow-postgres-loader:0.3.2 \
  --resolver /snowplow/config/resolver.json \
  --config /snowplow/config/config.hocon
```

## Iglu

Where `resolver.json` is a typical [Iglu Client](/docs/migrated/pipeline-components-and-applications/iglu/iglu-resolver/) configuration.

**Please pay attention that schemas for all self-describing JSONs flowing through Postgres Loader must be hosted on Iglu Server 0.6.0 or above.**  
Iglu Central is static registry and if you use Snowplow-authored schemas - you need to upload all schemas from there as well.

## Configuration

The configuration file is in HOCON format, and it specifies connection details for the target database and the input stream of events.

```
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

```
  "input": {
    "type": "PubSub"
    "projectId": "my-project"
    "subscriptionId": "my-subscription"
  }
```

See [the configuration reference](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/postgres-loader-configuration-reference/) for a complete description of all parameters.

## Other

Loader creates `events` table on the start and every other table when it first encounters its corresponding schema.
