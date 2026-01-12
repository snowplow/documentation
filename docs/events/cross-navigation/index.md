---
title: "Cross-navigation tracking"
sidebar_label: "Cross-navigation tracking"
description: "Configure cross-domain tracking to maintain user identity between different domains in your ecosystem"
date: "2025-07-26"
sidebar_position: 5
keywords: ["cross-domain tracking", "link decoration", "user identity", "cross-navigation"]
---

When users navigate between different domains in your ecosystem, their user identity may get fragmented. Examples include navigation from your main website to a partner site, or to a mobile app. This creates gaps in your user journey data and makes it difficult to understand the complete customer experience across your digital properties.

:::info Web subdomains
This problem doesn't usually apply for navigation between web subdomains, for example between `www.example.com` and `blog.example.com`. This is because the web trackers have `discoverRootDomain` [enabled by default](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).
:::

Cross-navigation (also called cross-domain) tracking solves this problem by passing user identification data in URL parameters when users click links to other domains. This enables you to maintain user continuity across your applications.

To use cross-navigation tracking, configure the [web](/docs/sources/web-trackers/cross-domain-tracking/index.md) or [native mobile](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking) trackers to add an additional parameter, named `_sp`, to the querystring of outbound links. This process is called "link decoration".

Link decoration makes the added values visible in the `url` field of events on the destination page or URI. The querystring is added only to the events at the destination page: it doesn't persist throughout the user's session.

## Querystring properties

The `_sp` querystring parameter has two different formats: extended or short. You can also configure exactly which properties you want to include.

Available properties:

| Property         | Description                                    | Extended | Short |
| ---------------- | ---------------------------------------------- | -------- | ----- |
| `domainUserId`   | Current tracker-generated UUID user identifier | ✅        | ✅     |
| `timestamp`      | Current epoch timestamp, millisecond precision | ✅        | ✅     |
| `sessionId`      | Current session UUID identifier                | ✅        |       |
| `subjectUserId`  | Custom business user identifier                | ✅        |       |
| `sourceId`       | Application identifier                         | ✅        |       |
| `sourcePlatform` | Platform of the current device                 | ✅        |       |
| `reason`         | Custom information or identifier               | ✅        |       |

For example, the link `appSchema://path/to/page` would look like this after decoration with the full extended format:

```
appSchema://path/to/page?_sp=domainUserId.timestamp.sessionId.subjectUserId.sourceId.sourcePlatform.reason
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
