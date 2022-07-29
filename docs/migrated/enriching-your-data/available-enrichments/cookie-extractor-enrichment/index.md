---
title: "Cookie extractor enrichment"
date: "2020-02-14"
sidebar_position: 60
---

This enrichment can extract name/value pairs from a cookie set on the domain and attach them to the event as derived contexts.

A powerful attribute of having Snowplow event collection on our own domain is the ability to capture values in first-party cookies set by other services such as ad servers or content management software (CMS).

By capturing these cookie fields set by third parties on our domain and attaching them to the event we can potentially use the identifiers to better identify users of our site.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/cookie_extractor_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/cookie_extractor_config.json)

In the configuration we specify the list of cookie keys for which we want to extract the value and attach it to the event.

The example configuration is capturing Scala Stream Collector’s own “sp” cookie value but in practice we would probably want to extract other more valuable cookies available on the company domain.

## Input

This enrichment uses the `Cookie` HTTP header.

## Output

For **each** key listed in the configuration, a context with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.ietf/http_cookie/jsonschema/1-0-0) is added to the enriched event. Each context contains only one key/value pair.
