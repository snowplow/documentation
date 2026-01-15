---
title: "Campaign and ad tracking"
sidebar_label: "Campaigns and ads"
sidebar_position: 40
description: "Track marketing campaigns with UTM parameters and ad performance with impression, click, and conversion events for attribution analysis."
keywords: ["utm parameters", "campaign tracking", "ad tracking", "impressions", "ad clicks", "attribution"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Campaign and ad tracking captures how users arrive at your site from marketing campaigns and how they interact with advertisements.

Use campaign and ad tracking to:

- Attribute traffic to specific marketing campaigns
- Measure ad impression and click performance
- Track conversions from ad campaigns
- Analyze the effectiveness of different marketing channels

## Campaign atomic event properties

The [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) can automatically capture UTM parameters from URLs and populate [atomic event properties](/docs/fundamentals/canonical-event/index.md#marketing-fields) for campaign analysis.

## Advertisement events

Ad tracking captures impressions, clicks, and conversions from advertisements displayed on your site or elsewhere.

See also [media tracking](/docs/events/ootb-data/media-events/index.md) for tracking advertising content consumed within video or audio media.

### Ad impression event

Track when an ad is displayed to a user.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: false}}
  example={{
    impressionId: "67965967893",
    costModel: "cpm",
    cost: 5.5,
    targetUrl: "http://www.example.com",
    bannerId: "23",
    zoneId: "7",
    advertiserId: "201",
    campaignId: "12"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an ad impression event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "ad_impression", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "impressionId": { "type": "string", "description": "Identifier for the impression instance" }, "costModel": { "type": "string", "enum": ["cpa", "cpc", "cpm"], "description": "The cost model: cpa, cpc, or cpm" }, "cost": { "type": "number", "description": "The cost of the impression" }, "targetUrl": { "type": "string", "description": "The destination URL" }, "bannerId": { "type": "string", "description": "Adserver identifier for the ad banner" }, "zoneId": { "type": "string", "description": "Adserver identifier for the zone" }, "advertiserId": { "type": "string", "description": "Adserver identifier for the advertiser" }, "campaignId": { "type": "string", "description": "Adserver identifier for the campaign" } }, "additionalProperties": false }} />

### Ad click event

Track when a user clicks on an ad.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: false}}
  example={{
    targetUrl: "http://www.example.com",
    clickId: "12243253",
    costModel: "cpm",
    cost: 2.5,
    bannerId: "23",
    zoneId: "7",
    impressionId: "67965967893",
    advertiserId: "201",
    campaignId: "12"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an ad click event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "ad_click", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "targetUrl": { "type": "string", "description": "The destination URL" }, "clickId": { "type": "string", "description": "Identifier for the click instance" }, "costModel": { "type": "string", "enum": ["cpa", "cpc", "cpm"], "description": "The cost model" }, "cost": { "type": "number", "description": "The cost of the click" }, "bannerId": { "type": "string", "description": "Adserver identifier for the ad banner" }, "zoneId": { "type": "string", "description": "Adserver identifier for the zone" }, "impressionId": { "type": "string", "description": "Links click to impression" }, "advertiserId": { "type": "string", "description": "Adserver identifier for the advertiser" }, "campaignId": { "type": "string", "description": "Adserver identifier for the campaign" } }, "required": ["targetUrl"], "additionalProperties": false }} />

### Ad conversion event

Track when a user completes a conversion action from an ad.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: false}}
  example={{
    conversionId: "743560297",
    costModel: "cpa",
    cost: 10,
    category: "ecommerce",
    action: "purchase",
    property: "",
    initialValue: 99,
    advertiserId: "201",
    campaignId: "12"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an ad conversion event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "ad_conversion", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "conversionId": { "type": "string", "description": "Identifier for the conversion instance" }, "costModel": { "type": "string", "enum": ["cpa", "cpc", "cpm"], "description": "The cost model" }, "cost": { "type": "number", "description": "The cost of the conversion" }, "category": { "type": "string", "description": "Conversion category" }, "action": { "type": "string", "description": "The type of user interaction, e.g. purchase" }, "property": { "type": "string", "description": "Describes the object of the conversion" }, "initialValue": { "type": "number", "description": "How much the conversion is initially worth" }, "advertiserId": { "type": "string", "description": "Adserver identifier for the advertiser" }, "campaignId": { "type": "string", "description": "Adserver identifier for the campaign" } }, "additionalProperties": false }} />

### Tracker support

This table shows the support for ad tracking across the main client-side [Snowplow tracker SDKs](~/docs/sources/index.md~).

| Tracker                                                                           | Supported | Since version                       | Auto-tracking | Notes                           |
| --------------------------------------------------------------------------------- | --------- | ----------------------------------- | ------------- | ------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/ads/index.md)                    | ✅         | 1.1.0 (directly), 3.0.0 (as plugin) | ❌             | Requires the ad tracking plugin |
| iOS                                                                               | ❌         |                                     |               |                                 |
| Android                                                                           | ❌         |                                     |               |                                 |
| React Native                                                                      | ❌         |                                     |               |                                 |
| Flutter                                                                           | ❌         |                                     |               |                                 |
| Roku                                                                              | ❌         |                                     |               |                                 |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md) | ✅         | v3                                  | ❌             |                                 |
