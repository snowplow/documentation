---
position: 2
title: Setup
---

## Architectural overview

You can find the architectural overview in [this Excalidraw scene](https://link.excalidraw.com/l/E5gTPZc8rA/8vfgGl2Soqx).

![live-shopper-setup-architecture.svg](./images/live-shopper-setup-architecture.svg)

## How to run

1. [**Clone the repository**](https://github.com/snowplow-industry-solutions/flink-live-shopper)
2. Run the script `up.sh`
3. Access the main interfaces:
   - **Store**: http://localhost:3000  
   - **AKHQ**: http://localhost:8085  
   - **Redis Insights**: http://localhost:5540  
   - **Flink dashboard**: http://localhost:8081  
   - **Grafana**: http://localhost:3001  

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

To test the system, log in to the ecommerce store using one of the [**mock users**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store/blob/main/src/mocks/users.ts).

Open a product listed on the homepage. You should see data flowing to the `enriched-good` topic via [**AKHQ**](http://localhost:8085). This is the same data ingested by Flink to derive metrics.

All calculated metrics will appear in [**Redis Insights**](http://localhost:5540).

If you don't see any data flowing, check that the ecommerce store is sending events correctly. Ad blockers can interfere with event tracking—make sure to disable them for full functionality.

The data in Redis is now available to be consumed by any application, system, or process—for example, an AI agent can use this data to determine the next best action.
