---
title: "New in Signals: attributes built for ML features"
description: "Recency and tenure aggregations, date part modifiers on timestamp properties, and an optional event filter make it possible to express common ML model features as Signals attributes."
date: "2026-08-27"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
---
Signals recently gained a [training dataset builder](/release-notes/new-in-signals-ml-training-datasets/), which turns the attribute groups you already serve from into a labeled training table in your warehouse. That closed the gap between training and serving: the same attribute definition produces the feature your model trains on and the feature it scores against.

It also put more weight on the definitions themselves. If a feature your model needs can't be expressed as a Signals attribute, it can't come from Signals at either end, and you're back to hand-written SQL for training and a separate code path at inference time.

Three additions to attribute definitions close some of the more common gaps. Recency and tenure are now aggregations rather than something you compute yourself, timestamps can be reduced to the part of the calendar that carries the signal, and the event filter is optional so an attribute can span every event type.

## Measure recency and tenure

How long ago something happened is one of the more predictive inputs available to a behavioral model, and until now it wasn't expressible as an attribute. You could count a user's page views or take the last value they produced, but "how long since they last visited" meant reading a raw timestamp out and doing the arithmetic in your own code.

Two aggregations now do it directly:

* `time_since_last` measures the duration since the most recent matching event, which is the recency signal behind re-engagement, churn, and session-freshness features.
* `time_since_first` measures the duration since the earliest matching event, which gives you tenure: cohort age, onboarding progress, and lifecycle stage.

Both take a `time_unit` of `s`, `min`, `h`, or `d`, and return a fractional duration in that unit. They always measure against the event's `derived_tstamp`, so there's no property to select.

The value is computed when you read the attribute, not when the event arrives, so it reflects the time elapsed at the moment of retrieval rather than a number that goes stale in the Profiles Store. A model scoring a visitor mid-session sees how long that visitor has actually been idle. Out-of-order events can't push the result below zero, as it's clamped at 0.

## Extract the part of a timestamp that carries signal

A raw timestamp is close to useless as a model feature, because every value is distinct. What tends to matter is the cyclical part: the hour of the day, the day of the week, or how many separate days a user has been active.

Timestamp properties now take an optional `date_part` modifier, which transforms the value before it's aggregated. Two families are available:

| Family | Date parts | Output |
| --- | --- | --- |
| Extract | `hour_of_day`, `day_of_week`, `month_of_year` | Integer for the cyclical component |
| Truncate | `active_day`, `active_week`, `active_month` | Date string truncated to the boundary |

Because the transform happens before aggregation, the existing aggregations compose with it to give you the feature you want from the same property. A `most_frequent` over `hour_of_day` is a peak-hour feature. A `category_count` over the same property is a full hour-of-day histogram. An `approx_count_distinct` over `active_day` counts how many distinct days a user showed up.

The modifier works on atomic timestamp fields such as `derived_tstamp`, and on any event or entity property whose schema declares `format: date-time`, so a timestamp you track yourself works the same way. It's also available in criteria, which lets you filter the events feeding an attribute by calendar position: weekdays only, or a single month.

## Calculate attributes across all event types

An attribute previously had to name at least one event schema. That's the right constraint for a feature about a specific behavior, but it gets in the way of the whole-pipeline features that models often want, where enumerating every schema is both tedious and wrong the moment someone adds a new event.

The event filter is now optional. Leave it empty, or pass `events=[]` in the Python SDK, and the attribute is calculated from every event Signals processes, including event types added after you published it.

This makes a general engagement counter a single definition rather than a list of schemas to maintain, and it means an attribute over an atomic property picks that property up wherever it appears. A first-touch `mkt_medium` attribute captures the value from whichever event carried it, with no need to work out in advance which schemas those might be.

Because an empty filter is indistinguishable from one you forgot to fill in, it has to be set deliberately. A request that sends an empty event list is read as matching all events rather than rejected, so it's worth confirming that's what you meant.

## Get started

All three are available in Console and in the Python SDK, for both stream and batch attribute groups. Upgrade to `snowplow-signals` version 0.4.8 or later to define them from the SDK.

See the documentation on [defining attributes](/docs/signals/attributes/attributes/) for the full reference, including which aggregations accept a date part and which attribute types each date part family requires. To use these attributes as model features, see [creating ML training datasets](/docs/signals/ml-training-datasets/).
