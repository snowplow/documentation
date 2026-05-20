---
title: "Introduction to enrichments"
date: "2020-02-15"
sidebar_position: 2
sidebar_label: "Enrichments"
description: "Configure enrichments to add extra data to your Snowplow events."
keywords: ["enrichments", "event enrichment", "configurable enrichments"]
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'selfHosted']}
  helpContent="Enrichments are included with all Snowplow platforms."
/>
```

During enrichment, events are validated against their schemas, and additional data is attached to the events.

Snowplow runs two kinds of enrichments:
- **Configurable enrichments**, which you can opt into. Most produce entities attached to the event, though a few modify atomic event fields directly.
- **Hardcoded enrichments**, which always run as part of the common enrichment process. They populate [atomic event fields](/docs/fundamentals/canonical-event/index.md).

## Configurable enrichments

See the [available enrichments](/docs/pipeline/enrichments/available-enrichments/index.md) page for the full list, in execution order.

## Hardcoded enrichments

During enrichment, the [Enrich](/docs/api-reference/enrichment-components/index.md) application adds a number of fields to the event.

### Always populated

The following fields are always populated during the enrichment process:

| Added parameter    | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `v_etl`            | Version of the enrichment process.                 |
| `etl_tstamp`       | Timestamp the event began enrichment.              |
| `collector_tstamp` | Timestamp for the event recorded by the Collector. |
| `derived_tstamp`   | Calculated timestamp.                              |

See the [Timestamps overview page](/docs/events/timestamps/index.md) for more details on Snowplow timestamps.

### Conditionally populated

Some fields are populated depending on whether the tracker provided the corresponding value or not.

These parameters can be provided by the tracker or by the [Collector](/docs/pipeline/collector/index.md).

| Raw parameter | Enriched parameter | Purpose                                                                                                                               |
| ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `eid`         | `event_id`         | The unique event identifier (UUID). Trackers should always assign this value, but it can be assigned during enrichment as a fallback. |
| `cv`          | `v_collector`      | Collector type/version.                                                                                                               |
| `tnuid`       | `network_userid`   | User ID set by Snowplow using a third-party cookie. Overwritten with tracker-set `tnuid`.                                             |
| `ip`          | `user_ipaddress`   | The Collector logs IP address by default. You can override the value derived from the Collector by populating this in the tracker.    |
| `ua`          | `useragent`        | Raw user agent (browser string). Can be overwritten with `ua`.                                                                        |

The raw tracker payload parameters `res`, `ds`, and `vp` each combine a width and height into a single string, e.g. `1280x1024`. During enrichment, each is split into two separate integer fields.

| Raw parameter | Added parameters                        | Purpose                 |
| ------------- | --------------------------------------- | ----------------------- |
| `res`         | `dvce_screenwidth`, `dvce_screenheight` | Screen or monitor size. |
| `ds`          | `doc_width`, `doc_height`               | Page size.              |
| `vp`          | `br_viewwidth`, `br_viewheight`         | Viewport size.          |

The `url` parameter provides the [atomic `page_url` field](/docs/fundamentals/canonical-event/index.md#page-fields). During enrichment, the following parts are extracted to populate separate fields:

| Added parameter    | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `page_urlscheme`   | Scheme (protocol), for example `https`.          |
| `page_urlhost`     | Host (domain), for example `www.snowplow.io`.    |
| `page_urlport`     | Port if specified, 443 or 80 if not.             |
| `page_urlpath`     | Path to page, for example `/product/index.html`. |
| `page_urlquery`    | Query string, for example `id=GTM-DLRG`.         |
| `page_urlfragment` | Fragment (anchor), for example `4-conclusion`.   |

Similarly, the `refr` parameter provides the [atomic `page_referrer` field](/docs/fundamentals/canonical-event/index.md#page-fields). During enrichment, the following parts are extracted to populate separate fields:

| Added parameter    | Purpose                              |
| ------------------ | ------------------------------------ |
| `refr_urlscheme`   | Scheme (protocol).                   |
| `refr_urlhost`     | Host (domain).                       |
| `refr_urlport`     | Port if specified, 443 or 80 if not. |
| `refr_urlpath`     | Path to page.                        |
| `refr_urlquery`    | Query string.                        |
| `refr_urlfragment` | Fragment (anchor).                   |
