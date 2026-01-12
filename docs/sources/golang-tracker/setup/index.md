---
title: "Install the Golang tracker"
sidebar_label: "Installation"
description: "Install the Golang tracker using go modules with support for Go 1.17.x through 1.19.x. Import the tracker package and start tracking server-side events from your Go applications."
keywords: ["golang installation", "go get", "go modules", "golang tracker v3"]
date: "2020-02-26"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The latest version of the Snowplow Golang Tracker is v{versions.golangTracker} which has been built and tested using Golang versions <code>1.19.x</code>, <code>1.18.x</code> and <code>1.17.x</code>.</p>

## Setup

All of the tracker code is hosted on [GitHub](https://github.com/snowplow/snowplow-golang-tracker) and versions can be fetched using Golang modules with both `v2` and `v3` available via this method.

To get the package, execute:

```bash
$host go get "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```

To import the package, add the following line to your code:

```go
import "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```
