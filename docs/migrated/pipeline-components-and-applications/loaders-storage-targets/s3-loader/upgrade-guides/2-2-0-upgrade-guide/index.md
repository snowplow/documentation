---
title: "2.2.0 Upgrade Guide"
date: "2022-05-19"
sidebar_position: 0
---

Starting from the 2.2.0 release we started publishing three different flavours of the docker image.

- Pull the `:2.2.0` tag if you only need GZip output format
- Pull the `:2.2.0-lzo` tag if you also need LZO output format
- Pull the `:2.2.0-distroless` tag for an lightweight alternative to `:2.2.0`

```
docker pull snowplow/snowplow-s3-loader:2.2.0
docker pull snowplow/snowplow-s3-loader:2.2.0-lzo
docker pull snowplow/snowplow-s3-loader:2.2.0-distroless
```

We removed LZO support from the standard image, because it means we can more easily eliminate security vulnerabilities that are brought in from a dependency on hadoop version 2.

The "distroless" docker image is built from [a more lightweight base image](https://github.com/GoogleContainerTools/distroless). It provides some security advantages, because it carries only the minimal files and executables needed for the loader to run.
