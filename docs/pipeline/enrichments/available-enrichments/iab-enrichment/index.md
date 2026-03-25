---
title: "IAB bot detection enrichment"
sidebar_position: 0
sidebar_label: IAB bot detection
description: "Identify bot and spider traffic using the IAB/ABC International Spiders and Bots List based on IP and user agent."
keywords: ["IAB enrichment", "bot detection", "spider detection"]
---

The IAB Spiders and Robots enrichment uses the [IAB/ABC International Spiders and Bots List](https://iabtechlab.com/software/iababc-international-spiders-and-bots-list/) to determine whether an event was produced by a user or a robot/spider based on its IP address and user agent.

Spiders and bots are sometimes considered a necessary evil of the web. We want search engine crawlers to find our site, but we also don't want a lot of non-human traffic clouding our reporting.

The Interactive Advertising Bureau (IAB) is an advertising business organization that develops industry standards, conducts research, and provides legal support for the online advertising industry.

Their internationally recognized list of spiders and bots is regularly maintained to try and identify the IP addresses of known bots and spiders.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/iab_spiders_and_robots_enrichment/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/iab_spiders_and_robots_enrichment.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

There are three fields that can be added to the `parameters` section of the enrichment configuration JSON:

- `ipFile`
- `excludeUseragentFile`
- `includeUseragentFile`

They correspond to one of the IAB/ABC database files, and need to have two inner fields:

- The `database` field containing the name of the database file.
- The `uri` field containing the URI of the bucket in which the database file is found. This field supports `http`, `https`, `gs` and `s3` schemes.

The table below describes the three types of database fields:

| **Field name**         | **Database description**                                          | **Database filename**           |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------- |
| `ipFile`               | Denylist of IP addresses considered to be robots or spiders       | `"ip_exclude_current_cidr.txt"` |
| `excludeUseragentFile` | Denylist of useragent strings considered to be robots or spiders  | `"exclude_current.txt"`         |
| `includeUseragentFile` | Allowlist of useragent strings considered to be browsers          | `"include_current.txt"`         |

All three of these fields **must** be added to the enrichment JSON, as the IAB lookup process uses all three databases in order to detect robots and spiders. Note that the database files are commercial and proprietary and should not be stored publicly – for instance, on unprotected HTTPS or in a public S3 bucket.

:::tip Snowplow CDI

If you use Snowplow CDI, the necessary files are already provided and updated by Snowplow. You can see the pre-configured URIs of these files in the default enrichment configuration in [Console](https://console.snowplowanalytics.com).

:::

### Custom user agent lists

:::note Availability
This feature is available since version 6.8.0 of Enrich.
:::

In addition to the IAB database files, you can provide custom lists of user agent strings to supplement the detection. Two optional fields can be added to the `parameters` section:

| **Field name**       | **Description**                                                                 |
| -------------------- | ------------------------------------------------------------------------------- |
| `excludeUseragents`  | A list of user agent strings to be treated as robots or spiders (in addition to the `excludeUseragentFile` database) |
| `includeUseragents`  | A list of user agent strings to be treated as browsers (in addition to the `includeUseragentFile` database) |

Both fields accept a JSON array of strings. They are optional and default to empty lists if omitted.

A user agent matching `excludeUseragents` produces the following output values:

| Field | Value |
| ----- | ----- |
| `spiderOrRobot` | `true` |
| `category` | `SPIDER_OR_ROBOT` |
| `reason` | `FAILED_UA_EXCLUDE` |
| `primaryImpact` | `UNKNOWN` |

A user agent matching `includeUseragents` produces the following output values:

| Field | Value |
| ----- | ----- |
| `spiderOrRobot` | `false` |
| `category` | `BROWSER` |
| `reason` | `PASSED_ALL` |
| `primaryImpact` | `NONE` |

Example:

```json
"excludeUseragents": ["my-custom-bot/1.0", "internal-crawler"],
"includeUseragents": ["my-legitimate-app/2.0"]
```

This is useful when you need to flag or allowlist specific user agents without modifying the IAB database files themselves.

:::info

These lists will take precedence over the IAB files. For example, a user agent added to `includeUseragents` will not be considered a robot even if it’s also in the `excludeUseragentFile` databaes.

:::

## Input

This enrichment uses the following fields of a Snowplow event:

- `useragent` to determine an event's user agent, which will be validated against the databases described in `excludeUseragentFile` and `includeUseragentFile`.
- `user_ipaddress` to determine an event's IP address, which will be validated against the database described in `ipFile`.
- `derived_tstamp` to determine an event's datetime. Some entries in the Spiders and Robots List can be considered "stale", and will be given a `category` of `INACTIVE_SPIDER_OR_ROBOT` rather than `ACTIVE_SPIDER_OR_ROBOT` based on their age.

## Output

This enrichment adds a new context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.iab.snowplow/spiders_and_robots/jsonschema/1-0-0).

Example:

```json
{
    "schema": "iglu:com.iab.snowplow/spiders_and_robots/jsonschema/1-0-0",
    "data": {
        "spiderOrRobot": false,
        "category": "BROWSER",
        "reason": "PASSED_ALL",
        "primaryImpact": "NONE"
    }
}
```
