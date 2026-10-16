---
title: "Iglu Server 0.15.x upgrade guide"
sidebar_label: "0.15.x upgrade guide"
sidebar_position: 0
description: "Upgrade guide for Iglu Server 0.15.x, which requires a primary key on the schemas and drafts tables and removes the JDBC thread pool settings."
keywords: ["iglu server 0.15", "primary key", "duplicate schemas", "upgrade"]
date: "2026-10-16"
---

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

## Primary key on the schemas and drafts tables

The `iglu_schemas` and `iglu_drafts` tables have a primary key. Fresh installs create it with the tables. For databases created by an older version, Iglu Server adds the primary key on startup if it's missing.

Since version 0.15.0, the primary key is mandatory: if Iglu Server can't add it, for example because the table contains duplicate rows, it fails to start instead of running without it. Version 0.14.2 tried to add the primary key too, but kept running if it failed, logging a `Could not add the primary key to table` error along with the duplicate rows.

Before upgrading, check that your tables have no duplicate rows:

```sql
SELECT vendor, name, format, model, revision, addition, COUNT(*)
FROM iglu_schemas
GROUP BY vendor, name, format, model, revision, addition
HAVING COUNT(*) > 1;

SELECT vendor, name, format, version, COUNT(*)
FROM iglu_drafts
GROUP BY vendor, name, format, version
HAVING COUNT(*) > 1;
```

If either query returns rows, remove the duplicates before starting version 0.15.0.

## Removed thread pool settings

The `database.pool.transactionPool` (Hikari) and `database.pool.threadPool` (`nopool`) settings are removed: blocking JDBC calls now run on the blocking pool of the runtime. Configurations that still set them keep loading, and the values are ignored, so you can remove them from your configuration at your convenience.

## API description format

Each service's API description at `/api/<service>/swagger.json` is now an OpenAPI 3.0.3 document instead of Swagger 2.0. If you generate clients or otherwise process these files, check that your tooling supports OpenAPI 3.0.
