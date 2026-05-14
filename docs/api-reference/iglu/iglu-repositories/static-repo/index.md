---
title: "Static Iglu repository"
sidebar_label: "Static repository"
sidebar_position: 4000
date: "2026-05-14"
description: "Host Iglu schemas on any HTTP server as a read-only alternative to Iglu Server."
keywords: ["static iglu repo", "static schema registry", "iglu hosting", "self-hosted"]
---

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

A static Iglu repository is a read-only schema registry served from a static website. It's a lighter alternative to [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) when you don't need an authenticated write API. [Iglu Central](/docs/api-reference/iglu/iglu-repositories/index.md#iglu-central) is itself a static repo.

You can host a static repo on any HTTP server that can serve files with a directory structure — for example, Nginx, Apache, Amazon S3, Google Cloud Storage, or Azure Blob Storage.

:::warning[Loader limitations]

Some loaders (notably [RDB loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)) use the schema-list API endpoints that are only fully supported by Iglu Server. If you use a static repo with these loaders, you must generate the schema-list objects when you publish. [`igluctl`](/docs/api-reference/iglu/igluctl/index.md) generates them by default; if you upload schemas to your host by hand, the lists won't exist and the loader will fail.

:::

## Schema file structure

Iglu repositories use a fixed folder hierarchy keyed by vendor, schema name, format, and version:

```text
schemas
└── com.acme
    └── ad_click
        └── jsonschema
            └── 1-0-0
```

The version file (`1-0-0`) has no extension and contains the self-describing JSON schema. See [Self-describing schemas](/docs/fundamentals/schemas/index.md#self-describing-json-schema-anatomy) for what goes inside.

## Publish schemas

Prepare your schemas locally in the folder structure above. Then publish them to your HTTP host.

If you're hosting on Amazon S3, [`igluctl static s3cp`](/docs/api-reference/iglu/igluctl/index.md#static-s3cp) uploads schemas and generates the schema-list objects loaders rely on in one step:

```bash
igluctl static s3cp /path/to/schemas my-iglu-bucket --region eu-west-1
```

For any other host, generate the schema-list objects locally with `igluctl`, then upload the resulting `schemas` directory to your web root. See the [`igluctl` reference](/docs/api-reference/iglu/igluctl/index.md) for details.

Make sure schema files are accessible to whatever clients you intend to use — typically that means making them publicly readable, since static repos don't support authentication.

## Configure the Iglu resolver

Once your registry is live, add it to your [Iglu resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md):

```json
{
  "name": "Acme static repo",
  "priority": 0,
  "vendorPrefixes": [ "com.acme" ],
  "connection": {
    "http": {
      "uri": "https://schemas.acme.com"
    }
  }
}
```

Static repos don't require an `apikey`.
