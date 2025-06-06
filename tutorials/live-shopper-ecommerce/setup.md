---
position: 2
title: Setup
---

## Architectural overview

You can find the architectural overview in [this Excalidraw scene](https://link.excalidraw.com/l/E5gTPZc8rA/8vfgGl2Soqx).

![live-shopper-setup-architecture.svg](./images/live-shopper-setup-architecture.svg)

This architecture includes four key parts:

### 1. Snowplow: Event capture and ingestion

- **E-store front-end and Snowplow JavaScript tracker**: Every click (e.g., product view, add to cart) is emitted as a structured Snowplow event.
- **Snowplow Local to Kafka**: Events are validated and enriched with device and geolocation data, then forwarded into Kafka. Kafka provides ordering guarantees and back-pressure protection.

### 2. Real-time stream processing in Flink

- **Source**: A single Flink job reads from the `enriched-good` topic.
- **Branching by event type**: The stream is split into four logical lanes (product, category, cart, purchase).
- **Keying and windowing**:
  - **Rolling windows** (5 min, 1 h, 24 h): Keyed by `user_id` for always-fresh “last-N-minutes” stats.
  - **Session windows**: Keyed by `session_id`, grouping events into sessions that end after 30 minutes of inactivity.
- **Aggregations**: Each lane computes its own features (e.g., view counts, average price, cart value, session duration).
- **Metric parsers**: Convert aggregated values into one or more metrics. For example, a unique product count may feed both product view metrics and average viewed price metrics.

### 3. Feature store and action loop

- **Sink to Redis**: Flink writes each metric to Redis using deterministic keys like `user:{id}:{feature}_{window}` or `session:{sid}:{metric}`, making Redis a low-latency feature store.
- **Backend consumers**: The e-store backend (or any downstream app like ML models or dashboards) can retrieve metrics in microseconds to:
  - trigger live-chat prompts when high-value carts stall
  - send discounts based on price sensitivity
  - feed both real-time dashboards and long-term analytics using consistent definitions

### 4. Why this layout matters

- **Sub-second freshness**: Metrics are computed in the stream, not via nightly batch jobs, so they’re actionable in-session.
- **Single source of truth**: The same logic powers dashboards and in-session nudges.
- **Composable and portable**: The entire system runs in Docker, and can be adapted to cloud-managed Kafka/Flink/Redis with minimal changes.

---

## How to run

1. [**Clone the repository**](https://github.com/snowplow-industry-solutions/flink-live-shopper)
2. Run the script `up.sh`
3. Access the main interfaces:
   - **Store**: http://localhost:3000  
   - **AKHQ**: http://localhost:8085  
   - **Redis Insights**: http://localhost:5540  
   - **Flink dashboard**: http://localhost:8081  
   - **Grafana**: http://localhost:3001  

---

## Dataflow steps

1. **Client-side tracking**:
   - The Next.js-based ecommerce store emits user interactions (e.g., `product_view`, `add_to_cart`) using the Snowplow JavaScript tracker.

2. **Ingestion pipeline**:
   - Events are captured by the **Collector** and processed via **Enrich**.
   - **Snowbridge** forwards enriched events into **Kafka** topics.

   ![live-shopper-setup-kafka.png](./images/live-shopper-setup-kafka.png)

3. **Stream processing (Apache Flink)**:
   - Events are parsed, filtered, and routed into logical branches.
   - Processing includes:
     - **Product features**: Count views, average viewed price, price range
     - **Cart behavior**: Add/remove counts, cart value, update frequency
     - **Category engagement**: Category views, repeat views
     - **Purchase history**: Aggregate purchases over rolling windows (e.g., 24 hours) to calculate total spend, order count
     - **Session analytics**: Duration, bounce rate, marketing source

   ![live-shopper-setup-flink.png](./images/live-shopper-setup-flink.png)

4. **Feature store (Redis)**:
   - Metrics are written to **Redis** using deterministic keys (e.g., `user:{user_id}:{feature}_{window}`)
   - These metrics are available for real-time lookups by downstream systems.

   ![live-shoper-setup-redis.png](./images/live-shoper-setup-redis.png)

---

To test the system, log in to the ecommerce store using one of the [**mock users**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store/blob/main/src/mocks/users.ts).

Open a product listed on the homepage. You should see data flowing to the `enriched-good` topic via [**AKHQ**](http://localhost:8085). This is the same data ingested by Flink to derive metrics.

All calculated metrics will appear in [**Redis Insights**](http://localhost:5540).

If you don't see any data flowing, check that the ecommerce store is sending events correctly. Ad blockers can interfere with event tracking—make sure to disable them for full functionality.

The data in Redis is now available to be consumed by any application, system, or process—for example, an AI agent can use this data to determine the next best action.
