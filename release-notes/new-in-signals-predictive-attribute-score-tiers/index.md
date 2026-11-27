---
title: "New in Signals: score tiers for predictive attributes"
description: "Name ranges of predictive attribute scores, such as the top 10% of sessions, and get the name back with each score, so your application acts on a tier instead of a hard-coded cutoff."
sidebar_label: "Signals predictive attribute score tiers"
keywords: ["predictive attributes", "score tiers", "propensity score", "percentile", "Signals"]
date: "2026-11-27"
category:
  - "Product news"
components:
  - "Signals"
---
A [predictive attribute](/docs/signals/predictive-attributes/) scores how likely a session is to reach a goal, such as a purchase. The score ranks sessions, but it isn't a calibrated probability, and its range can shift each time you retrain. Until now, acting on it meant picking a score cutoff, writing it into your application, and revisiting it after every new training.

Score tiers let you name ranges of score percentiles instead, such as `hot` for percentiles 90 to 99, roughly the top 10% of scores in training, and `warm` for 75 to 89. Each training works out its own percentile boundaries from its evaluation data, and the score response now includes the name of the tier the score falls in, as `tier`. Your application checks for `hot` rather than a number, and a new training starts with the same tiers, so the name keeps its meaning when you retrain.

Training results also include more detail on how scores relate to real outcomes. Each training now reports the goal rate and share of examples in each score percentile, and the model's mean score to compare with the baseline goal rate. In Console, the training review page has a **Conversion by score percentile** chart, where you add tiers and see each one's share of the evaluation data, conversion rate, and lift over the baseline before you publish.

Predictive attributes are in public preview, so their configuration, API, and behavior may change before they're generally available.

## How to use score tiers

Set tiers on a training's review page in Console, or with the Signals API, while the training is unpublished. They go live when you publish the training.

See [Set score tiers](/docs/signals/predictive-attributes/#set-score-tiers) to define them, and [Interpret the score](/docs/signals/applications/predictive-attributes/#interpret-the-score) to use them in your application.
