---
title: "Introduction"
position: 1
sidebar_label: "Introduction"
description: "Learn how to train a purchase propensity model on Signals attributes with the dataset builder, and serve it against the same attributes in real time."
keywords: ["purchase propensity", "signals machine learning", "training dataset", "point-in-time correct", "real-time scoring"]
date: "2026-10-25"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

In this tutorial you'll build a model that predicts whether an ecommerce session will end in a purchase, and score live sessions with it while the user is still browsing.

The hard part of a real-time model is usually not the model. It's making sure that the features it trains on are computed the same way as the features it sees in production. If you write a SQL pipeline for training and separate code for serving, the two drift apart, and the model quietly gets worse. Signals avoids this by using one definition for both:

* The [dataset builder](/docs/signals/ml-training-datasets/) turns an [attribute group](/docs/signals/attributes/attribute-groups/) into a training table in your warehouse, computing each attribute as it was at each moment in the past
* The same attribute group, once published, is computed in real time from your event stream and served through the [Signals Profiles API](/docs/signals/applications/retrieve-attributes/)

By the end you'll have:

* A published attribute group with in-session shopping behavior, such as product views, cart additions, and checkout steps
* A labeled training dataset built by the Signals dataset builder, from your historical events or from the sample
* A gradient-boosted model trained and evaluated on that dataset
* A `/predict` endpoint that fetches a session's live attributes from Signals and returns a purchase score

This tutorial is for data scientists and engineers who want to train models on Snowplow behavioral data. You'll write and run the code in your own Python environment, for example a Jupyter notebook. To create the attribute group, you can use either the Python SDK or an AI assistant: the [Snowplow Assistant](/docs/ai/console-agent/) in Console, or your own assistant connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/). It should take around 30 minutes.

## How the pieces fit together

The `purchase_propensity` attribute group you'll define is used by two Signals components. The dataset builder computes it from the history in your warehouse, for training. The streaming engine computes it from live events, and the Profiles API serves the result, for scoring. The model itself runs in your own code:

```mermaid
flowchart LR
    site["Your website"] -- "events" --> pipeline["Snowplow pipeline"]

    subgraph warehouse["Your Snowflake"]
        events[("atomic.events")]
        table[("Training table")]
    end

    subgraph signals["Signals"]
        builder["Dataset builder"]
        engine["Streaming engine"]
        profiles["Profiles API"]
    end

    subgraph yours["Your code"]
        notebook["Training notebook"]
        predict["/predict endpoint"]
    end

    pipeline --> events
    pipeline --> engine
    events --> builder
    builder --> table
    table --> notebook
    notebook -- "trained model" --> predict
    engine --> profiles
    profiles -- "live attributes" --> predict
```

Each row in the training table is a moment in a past session, called an anchor. The row has the attribute values as they were at that moment, and a label that says whether the session went on to buy. At serving time, the live attribute values for a session describe the same moment: "now". The model sees the same columns in both cases.

## Prerequisites

You can follow the tutorial with your own ecommerce data, or with a sample dataset if you don't have any. The sample is a training table built from the public Google Analytics 4 Merchandise Store sample, converted to Snowplow events, and a script that sends shopper events in place of a website.

<Tabs groupId="data-source" queryString>
<TabItem value="own" label="Your own data" default>

This route assumes that you have:

* [Signals enabled](/docs/signals/setup/) with a Snowflake warehouse connection, because the dataset builder runs its queries in your Snowflake account
* [Snowplow ecommerce](/docs/sources/web-trackers/tracking-events/ecommerce/) events from a website in your Snowflake `atomic.events` table, including `product_view`, `add_to_cart`, and `transaction` actions, so the model has purchases to learn from: you'll check whether you have enough in [Build the dataset](../build-training-dataset/)
* A website that sends those events to your pipeline now, so you can watch scores for a live session
* Snowflake credentials that can read the schema Signals writes to, to load the training table
* Python 3.10 or later, and basic familiarity with pandas and scikit-learn

</TabItem>
<TabItem value="sample" label="Sample data">

This route assumes that you have:

* A Snowplow pipeline with [Signals enabled](/docs/signals/setup/), because Signals computes the live attributes from events sent to your Collector. If you don't have one, you can use the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral).
* Python 3.10 or later, and basic familiarity with pandas and scikit-learn

You don't need a warehouse or a website. You'll load the training table from a file, and send events with the Snowplow [Python tracker](/docs/sources/python-tracker/).

</TabItem>
</Tabs>

:::note[A pipeline is required]
Signals computes the live attributes from events flowing through your pipeline, so you can't complete this tutorial with [Snowplow Micro](/docs/testing/snowplow-micro/).
:::

Install the Python packages you'll use:

```bash
pip install "snowplow-signals>=0.4.9" "snowflake-connector-python[pandas]" scikit-learn joblib fastapi uvicorn
```

With the sample data, you can leave out `snowflake-connector-python[pandas]` and install `snowplow-tracker` instead.
