---
title: "Setup"
date: "2020-02-26"
sidebar_position: 10
---

## Tracker compatibility

The latest version of the Snowplow Golang Tracker has been built and tested using Golang versions 1.19.x, 1.18.x and 1.17.x.

## Setup

The Tracker is hosted on GitHub and versions of the Tracker can be fetched using Golang modules with both `v2` and `v3` available via this method.

To get the package, execute:

```go
$host go get github.com/snowplow/snowplow-golang-tracker/v3/tracker
```

To import the package, add the following line to your code:

```go
import "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```

The current version of the Snowplow Golang Tracker is v3.0.0.
