---
title: "Additional Information"
date: "2020-10-12"
sidebar_position: 300
---

## Under the hood

There is no buffering in the Snowplow Tracking CLI - each event is sent as an individual payload whether `GET` or `POST`.

Under the hood, the app uses the [**Snowplow Golang Tracker**](https://github.com/snowplow/snowplow-golang-tracker).

The Snowplow Tracking CLI will exit once the Snowplow collector has responded. The return codes from `snowplowtrk` are as follows:

- 0 if the Snowplow collector responded with an OK status (2xx or 3xx)
- 4 if the Snowplow collector responded with a 4xx status
- 5 if the Snowplow collector responded with a 5xx status
- 1 for any other error

## Building

Add snowplowtrk and its package dependencies to your go src directory:

```
$ go get -v github.com/snowplow/snowplow-tracking-cli
```

Once the get completes, you should find your new `snowplowtrk` executable sitting inside `$GOPATH/bin/`.

To update snowplowtrk dependencies, use `go get` with the `-u` option.

```
$ go get -u -v github.com/snowplow/snowplow-tracking-cli
```
