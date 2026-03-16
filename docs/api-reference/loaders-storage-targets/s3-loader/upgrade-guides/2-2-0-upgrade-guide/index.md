---
title: "S3 Loader 2.2.x upgrade guide"
sidebar_label: "2.2.x upgrade guide"
date: "2022-05-19"
sidebar_position: 10
description: "Upgrade S3 Loader to 2.2.x with separate Docker images for GZip, LZO, and distroless variants for security improvements."
keywords: ["s3 loader 2.2 upgrade", "docker images", "lzo variant", "distroless image", "s3 loader variants"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Starting from the 2.2.0 release we started publishing three different flavours of the docker image.

- <p> Pull the <code>{`:${versions.s3Loader22x}`}</code> tag if you only need GZip output format </p>
- <p> Pull the <code>{`:${versions.s3Loader22x}-lzo`}</code> tag if you also need LZO output format </p>
- <p> Pull the <code>{`:${versions.s3Loader22x}-distroless`}</code> tag for an lightweight alternative to `:2.2.0` </p>

<CodeBlock language="bash">{
`docker pull snowplow/snowplow-s3-loader:${versions.s3Loader22x}
docker pull snowplow/snowplow-s3-loader:${versions.s3Loader22x}-lzo
docker pull snowplow/snowplow-s3-loader:${versions.s3Loader22x}-distroless
`}</CodeBlock>

We removed LZO support from the standard image, because it means we can more easily eliminate security vulnerabilities that are brought in from a dependency on hadoop version 2.

The "distroless" docker image is built from [a more lightweight base image](https://github.com/GoogleContainerTools/distroless). It provides some security advantages, because it carries only the minimal files and executables needed for the loader to run.
