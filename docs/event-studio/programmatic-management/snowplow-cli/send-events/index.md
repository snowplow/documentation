---
title: "Send events via Snowplow CLI"
sidebar_label: "Send events"
sidebar_position: 10
description: "Send Snowplow events to a Collector from the command line with the Snowplow CLI events send command. Useful for sending a test event, verifying a pipeline, shell scripts, and terminal sessions without writing tracker code."
keywords: ["send events", "send test event", "send event from command line", "send event to collector", "Snowplow CLI events send", "command line tracking"]
date: "2026-06-09"
---

The `events` subcommand of [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) sends events to a Snowplow Collector from the command line. Use it to embed Snowplow tracking into your shell scripts and terminal sessions, or to send a quick test event while validating a pipeline.

Each event is sent as an individual payload, and the command exits once the Collector has responded.

## Prerequisites

You need [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) installed. Sending events does not require Console credentials, so you can skip the configuration step if you only use the `events` subcommand.

## Send an event

The `events send` command sends a single [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) to your Collector. You can either pass a complete self-describing JSON, or pass a schema URI and its data separately and let the CLI assemble the event for you.

The only required flag is `--collector`, the domain of your Snowplow Collector. The examples below use the built-in `com.snowplowanalytics.snowplow/custom_event` schema, so they produce a valid event as long as you point `--collector` at a real Collector.

### Send a self-describing JSON

Pass a complete self-describing JSON with `--sdjson`:

```bash
snowplow-cli events send \
  --collector collector.example.com \
  --sdjson '{"schema":"iglu:com.snowplowanalytics.snowplow/custom_event/jsonschema/1-0-0","data":{"category":"test","action":"click"}}'
```

### Send a schema and data separately

Pass the schema URI with `--schema` and a plain (non-self-describing) JSON payload with `--json`. The CLI combines them into a self-describing event:

```bash
snowplow-cli events send \
  --collector collector.example.com \
  --schema iglu:com.snowplowanalytics.snowplow/custom_event/jsonschema/1-0-0 \
  --json '{"category":"test","action":"click"}'
```

### Attach entities

Attach [entities](/docs/fundamentals/entities/index.md) with `--entities`, passing a JSON array of self-describing JSON objects:

```bash
snowplow-cli events send \
  --collector collector.example.com \
  --sdjson '{"schema":"iglu:com.snowplowanalytics.snowplow/custom_event/jsonschema/1-0-0","data":{"category":"test","action":"click"}}' \
  --entities '[{"schema":"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0","data":{"id":"550e8400-e29b-41d4-a716-446655440000"}}]'
```

## Command options

Set the application ID with `--app-id`, the HTTP method with `--method` (defaults to `POST`), and the protocol with `--protocol` (defaults to `https`). For the full list of flags, see the [`events send` command reference](/docs/event-studio/programmatic-management/snowplow-cli/reference/index.md#events-send).

## Migrate from the Snowplow Tracking CLI

The standalone Snowplow Tracking CLI (`snowplow-tracking-cli`) has been merged into Snowplow CLI as the `events send` command. The old tool is deprecated and its repository will be archived. Migrate any scripts that use `snowplow-tracking-cli` to `snowplow-cli events send`.

The flags are largely the same, with a few renames and one changed default:

| Snowplow Tracking CLI | Snowplow CLI `events send` | Notes                                          |
| --------------------- | -------------------------- | ---------------------------------------------- |
| `--collector`         | `--collector`              | Unchanged, required                            |
| `--appid`             | `--app-id`                 | Defaults to `snowplowcli`                       |
| `--method`            | `--method`                 | Default changed from `GET` to `POST`           |
| `--protocol`          | `--protocol`               | Unchanged, defaults to `https`                 |
| `--sdjson`            | `--sdjson`                 | Unchanged                                      |
| `--schema`            | `--schema`                 | Unchanged                                      |
| `--json`              | `--json`                   | Unchanged                                      |
| `--ipaddress`         | `--ip-address`             | Renamed                                        |
| `--contexts`          | `--entities`               | Renamed                                        |

For example, this Snowplow Tracking CLI command:

```bash
snowplow-tracking-cli --collector collector.example.com --appid myappid --method POST --sdjson '{"schema":"iglu:com.snowplowanalytics.snowplow/custom_event/jsonschema/1-0-0","data":{"category":"test","action":"click"}}'
```

becomes:

```bash
snowplow-cli events send --collector collector.example.com --app-id myappid --sdjson '{"schema":"iglu:com.snowplowanalytics.snowplow/custom_event/jsonschema/1-0-0","data":{"category":"test","action":"click"}}'
```
