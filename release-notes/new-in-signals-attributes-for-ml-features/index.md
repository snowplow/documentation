---
title: "New in Signals: recency, tenure, and time-of-day attributes"
description: "Time since aggregations, date part modifiers on timestamps, and an optional event filter cover more of the feature set a behavioral model needs."
date: "2026-08-27"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
---
A propensity model is mostly a question about timing and habit. Is this user back sooner than usual, or have they gone quiet? Are they new, or have they been around for months? Do they shop on weekday evenings, and is this a weekday evening? How many separate days have they shown up at all?

Those features were awkward to build in Signals. You could count a user's page views and take the last value of a property, but recency, tenure, and time-of-day meant pulling raw timestamps out and doing the arithmetic yourself, in two places: once over history to train, and again at serving time to score. Since the [training dataset builder](/release-notes/new-in-signals-ml-training-datasets/) now generates training data from the same attribute definitions you serve from, anything you can't define as an attribute is work you maintain twice.

Three additions close most of that gap.

## Recency and tenure

[Time since aggregations](/docs/signals/attributes/attributes/#time-since-aggregations) answer "how long ago" directly, in seconds, minutes, hours, or days. `time_since_last` gives you recency, the signal behind churn, re-engagement, and whether a session has gone quiet. `time_since_first` gives you tenure: cohort age, onboarding progress, lifecycle stage.

Both are computed when you read the attribute, not when the event arrives, so a model scoring someone mid-session sees how long they have actually been idle rather than a value that aged in storage.

## Seasonality and habit

A raw timestamp is hard for a model to learn from, since every value is unique. [Date parts](/docs/signals/attributes/attributes/#apply-a-date-part) reduce one to the part a model can learn from: hour of day, day of week, month of year, or the day, week, and month a user was active.

Combined with the aggregations Signals already has, that covers a useful range. Peak shopping hour, most common active weekday, an hour-by-hour histogram of when someone engages, or a count of the distinct days they have shown up, which is a decent proxy for habit. Date parts also work in [criteria](/docs/signals/attributes/attributes/#filter-with-criteria), so you can build features from weekday traffic only.

## All event features

Some features are about a user's overall activity rather than one behavior, and those needed you to list every event schema in your pipeline and keep the list current. The [event filter is now optional](/docs/signals/attributes/attributes/#select-events): leave it empty and the attribute covers every event Signals processes, including event types you add later.

That makes total engagement counters a single definition, and it lets an attribute follow a property wherever it appears, such as capturing first-touch `mkt_medium` from whichever event carried it.

## Getting started

All three are available in Console and in the Python SDK, for both stream and batch attribute groups. Upgrade to `snowplow-signals` version 0.4.8 or later to use them from the SDK.

The [defining attributes](/docs/signals/attributes/attributes/) page has runnable examples for each, including [time since last event](/docs/signals/attributes/attributes/#time-since-last-event), [most frequent hour of day](/docs/signals/attributes/attributes/#most-frequent-hour-of-day), and a [global event counter](/docs/signals/attributes/attributes/#global-event-counter). To use these as model features, see [creating ML training datasets](/docs/signals/ml-training-datasets/).
