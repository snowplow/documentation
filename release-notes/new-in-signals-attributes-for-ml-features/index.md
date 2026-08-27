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
The [training dataset builder](/release-notes/new-in-signals-ml-training-datasets/) turns the attribute groups you already serve from into a labeled training table in your warehouse. The same attribute definition then produces the feature your model trains on and the feature it scores against at inference time.

That makes the definitions themselves the limit. If a feature your model needs can't be written as a Signals attribute, it can't come from Signals at either end, which leaves you maintaining SQL for training and separate code at inference time. Three additions to attribute definitions widen what you can express.

## Measure recency and tenure

Two new aggregations measure how long ago an event happened. `time_since_last` measures the duration since the most recent matching event, for features about re-engagement, churn, or whether a session has gone quiet. `time_since_first` measures the duration since the earliest matching event, which gives you cohort age, onboarding progress, and lifecycle stage.

Both take a `time_unit` of `s`, `min`, `h`, or `d` and return a fractional duration in that unit. They always measure against the event's `derived_tstamp`, so there's no property to select.

Signals computes the value when you read the attribute rather than when the event arrives, so it reflects the time elapsed at the moment of retrieval instead of a stored number that ages. A model scoring a visitor mid-session sees how long that visitor has actually been idle. Out-of-order events can't produce a negative result, as the value is clamped at 0.

Previously you could count a user's page views or read the timestamp of their last one, but converting that timestamp into an elapsed duration meant doing the arithmetic in your own code, at both training and inference time.

## Apply a date part to a timestamp

Timestamp properties now take an optional `date_part` modifier, which transforms the value before it's aggregated. A raw timestamp is hard to use as a model feature because every value is distinct. What a model can use is the hour of the day, the day of the week, or a count of the separate days a user has been active.

There are two families:

| Family | Date parts | Output |
| --- | --- | --- |
| Extract | `hour_of_day`, `day_of_week`, `month_of_year` | Integer for the cyclical component |
| Truncate | `active_day`, `active_week`, `active_month` | Date string truncated to the boundary |

Because the transform happens before aggregation, the existing aggregations combine with it to produce different features from the same property. A `most_frequent` over `hour_of_day` gives you a peak hour. A `category_count` over the same property gives you an hour-of-day histogram. An `approx_count_distinct` over `active_day` counts how many separate days a user showed up.

The modifier works on atomic timestamp fields such as `derived_tstamp`, and on any event or entity property whose schema declares `format: date-time`, so a timestamp you track yourself behaves the same way. It's also available in criteria, which lets you filter the events feeding an attribute by calendar position: weekdays only, or a single month.

## Calculate attributes across all event types

The event filter is now optional. Leave it empty, or pass `events=[]` in the Python SDK, and Signals calculates the attribute from every event it processes, including event types you add after publishing.

An attribute previously had to name at least one event schema. That fits a feature about one specific behavior, but it made whole-pipeline features awkward, because you had to list every schema and then remember to update the list whenever someone added an event.

A general engagement counter is now a single definition rather than a list of schemas to maintain. An attribute over an atomic property also picks that property up wherever it appears, so a first-touch `mkt_medium` attribute captures the value from whichever event carried it, without you working out in advance which schemas those are.

One thing to know: an empty filter looks the same as one you meant to fill in and didn't. A request sending an empty event list creates a match-all attribute rather than returning a validation error, so it's worth checking that's what you intended.

## Getting started

All three are available in Console and in the Python SDK, for both stream and batch attribute groups. Upgrade to `snowplow-signals` version 0.4.8 or later to define them from the SDK.

The documentation on [defining attributes](/docs/signals/attributes/attributes/) has the full reference, including which aggregations accept a date part and which attribute types each date part family requires. For using these attributes as model features, see [creating ML training datasets](/docs/signals/ml-training-datasets/).
