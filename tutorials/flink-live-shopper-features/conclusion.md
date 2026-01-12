---
position: 5
title: "Conclusions from the Flink live shopper features accelerator"
sidebar_label: "Conclusion"
description: "Build sub-second real-time personalization with Snowplow, Flink, Kafka, and Redis to drive higher conversion and smarter marketing."
keywords: ["real-time personalization pipeline", "flink kafka redis architecture"]
---

Real-time streams let you see what a shopper is doing while the session is still active. Events leave the browser, flow through Snowplow, and reach Flink within milliseconds. This is important because the system can trigger actions that improve conversion.

Rolling and session windows turn raw events into metrics, and Redis makes each metric available to any service—chat bots, ML models, pricing engines, dashboards, etc.—all before the user moves on.

## Stack recap

- **Snowplow tracker**: captures clean, strictly defined events
- **Kafka**: buffers and scales traffic without spikes
- **Flink**: windows and aggregates in memory for sub-second output
- **Redis**: serves metrics with microsecond reads

All components run in Docker, so you can spin up the full pipeline with a single script—no cloud bill required.

## What you built

1. Started the stack with `./up.sh`
2. Tracked product views, cart events, and purchases in the demo store
3. Watched events flow through **Kafka** (via **AKHQ**) and metrics appear in **Redis** (via **Redis Insights**)
4. Added your own calculation (most viewed brand) and published it live
5. Verified that low-latency metrics fed downstream apps in real time

## Business impact

- **Higher conversion**: personalized offers and live chat triggers reach shoppers before they leave
- **Smarter marketing**: real-time, segmented audiences feed email, ad, and push platforms with fresh intent data
- **Data consistency**: a single source of truth powers both real-time and long-term analytics, reducing duplication and errors

With these steps, you now have a repeatable blueprint for turning live behavioral data into immediate, actionable insight.
