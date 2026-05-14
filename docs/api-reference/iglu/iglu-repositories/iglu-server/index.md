---
title: "Iglu Server"
sidebar_label: "Iglu Server"
sidebar_position: 10
date: "2026-05-14"
description: "Iglu Server is a RESTful schema registry for publishing, validating, and serving Iglu schemas in self-hosted Snowplow pipelines."
keywords: ["iglu server", "schema registry", "self-hosted snowplow", "self-hosted"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

[Iglu Server](https://github.com/snowplow/iglu-server) is the schema registry used by self-hosted Snowplow pipelines. It stores your [schemas](/docs/fundamentals/schemas/index.md), validates them on upload, and serves them over a RESTful API.

## What you can do with it

- Publish and update [self-describing schemas](/docs/fundamentals/schemas/index.md), with validation at upload time.
- Serve schemas to your pipeline components via the [Iglu Resolver](/docs/api-reference/iglu/iglu-resolver/index.md).
- Issue scoped API keys, so different teams or applications can read or write only the vendor prefixes they own.
- Receive webhook notifications when schemas are published or updated. See [`webhooks.schemaPublished`](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) in the configuration reference.
- Mark schema versions as [superseded](/docs/fundamentals/schemas/versioning/index.md#mark-a-schema-as-superseded) when you need to fix a schema that's already in production.

Most users interact with Iglu Server through [Igluctl](/docs/api-reference/iglu/igluctl/index.md) rather than calling the API directly. See [Manage schemas](/docs/api-reference/iglu/manage-schemas/index.md).

## REST API

Iglu Server exposes a RESTful API for managing schemas, validating data, and issuing API keys. The API is documented interactively via Swagger UI at:

```text
http://YOUR_IGLU_HOST/static/swagger-ui/index.html
```

Iglu Server expects an API key in the `apikey` header for any endpoint that requires read access to private schemas or write access to the registry. See [Generate API keys](#generate-api-keys) below for how to generate them.

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
