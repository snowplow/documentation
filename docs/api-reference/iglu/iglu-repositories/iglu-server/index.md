---
title: "Iglu Server"
sidebar_label: "Iglu Server"
sidebar_position: 2000
description: "Iglu Server is a RESTful schema registry for publishing, validating, and serving Iglu schemas in self-hosted Snowplow pipelines."
keywords: ["iglu server", "schema registry", "self-hosted snowplow", "self-hosted"]
---

[Iglu Server](https://github.com/snowplow/iglu-server) is the schema registry used by self-hosted Snowplow pipelines. It stores your [schemas](/docs/fundamentals/schemas/index.md), validates them on upload, and serves them over a RESTful API.

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

## What you can do with it

- Publish and update [self-describing schemas](/docs/fundamentals/schemas/index.md), with validation at upload time.
- Serve schemas to your pipeline components via the [Iglu Resolver](/docs/api-reference/iglu/iglu-resolver/index.md).
- Issue scoped API keys, so different teams or applications can read or write only the vendor prefixes they own.
- Receive webhook notifications when schemas are published or updated. See [`webhooks.schemaPublished`](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) in the configuration reference.
- Mark schema versions as [superseded](/docs/fundamentals/schemas/versioning/index.md#mark-a-schema-as-superseded) when you need to fix a schema that's already in production.

## Deploy Iglu Server

The recommended way to deploy Iglu Server is via the Terraform modules provided in the [Snowplow self-hosted quick start](/docs/get-started/self-hosted/quick-start/index.md#set-up-iglu-server).

For manual deployment with Docker, see the [setup guide](/docs/api-reference/iglu/iglu-repositories/iglu-server/setup/index.md).

For tuning, see the [configuration reference](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md).

## Manage schemas

Most users interact with Iglu Server through [`igluctl`](/docs/api-reference/iglu/igluctl/index.md) (for publishing and validating schemas from the command line) rather than calling the API directly. See [Manage schemas](/docs/api-reference/iglu/manage-schemas/index.md).

## REST API

Iglu Server exposes a RESTful API for managing schemas, validating data, and issuing API keys. The API is documented interactively via Swagger UI at:

```text
http://YOUR_IGLU_HOST/static/swagger-ui/index.html
```

Iglu Server expects an API key in the `apikey` header for any endpoint that requires read access to private schemas or write access to the registry. See [API keys](/docs/api-reference/iglu/iglu-repositories/iglu-server/setup/index.md#3-use-the-api-key-generation-service) in the setup guide for how to generate keys.
