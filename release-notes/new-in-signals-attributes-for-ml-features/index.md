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
The [training dataset builder](/release-notes/new-in-signals-ml-training-datasets/) turns the attribute groups you already serve from into a labeled training table in your warehouse, so one definition produces both the feature your model trains on and the feature it scores against.

That makes the definitions the limit. Three additions widen what you can express as an attribute.

## Measure recency and tenure

`time_since_last` and `time_since_first` return how long ago an event happened, in the `time_unit` you pick (`s`, `min`, `h`, or `d`). Minutes since the last page view:

```python
Attribute(
    name="minutes_since_last_page_view",
    type="double",
    aggregation="time_since_last",
    time_unit="min",
    events=[Event(vendor="com.snowplowanalytics.snowplow", name="page_view", version="1-0-0")],
)
```

Swap the aggregation for `time_since_first` and the same definition gives you tenure instead of recency: how long since the user's first page view, for cohort age or lifecycle stage. Recency feeds churn and re-engagement features, or an intervention rule such as "this session has gone quiet for more than five minutes."

Both always measure against the event's `derived_tstamp`, so there's no `property` to set. Signals computes the value when you read the attribute, not when the event arrives, so a model scoring a visitor mid-session sees how long that visitor has actually been idle rather than a stored number that ages. Out-of-order events can't produce a negative result, as the value is clamped at 0.

## Apply a date part to a timestamp

A raw timestamp is hard to use as a feature because every value is distinct. The `date_part` modifier transforms it before aggregation, into either a cyclical integer (`hour_of_day`, `day_of_week`, `month_of_year`) or a truncated date string (`active_day`, `active_week`, `active_month`).

```python
AtomicProperty(name="derived_tstamp", date_part="hour_of_day")
```

Because the transform happens before aggregation, the aggregation you pair it with decides the feature:

| Aggregation over `hour_of_day` | Result |
| --- | --- |
| `most_frequent` | The user's peak hour, as an `int32` such as `14` |
| `category_count` | An hour-of-day histogram of event counts |
| `unique_list` | The distinct hours the user was active |

Pair `active_day` with `unique_list` for the list of dates a user showed up, or with `approx_count_distinct` for a count of active days. Filtering to weekdays is `day_of_week` `in` `[1,2,3,4,5]`, following ISO 8601 where 1 is Monday.

The modifier works on atomic timestamp fields such as `derived_tstamp`, and on any event or entity property whose schema declares `format: date-time`, so a timestamp you track yourself behaves the same way.

## Calculate attributes across all event types

Pass `events=[]` and the attribute is calculated from every event Signals processes, including event types you add later. A total engagement counter over a rolling 30-day window:

```python
Attribute(
    name="n_events_30d",
    type="int32",
    events=[],
    aggregation="counter",
    period=timedelta(days=30),
)
```

Previously this meant listing every schema in your pipeline and updating the list whenever someone added an event. The same applies to attributes over atomic properties: a `first` aggregation on `mkt_medium` with no event filter captures first-touch marketing medium from whichever event carried it, with no need to work out in advance which schemas those are.

One thing to know: an empty filter looks the same as one you meant to fill in and didn't. Signals treats it as match-all rather than returning a validation error, so check that's what you intended.

## Getting started

All three are available in Console and in the Python SDK, for both stream and batch attribute groups. Upgrade to `snowplow-signals` version 0.4.8 or later to define them from the SDK.

The documentation on [defining attributes](/docs/signals/attributes/attributes/) has the full reference, including every aggregation that accepts a date part and the attribute types each date part family requires. For using these attributes as model features, see [creating ML training datasets](/docs/signals/ml-training-datasets/).
