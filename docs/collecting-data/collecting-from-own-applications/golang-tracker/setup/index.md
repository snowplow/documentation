---
title: "Setup"
date: "2020-02-26"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

## Tracker compatibility

The latest version of the Snowplow Golang Tracker is `v${versions.golangTracker}` which has been built and tested using Golang versions `1.19.x`, `1.18.x` and `1.17.x`.

## Setup

All of the tracker code is hosted on GitHub and versions can be fetched using Golang modules with both `v2` and `v3` available via this method.

To get the package, execute:

```bash
$host go get "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```

To import the package, add the following line to your code:

```go
import "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```
