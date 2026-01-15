---
title: "Social media interaction tracking"
sidebar_label: "Social media interactions"
sidebar_position: 160
description: "Track user interactions with social media widgets including likes, shares, and retweets across Facebook, Twitter, and other platforms."
keywords: ["social media", "social interactions", "facebook", "twitter", "likes", "shares"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Social media interaction tracking captures how users engage with social widgets embedded on your website, such as like buttons, share buttons, and tweet buttons.

Use social interaction tracking to:

- Measure how often content is shared on social platforms
- Identify which social networks drive the most engagement
- Understand which content resonates with users enough to share
- Track the performance of social sharing features

## Social interaction event

The social interaction event captures the social network, the action performed (like, share, tweet), and optionally the target content.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: false}}
  example={{
    action: "like",
    network: "facebook",
    target: "pbz00123"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a social interaction event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "social_interaction", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "action": { "type": "string", "description": "The social action performed, e.g. like, retweet, share" }, "network": { "type": "string", "description": "The social network, e.g. facebook, twitter" }, "target": { "type": "string", "description": "The object of the social action, e.g. a page ID or product ID" } }, "required": ["action", "network"], "additionalProperties": false }} />

### Tracker support

This table shows the support for social interaction tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                    | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/social-media/index.md)    | ✅         | 2.0.0         | ❌             |
| iOS                                                                        | ❌         |               |               |
| Android                                                                    | ❌         |               |               |
| React Native                                                               | ❌         |               |               |
| Flutter                                                                    | ❌         |               |               |
| Roku                                                                       | ❌         |               |               |

Social interaction events require manual tracking. You need to implement event handlers for your social widgets that call the tracking method when users interact with them.
