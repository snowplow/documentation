---
title: "Tracking CLI"
sidebar_label: "Tracking CLI"
sidebar_position: 260
description: "Send Snowplow events from the command line with the Tracking CLI for shell scripts and terminal sessions."
keywords: ["tracking cli", "command line tracking", "shell script analytics", "cli installation", "cli usage"]
date: "2026-04-01"
---

The Snowplow Tracking CLI is a native app that sends events to Snowplow from the command line. Use it to embed Snowplow tracking into shell scripts and terminal sessions.

Under the hood, the app uses the [Snowplow Golang tracker](https://github.com/snowplow/snowplow-golang-tracker). There is no buffering — each event is sent as an individual payload whether `GET` or `POST`.

## Install the Tracking CLI

You can download the binary for Linux, macOS, and Windows directly from GitHub:

- [Linux AMD 64-bit binary](https://github.com/snowplow/snowplow-tracking-cli/releases/download/0.7.0/snowplow_tracking_cli_0.7.0_linux_amd64.zip)
- [Windows AMD 64-bit binary](https://github.com/snowplow/snowplow-tracking-cli/releases/download/0.7.0/snowplow_tracking_cli_0.7.0_windows_amd64.zip)
- [macOS AMD 64-bit binary](https://github.com/snowplow/snowplow-tracking-cli/releases/download/0.7.0/snowplow_tracking_cli_0.7.0_darwin_amd64.zip)
- [macOS ARM 64-bit binary](https://github.com/snowplow/snowplow-tracking-cli/releases/download/0.7.0/snowplow_tracking_cli_0.7.0_darwin_arm64.zip)

A [Docker container](https://hub.docker.com/r/snowplow/snowplow-tracking-cli) is also available if you prefer not to install the binary directly.

## Use the Tracking CLI

The command line interface accepts the following arguments:

```bash
snowplow-tracking-cli --collector={{COLLECTOR_DOMAIN}} --appid={{APP_ID}} --method=[POST|GET] --sdjson={{SELF_DESC_JSON}}
```

or:

```bash
snowplow-tracking-cli --collector={{COLLECTOR_DOMAIN}} --appid={{APP_ID}} --method=[POST|GET] --schema={{SCHEMA_URI}} --json={{JSON}}
```

The available options are:

- `--collector` is the domain for your Snowplow Collector, e.g. `snowplow-collector.acme.com`
- `--appid` is optional (not sent if not set)
- `--method` is optional. It defaults to `GET`
- `--protocol` is optional. It defaults to `https`
- `--sdjson` is a self-describing JSON of the standard form `{ "schema": "iglu:...", "data": { ... } }`
- `--schema` is a schema URI, most likely of the form `iglu:...`
- `--json` is a (non-self-describing) JSON, of the form `{ ... }`
- `--ipaddress` is optional. It defaults to an empty string
- `--contexts` is optional. It defaults to an empty JSON array `[]`

You can either send in a self-describing JSON, or pass in the constituent parts (a regular JSON plus a schema URI) and the Tracking CLI constructs the final self-describing JSON for you.

### Examples

Send a self-describing event by passing the schema and JSON separately:

```bash
snowplow-tracking-cli --collector snowplow-collector.acme.com --appid myappid --method POST --schema iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0 --json "{\"hello\":\"world\"}"
```

Send the same event using a pre-built self-describing JSON:

```bash
snowplow-tracking-cli --collector snowplow-collector.acme.com --appid myappid --method POST --sdjson "{\"schema\":\"iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0\", \"data\":{\"hello\":\"world\"}}"
```

### Use with Docker

Run the Tracking CLI through Docker without installing the binary:

```bash
docker run snowplow/snowplow-tracking-cli:latest --collector snowplow-collector.acme.com --appid myappid --method POST --sdjson "{\"schema\":\"iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0\", \"data\":{\"hello\":\"world\"}}"
```

## Exit codes

The Tracking CLI exits once the Snowplow Collector has responded. The return codes are:

- 0 if the Collector responded with an OK status (2xx or 3xx)
- 4 if the Collector responded with a 4xx status
- 5 if the Collector responded with a 5xx status
- 1 for any other error
