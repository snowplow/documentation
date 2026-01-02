---
title: "Setup guide for Iglu Server"
sidebar_label: "Setup guide"
date: "2021-03-26"
sidebar_position: 1000
description: "Deploy Iglu Server with Docker or Terraform for PostgreSQL-backed schema repository with RESTful API and authentication."
keywords: ["iglu server setup", "docker iglu", "terraform iglu", "postgresql schema storage"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

For more information on the architecture of the Iglu server, please read [the technical documentation](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md).

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest)

A Terraform module is available which deploys an Iglu Server on AWS EC2 without the need for this manual setup.

## 1. Run the Iglu server

Iglu Server is [published on Docker Hub](https://hub.docker.com/repository/docker/snowplow/iglu-server).

<CodeBlock language="bash">{
`$ docker pull snowplow/iglu-server:${versions.igluServer}
`}</CodeBlock>

The application is configured by passing a hocon file on the command line:

<CodeBlock language="bash">{
`$ docker run --rm \\
  -v $PWD/config.hocon:/iglu/config.hocon \\
  snowplow/iglu-server:${versions.igluServer} --config /iglu/config.hocon
`}</CodeBlock>

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow-incubator/iglu-server/releases).

<CodeBlock language="bash">{
`$ java -jar iglu-server-${versions.igluServer}.jar --config /path/to/config.hocon
`}</CodeBlock>

Here is an example of a minimal configuration file:

```json
{
  "database": {
    "host": "postgres"
    "dbname": "igludb"
    "username": "postgres"
    "password": "mysecret"
  }

  "superApiKey": "bb7b7503-40d3-459c-943a-f8d31a6f5638"
}
```

See [the configuration reference](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) for a complete description of all parameters.

We also provide a [docker-compose.yml](https://github.com/snowplow-incubator/iglu-server/blob/master/docker/docker-compose.yml) to help you get started.

## 2. Initialize the database

:::note

Iglu Server has been successfully tested with PostgreSQL 16.3, but should work with PostgreSQL 8.2 or newer.

:::

With a fresh install you need to manually create the database:

```bash
$ psql -U postgres -c "CREATE DATABASE igludb"
```

And then use the `setup` command of the iglu server to create the database tables:

<CodeBlock language="bash">{
`$ docker run --rm \\
  -v $PWD/config.hocon:/iglu/config.hocon \\
  snowplow/iglu-server:${versions.igluServer} setup --config /iglu/config.hocon
`}</CodeBlock>

## 3. Use the API key generation service

The super API key you put in the configuration file is able to generate further API keys for your clients through the API key generation service.

To generate a pair of read and write API keys for a specific vendor prefix, simply send a `POST` request to this URL using your super API key in an `apikey` HTTP header:

```text
HOST/api/auth/keygen
```

For example:

```bash
curl \
  HOST/api/auth/keygen \
  -X POST \
  -H 'apikey: your_super_apikey' \
  -d '{"vendorPrefix":"com.acme"}'
```

**Note:** From 0.6.0+ the vendor prefix should be `vendorPrefix` within a JSON body however prior to this it was `vendor_prefix` as a query parameter.

You should receive a JSON response like this one:

```json
{
  "read": "an-uuid",
  "write": "another-uuid"
}
```

If you need to revoke a specific API key, you can do so by sending a `DELETE` request to the following endpoint:

```text
HOST/api/auth/keygen?key=some-uuid
```

For example:

```bash
curl \
  HOST/api/auth/keygen \
  -X DELETE \
  -H 'apikey: your_super_apikey' \
  -d 'key=some-uuid'
```

You should now be all set up to use the Iglu server, if you would like to know more about the Iglu server, please read the [technical documentation](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md).

## Dummy mode

Since 0.6.0 Iglu Server supports new dummy DB mode. In this mode, Server does not require persistent storage as PostgreSQL and stores all data in memory. Use this for debug purposes only, all your data will be lost after restart.

To enable dummy mode, you need to set `database.type` setting to `"dummy"`.

Dummy Iglu Server works with single hardcoded master API key - `48b267d7-cd2b-4f22-bae4-0f002008b5ad`, which you can use to upload your schemas and create new api keys.

## Logging

Iglu Server uses [SLF4J Simple Logger](https://www.slf4j.org/api/org/slf4j/impl/SimpleLogger.html) underneath. Which can be configured via system properties.

For example:

<CodeBlock language="bash">{
`$ iglu-server-${versions.igluServer}.jar \\
  -Dorg.slf4j.simpleLogger.logFile=server.log                                   # In order to redirect logs \\
  -Dorg.slf4j.simpleLogger.log.org.http4s.blaze.channel.nio1.SelectorLoop=warn  # To suppress very verbose SelectorLoop output
`}</CodeBlock>

On debug loglevel `SchemaService` will print all HTTP requests and responses.
