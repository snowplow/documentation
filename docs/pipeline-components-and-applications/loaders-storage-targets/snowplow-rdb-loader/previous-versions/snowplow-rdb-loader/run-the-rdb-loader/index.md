---
title: "Run the RDB loader"
date: "2021-09-14"
sidebar_position: 50
---

The RDB loader is [published on Docker Hub](https://hub.docker.com/repository/docker/snowplow/snowplow-rdb-loader)

```bash
docker pull snowplow/snowplow-rdb-loader:1.2.0
```

It is configured by providing a base-64 encoded [configuration hocon](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md) and a [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) on the command line:

```bash
docker run \
  snowplow/snowplow-rdb-loader- \
  --iglu-config ewogICJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRp .... \
  --config ewogICJuYW1lIjogIkFjbWUgUmVkc2hpZnQiLAog ....
```

The config options are format are described in the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md).

**Please pay attention that schemas for all self-describing JSONs flowing through RDB Loader must be hosted on Iglu Server 0.6.0 or above.** Iglu Central is static registry and if you use Snowplow-authored schemas – you need to upload all schemas from there as well.
