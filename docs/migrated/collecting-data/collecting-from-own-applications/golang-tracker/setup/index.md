---
title: "Setup"
date: "2020-02-26"
sidebar_position: 10
---

## Tracker compatibility

The Snowplow Golang Tracker has been built and tested using Golang versions 1.9.x, 1.10.x, 1.11.x, 1.12.x and 1.13.x.

## [](https://github.com/snowplow/snowplow/wiki/Golang-tracker-setup#3-setup)3\. Setup

The Tracker is hosted on Github and versions of the Tracker can be fetched using [gopkg](http://labix.org/gopkg.in).

**Note:** As of version 2.2.1 you can also leverage `go modules`.

To get the package, execute:

```
$host go get gopkg.in/snowplow/snowplow-golang-tracker.v2/tracker

OR

$host go get github.com/snowplow/snowplow-golang-tracker/v2/tracker # When using modules
```

To import the package, add the following line to your code:

```
import "gopkg.in/snowplow/snowplow-golang-tracker.v2/tracker"

OR

import "github.com/snowplow/snowplow-golang-tracker/v2/tracker" # When using modules
```

The current version of the Snowplow Golang Tracker is 2.4.0.
