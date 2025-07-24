---
title: "Cross-navigation tracking"
description: "Configure cross-domain tracking to maintain user identity between different domains in your ecosystem"
date: "2025-07-26"
sidebar_position: 5
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

When users navigate between different domains in your ecosystem—such as from your main website to a subdomain, partner site, or mobile app—their user identity is typically lost. This creates gaps in your user journey data and makes it difficult to understand the complete customer experience across your digital properties.

Cross-navigation (also called cross-domain) tracking solves this problem by passing user identification data in URL parameters when users click links to other domains. This enables you to maintain user continuity across your applications.

You can configure the [web](/docs/sources/trackers/web-trackers/index.md) and [native mobile](/docs/sources/trackers/mobile-trackers/index.md) trackers to add an additional parameter named `_sp` to the querystring of outbound links. This process is called "link decoration".

## Querystring properties

The `_sp` querystring parameter has two different formats: extended or short. You can also configure exactly which properties you want to include.

Available properties:

| Property         | Description                                    | Extended | Short |
| ---------------- | ---------------------------------------------- | -------- | ----- |
| `domainUserId`   | Current tracker-generated UUID user identifier | ✅        | ✅     |
| `timestamp`      | Current epoch timestamp, ms precision          | ✅        | ✅     |
| `sessionId`      | Current session UUID identifier                | ✅        |       |
| `subjectUserId`  | Custom business user identifier                | ✅        |       |
| `sourceAppId`    | Application identifier                         | ✅        |       |
| `sourcePlatform` | Platform of the current device                 | ✅        |       |
| `reason`         | Custom link text or extra information          | ✅        |       |

For example, a decorated link might have this format:

```
appSchema://path/to/page?_sp=domainUserId.timestamp.sessionId.subjectUserId.sourceAppId.sourcePlatform.reason
```

## How are the querystring parameters processed?

By default, your pipeline will process only the short format querystring `_sp={domainUserId}.{timestamp}`, even if you've decorated the links with the extended format. To process the extra properties, you'll need to configure the [cross-navigation enrichment](/docs/pipeline/enrichments/available-enrichments/cross-navigation-enrichment/index.md).

Both default and extended formats will populate the [atomic](/docs/fundamentals/canonical-event/index.md) `refr_domain_userid` and `refr_dvce_tstamp` fields. The enrichment also adds a `cross_navigation` entity to the event.

| Feature                                                 | Default behavior | With cross-navigation enrichment |
| ------------------------------------------------------- | ---------------- | -------------------------------- |
| Processes short format `_sp={domainUserId}.{timestamp}` | ✅                | ✅                                |
| Processes extended format properties                    | ❌                | ✅                                |
| Populates `refr_domain_userid` field                    | ✅                | ✅                                |
| Populates `refr_dvce_tstamp` field                      | ✅                | ✅                                |
| Adds `cross_navigation` entity                          | ❌                | ✅                                |

## What do you need to configure?

To use cross-navigation tracking, you may need to configure it in multiple places, depending on your use case:
* [Web tracker configuration object](/docs/sources/trackers/web-trackers/cross-domain-tracking/index.md)
* [Mobile application tracking code](/docs/sources/trackers/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking)
* [Enable the cross-navigation enrichment](/docs/pipeline/enrichments/managing-enrichments/index.md) for your pipeline
