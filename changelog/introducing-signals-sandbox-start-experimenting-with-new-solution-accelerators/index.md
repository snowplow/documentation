---
title: "Introducing Signals Sandbox: start experimenting with new solution accelerators"
description: "The Snowplow Signals Sandbox is available today to all users."
date: "2025-11-05"
update_type:
  - "Product news"
components:
  - "Signals"
---
The Snowplow [Signals Sandbox](http://try-signals.snowplow.io) is available today to all users.

This free, ready-to-use environment allows developers to experiment with real-time customer intelligence without setting up any infrastructure.

We’re also releasing two Solution Accelerators that make it easy to explore what’s possible with [Snowplow Signals](https://snowplow.io/signals). Each accelerator provides open-source reference code, schema definitions, and a clear architectural pattern for production-grade, agentic applications.

## **Try Snowplow Signals in Minutes**

The [Signals Sandbox](http://try-signals.snowplow.io) provides a ready-to-use environment for testing how behavioral data becomes real-time intelligence. No Kafka setup, Flink configuration, or Redis deployment is required.

Simply sign up with your GitHub account at [try-signals.snowplow.io](http://try-signals.snowplow.io) and you get:

* A complete Signals environment with streaming data from a live e-commerce demo
* Real-time feature computation and profile updates you can watch happen
* The ability to write and test Interventions using Python scripts
* Direct integration with OpenAI or AWS Bedrock to experiment with AI agents

New users should start with our [E-Commerce Interventions Tutorial](http://signals-interventions/start). This walks you through the fundamentals of tracking events, computing features, updating user profiles, and defining rule-based interventions.

From there, you can explore the more advanced use cases in our Solution Accelerators.

## **Solution Accelerators: Design Patterns for Intelligent Apps**

### **1.Real-Time Personalization for Digital Travel Bookings**

[View accelerator →](/tutorials/signals-personalize-travel/intro/)

This accelerator is a travel platform simulation. It shows how AI agents can query the Profiles API for instant context.

The architecture demonstrates how Signals computes features like recent_destination_views and luxury_interest_score in real time, then feeds them into an OpenAI-powered agent that personalizes responses on the fly:

```
profile = profiles_api.get(user_id)
prompt = f"""
The user has viewed {profile["recent_destination_views"]} luxury destinations
and has a loyalty_tier of {profile["loyalty_tier"]}.
Suggest an upgrade or high-value recommendation.
"""
ai_response = openai_client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": prompt}]
)
```

When the agent responds, Signals executes a rules-based Intervention, such as displaying a premium offer or opening a chat prompt, completing the feedback loop.

### **2. ML-Based Prospect Scoring**

[View accelerator →](/tutorials/signals-ml-prospect-scoring/intro/)

This accelerator shows you how to integrate machine learning models into the Signals workflow for real-time lead scoring.

A predictive model trained on historical data outputs a base_prospect_score. Signals then merges this with streaming features like feature_usage_10min to calculate a live_prospect_score that updates as behavior changes.

When the score crosses a threshold, an Intervention fires automatically:

```
if (liveProspectScore > 0.8) {
  interventions.trigger({
    id: "notify_sales_team",
    payload: { userId, liveProspectScore },
  });
}
```

This eliminates the need for a separate feature store or heavy orchestration.[ ](https://example.com)

## **Start building today:**

1. Try the [Signals Sandbox](http://try-signals.snowplow.io)

2. Complete the [E-Commerce Interventions Tutorial](http://signals-interventions/start)

3. Explore Solution Accelerators:

   * [Real-Time Personalization for Travel](/tutorials/signals-personalize-travel/intro/)
   * [ML-Based Prospect Scoring](/tutorials/signals-ml-prospect-scoring/intro/)

4. For complete technical details, see our [documentation](/docs/signals/connection/).

Build faster. Build smarter. Build with context.
