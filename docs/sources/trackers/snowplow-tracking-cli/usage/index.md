---
title: "Usage"
description: "Usage guide for Snowplow CLI tracking tool for command-line behavioral event collection."
schema: "TechArticle"
keywords: ["CLI Usage", "Command Usage", "CLI Guide", "Terminal Usage", "CLI Commands", "Tracking CLI"]
date: "2020-10-12"
sidebar_position: 200
---

The command line interface is as follows:

```bash
snowplow-tracking-cli --collector={{COLLECTOR_DOMAIN}} --appid={{APP_ID}} --method=[POST|GET] --sdjson={{SELF_DESC_JSON}}
```

or:

```bash
snowplow-tracking-cli --collector={{COLLECTOR_DOMAIN}} --appid={{APP_ID}} --method=[POST|GET] --schema={{SCHEMA_URI}} --json={{JSON}}
```

where:

- `--collector` is the domain for your Snowplow collector, e.g. `snowplow-collector.acme.com`
- `--appid` is optional (not sent if not set)
- `--method` is optional. It defaults to `GET`
- `--protocol` is optional. It defaults to `https`
- `--sdjson` is a self-describing JSON of the standard form `{ "schema": "iglu:...", "data": { ... } }`
- `--schema` is a schema URI, most likely of the form `iglu:...`
- `--json` is a (non-self-describing) JSON, of the form `{ ... }`
- `--ipaddress` is optional. It defaults to an empty string
- `--contexts` is optional. It defaults to an empty JSON array `[]`

The idea here is that you can either send in a [**self-describing JSON**](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/), or pass in the constituent parts (i.e. a regular JSON plus a schema URI) and the Snowplow Tracking CLI will construct the final self-describing JSON for you.

## Examples

```bash
snowplow-tracking-cli --collector snowplow-collector.acme.com --appid myappid --method POST --schema iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0 --json "{\"hello\":\"world\"}"
```

```bash
snowplow-tracking-cli --collector snowplow-collector.acme.com --appid myappid --method POST --sdjson "{\"schema\":\"iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0\", \"data\":{\"hello\":\"world\"}}"
```

## Usage with Docker

```bash
docker run snowplow/snowplow-tracking-cli:latest --collector snowplow-collector.acme.com --appid myappid --method POST --sdjson "{\"schema\":\"iglu:com.snowplowanalytics.snowplow/event/jsonschema/1-0-0\", \"data\":{\"hello\":\"world\"}}"
```
