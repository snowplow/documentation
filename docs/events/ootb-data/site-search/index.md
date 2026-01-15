---
title: "Site search tracking"
sidebar_label: "Site search"
sidebar_position: 150
description: "Track internal site search queries with search terms, filters, and result counts to analyze user search behavior and content discovery."
keywords: ["site search", "search tracking", "search terms", "search results"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Site search tracking captures how users search within your website. This data helps you understand what content users are looking for, whether they find it, and how search influences their journey through your site.

Use site search tracking to:

- Identify popular search terms and content gaps
- Measure search success rates based on result counts
- Analyze how search filters affect user behavior
- Optimize your internal search functionality

The site search event captures the search terms, any filters applied, and the number of results returned.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: false}}
  example={{
    terms: ["unified", "log"],
    filters: {"category": "books", "sub-category": "non-fiction"},
    totalResults: 14,
    pageResults: 8
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a site search event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "site_search", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "terms": { "type": "array", "items": { "type": "string" }, "description": "The search terms" }, "filters": { "type": "object", "additionalProperties": { "oneOf": [{ "type": "string" }, { "type": "boolean" }] }, "description": "The search filters" }, "totalResults": { "type": "integer", "minimum": 0, "maximum": 2147483647, "description": "The total number of results" }, "pageResults": { "type": "integer", "minimum": 0, "maximum": 2147483647, "description": "The number of results on the page" } }, "required": ["terms"], "additionalProperties": false }} />

## Tracker support

This table shows the support for site search tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                           | Supported | Since version | Auto-tracking | Notes                         |
| --------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ----------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/site-search/index.md)            | ✅         | 3.0.0         | ❌             | Requires site tracking plugin |
| iOS                                                                               | ❌         |               |               |                               |
| Android                                                                           | ❌         |               |               |                               |
| React Native                                                                      | ❌         |               |               |                               |
| Flutter                                                                           | ❌         |               |               |                               |
| Roku                                                                              | ❌         |               |               |                               |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md) | ✅         | v3            | ❌             |                               |
