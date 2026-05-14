---
title: "Setup guide for Iglu Server"
sidebar_label: "Setup guide"
sidebar_position: 1000
description: "Deploy Iglu Server on AWS, GCP, or Azure using the Terraform modules from the self-hosted quick start, or run it manually with Docker."
keywords: ["iglu server setup", "terraform iglu", "docker iglu", "postgresql schema storage"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Iglu Server is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.1/) ([FAQ](/docs/licensing/limited-use-license-faq/index.md)). To accept the terms of the license and run Iglu Server, set the environment variable `ACCEPT_LIMITED_USE_LICENSE=yes`, or set `license.accept = true` in your HOCON config file.

## Deploy Iglu Server

The recommended way to deploy Iglu Server is to use the Terraform modules provided as part of the [Snowplow Self-Hosted quick start](/docs/get-started/self-hosted/quick-start/index.md#set-up-iglu-server). The quick start walks through deploying Iglu Server (along with the rest of your pipeline) on AWS, GCP, or Azure.

The Terraform modules are also available directly on the Terraform Registry if you want to deploy Iglu Server independently:

- [AWS](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest)
- [GCP](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ce/google/latest)
- [Azure](https://registry.terraform.io/modules/snowplow-devops/iglu-server-vmss/azurerm/latest)

### Deploy with Docker

If you'd rather run Iglu Server manually, you'll also need a PostgreSQL instance to back it. Iglu Server stores schemas in PostgreSQL and connects to it on startup. The Terraform modules handle this for you; if you're deploying manually, provision your own database.

Pull the Iglu Server image from Docker Hub and pass a HOCON config file:

<CodeBlock language="bash">{
`docker pull snowplow/iglu-server:${versions.igluServer}

docker run --rm \\
  -v $PWD/config.hocon:/iglu/config.hocon \\
  -e ACCEPT_LIMITED_USE_LICENSE=yes \\
  snowplow/iglu-server:${versions.igluServer} --config /iglu/config.hocon
`}</CodeBlock>

A minimal configuration looks like this:

```hocon
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

See the [configuration reference](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) for all available parameters. A [docker-compose.yml](https://github.com/snowplow/iglu-server/blob/master/docker/docker-compose.yml) is also provided in the repository to help you get started.

#### Initialize the database

For a fresh install, create the database, then run the `setup` command to create the tables:

```bash
psql -U postgres -c "CREATE DATABASE igludb"
```

<CodeBlock language="bash">{
`docker run --rm \\
  -v $PWD/config.hocon:/iglu/config.hocon \\
  -e ACCEPT_LIMITED_USE_LICENSE=yes \\
  snowplow/iglu-server:${versions.igluServer} setup --config /iglu/config.hocon
`}</CodeBlock>

## Generate API keys

The super API key in your configuration file lets you generate further keys for your applications via the API key generation service.

To generate a pair of read and write API keys for a specific vendor prefix, send a `POST` request to `HOST/api/auth/keygen` with your super API key in the `apikey` header:

```bash
curl HOST/api/auth/keygen \
  -X POST \
  -H 'apikey: your_super_apikey' \
  -d '{"vendorPrefix":"com.acme"}'
```

You'll receive a JSON response with the two keys:

```json
{
  "read": "an-uuid",
  "write": "another-uuid"
}
```

To revoke a key, send a `DELETE` request to the same endpoint:

```bash
curl 'HOST/api/auth/keygen?key=some-uuid' \
  -X DELETE \
  -H 'apikey: your_super_apikey'
```

## Optional configuration

### Dummy mode for testing

Iglu Server supports a dummy database mode that stores all data in memory rather than PostgreSQL. Use it for testing only — all data is lost on restart.

To enable dummy mode, set `database.type` to `"dummy"` in your config. The dummy server uses a single hardcoded master API key: `48b267d7-cd2b-4f22-bae4-0f002008b5ad`.

### Logging

Iglu Server uses [SLF4J Simple Logger](https://www.slf4j.org/api/org/slf4j/impl/SimpleLogger.html), configurable via system properties. For example, to redirect logs to a file and suppress verbose connection loop output:

```bash
-Dorg.slf4j.simpleLogger.logFile=server.log
-Dorg.slf4j.simpleLogger.log.org.http4s.blaze.channel.nio1.SelectorLoop=warn
```

At debug log level, `SchemaService` prints all HTTP requests and responses.
