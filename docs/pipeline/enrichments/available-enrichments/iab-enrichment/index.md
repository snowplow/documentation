---
title: "IAB enrichment"
description: "Enable IAB enrichment to classify web traffic and filter invalid or non-human interactions from your behavioral data."
schema: "TechArticle"
keywords: ["IAB Enrichment", "Ad Blocking", "Traffic Classification", "Bot Detection", "IAB Standards", "Quality Filter"]
sidebar_position: 0
sidebar_label: IAB
---

The IAB Spiders & Robots enrichment uses the [IAB/ABC International Spiders and Bots List](https://iabtechlab.com/software/iababc-international-spiders-and-bots-list/) to determine whether an event was produced by a user or a robot/spider based on its’ IP address and user agent.

Spiders & bots are sometimes considered a necessary evil of the web. We want search engine crawlers to find our site, but we also don’t want a lot of non-human traffic clouding our reporting.

The Interactive Advertising Bureau (IAB) is an advertising business organization that develops industry standards, conducts research, and provides legal support for the online advertising industry.

Their internationally recognized list of spiders and bots is regularly maintained to try and identify the IP addresses of known bots and spiders.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/iab_spiders_and_robots_enrichment/jsonschema/1-0-0)
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

- The `database` field containing the name of the database file.
- The `uri` field containing the URI of the bucket in which the database file is found. This field supports `http`, `https`, `gs` and `s3` schemes.

The table below describes the three types of database fields:

| **Field name**         | **Database description**                                          | **Database filename**           |
|------------------------|-------------------------------------------------------------------|---------------------------------|
| `ipFile`               | Blacklist of IP addresses considered to be robots of spiders      | `"ip_exclude_current_cidr.txt"` |
| `excludeUseragentFile` | Blacklist of useragent strings considered to be robots or spiders | `"exclude_current.txt"`         |
| `includeUseragentFile` | Whitelist of useragent strings considered to be browsers          | `"include_current.txt"`         |

All three of these fields **must** be added to the enrichment JSON, as the IAB lookup process uses all three databases in order to detect robots and spiders. Note that the database files are commercial and proprietary and should not be stored publicly – for instance, on unprotected HTTPS or in a public S3 bucket.

## Input

This enrichment uses the following fields of a Snowplow event:

- `useragent` to determine an event’s user agent, which will be validated against the databases described in `excludeUseragentFile` and `includeUseragentFile`.
- `user_ipaddress` to determine an event’s IP address, which will be validated against the database described in `ipFile`.
- `derived_tstamp` to determine an event’s datetime. Some entries in the Spiders & Robots List can be considered “stale”, and will be given a `category` of `INACTIVE_SPIDER_OR_ROBOT` rather than `ACTIVE_SPIDER_OR_ROBOT` based on their age.

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
