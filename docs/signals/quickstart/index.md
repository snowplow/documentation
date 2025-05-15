---
title: "Signals Quickstart"
sidebar_position: 10
description: "An overview of Signals concepts."
sidebar_label: "Quickstart Guide"
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
```

:::note 
You can try an interactive version of this quickstart on Google Colab [here](https://colab.research.google.com/drive/1ExqheS4lIuJRs0wk0B6sxaYfnZGcTYUv)
:::


Welcome to the Snowplow Signals Quickstart! This guide will walk you through the steps to set up and use Snowplow Signals to define attributes, create views, and retrieve user features. By the end of this guide, you'll have a working setup to personalize your applications using Snowplow Signals.

1. **Install and Set Up the SDK**: Get started with the Snowplow Signals SDK.
2. **Define an Attribute**: Learn how to define stream user behavior attributes.
3. **Create and Test a View**: Combine attributes into a view and test it.
4. **Deploy a View**: Push a view to the Profile API
5. **Retrieve Attributes**: Fetch user features from the Profile API.

## Step 1: Installation and Setup
The Snowplow Signals SDK allows you to define attributes, create views, and retrieve user features. It requires Python 3.12 or above.

Install the SDK using pip:

```bash
$ pip install snowplow-signals
```

To connect to your Signals deployment, you will need 4 values.

An API Key Id and the corresponding API Key (secret), which are generated from the [credentials section](https://console.snowplowanalytics.com/credentials) in BDP Console.

The organization ID, which can be retrieved from the URL immediately following the .com when visiting BDP Console:

![](../images/orgID.png)


```python
from snowplow_signals import Signals
signals = Signals(
    api_url="API_URL",
    api_key="API KEY",
    api_key_id="API_KEY_ID",
    org_id="ORG_ID",
)
```

## Step 2: Define an `Attribute`

An `Attribute` represents a specific fact about a user's behavior. For example, you can define an attribute to count the number of `page_view` events a user has made.

```python
from snowplow_signals import Attribute, Event

page_view_count = Attribute(
    name="page_view_count",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="counter"
)
```
You can refine to your attributes by adding `Criteria` to filter for specific events. For example:

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion

products_added_to_cart_feature = Attribute(
    name="products_added_to_cart",
    type="string_list",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow.ecommerce",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="unique_list",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].name",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart",
            ),
        ],
    ),
)
```

## Step 3: Create and test a `View`

A `View` is a collection of attributes that share a common entity (e.g., session or user). Here's how to create a view with the attributes we defined earlier:

```python
from snowplow_signals import View, session_entity

my_attribute_view = View(
    name="my_attribute_view",
    version=1,
    entity=session_entity,
     attributes=[
        page_view_count,
        products_added_to_cart_feature,
    ],

)
```

Before deploying the view, you can test it on the Atomic events table from the past hour:


```python
data = sp_signals.test(
    view=view,
    app_ids=["website"],
)
print(data)
```

Example Output

| **domain_sessionid** | **page_view_count** | **products_added_to_cart** |
|----------------------|--------------------|-----------------------------|
| xyz                  | 5                  | [`red_hat`, `blue_shoes`]   |
| abc                  | 3                  | [`green_trainers`]          | 


## Step 4: Deploy a `View` to Signals
Once you're satisfied with the View, deploy it to the API using the `apply` method:

```python
signals.apply([my_attribute_view])
```

This makes the View live, and events will start being processed based on the defined attributes.

## Step 5: Retrieve `Attributes` from Signals

Now that events are being processed, you can retrieve user features from the API:

```python
response = sp_signals.get_online_attributes(
    source=my_attribute_view,
    identifiers="abc-123",
)
```

Expected Output

| **domain_sessionid** | **page_view_count** | **products_added_to_cart** |
|-----------------------|---------------------|-----------------------------|
| abc-123              | 3                  | [`blue_shoes`]               |