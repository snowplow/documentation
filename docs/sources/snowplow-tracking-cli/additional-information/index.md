---
title: "Additional information for the Tracking CLI"
sidebar_label: "Additional information"
date: "2020-10-12"
sidebar_position: 300
description: "Learn about Tracking CLI implementation details including Golang tracker backend, no buffering behavior, and collector response exit codes."
keywords: ["tracking cli details", "golang tracker", "exit codes"]
---

There is no buffering in the Snowplow Tracking CLI - each event is sent as an individual payload whether `GET` or `POST`.

Under the hood, the app uses the [**Snowplow Golang Tracker**](https://github.com/snowplow/snowplow-golang-tracker).

The Snowplow Tracking CLI will exit once the Snowplow collector has responded. The return codes from `snowplowtrk` are as follows:

- 0 if the Snowplow collector responded with an OK status (2xx or 3xx)
- 4 if the Snowplow collector responded with a 4xx status
- 5 if the Snowplow collector responded with a 5xx status
- 1 for any other error
