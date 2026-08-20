---
title: "[Snowflake] Snowflake Streaming Loader 0.5.1 released"
description: "We have released version 0.5.1 of Snowflake Streaming Loader."
date: "2025-08-21"
category:
  - "Release notes"
components:
  - "Destinations"
platforms:
  - "Snowflake"
---
We have released version 0.5.1 of Snowflake Streaming Loader. This version fixes a potential race condition when loading events concurrently with adding a new table column (for a new JSON schema).

**We strongly recommend all self-hosted customers to upgrade to this version.** As usual, the Docker image is available on Docker Hub. (See our [documentation](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/).)

All Snowplow CDI pipelines running this loader have been already updated.
