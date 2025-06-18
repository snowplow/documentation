---
title: Defining Snowplow Signals Attributes
position: 3
---

> **Note:** You can follow along with this guide by viewing the notebook in [this repository](https://github.com/snowplow/snowplow-media-demo).

### Install the Snowplow Signals Python SDK

Open a new Python notebook (or copy the notebook above) and install the Snowplow Signals Python SDK:

```bash
pip install snowplow-signals
```

> The Snowplow Signals SDK requires Python 3.11+.

---

### Connect to Snowplow Signals

You’ll need the following to connect to Snowplow Signals:

- **Signals API URL:** You can find this in Snowplow BDP Console
- **Signals API Key + Key ID:** Generate these within the [Snowplow BDP Console](https://console.snowplowanalytics.com/credentials)
- **Snowplow Organisation ID:** Find this in the URL of any BDP Console page, e.g. `https://console.snowplowanalytics.com/<organisation-id>/homepage`

Insert these details into a Python Notebook to initialise the connection:

```python
from snowplow_signals import Signals

signals = Signals(
  api_url="YOUR_API_URL",
  api_key="YOUR_API_KEY",
  api_key_id="YOUR_API_KEY_ID",
  org_id="YOUR_ORG_ID",
)
```

---

### Define Attributes

Attributes in Snowplow Signals represent specific facts about user behavior, calculated from events in your Snowplow pipeline.

For a newspaper recommendation engine, you might want to:

- Count how many times a user reads articles in each category (e.g., business, technology)
- Track the title of the last article a user read

Based on these attributes we can recommend articles to a user based on categories they find engaging and articles similar to the last article they read.

First, import the required classes:

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion
```

#### Example: Count Business Article Reads

This attribute counts the number of `article_details` events where the `category` is `"business"`.

```python
article_category_business_read_count = Attribute(
  name="article_category_business_read_count",
  type="int32",
  aggregation="counter",
  events=[
    Event(
      vendor="com.snplow.example",
      name="article_details",
      version="1-0-0",
    )
  ],
  criteria=Criteria(
    all=[
      Criterion(
        property="unstruct_event_com_snplow_sales_aws_article_details_1:category",
        operator="=",
        value="business"
      )
    ]
  )
)
```

Let's break down what that code does:
- We have created an attribute with a name of article_category_business_read_count and set the type to be an integer.
- We defined the aggregation method to be a counter, which makes the attribute count the number of events
- Next we define the Snowplow Event we wish to include as part of this attribute, in this case we are using the article_details event we defined earlier in this tutorial.
- Lastly we filter those events using Criteria to count to only those which have the property category set to “business”.

Next we want to repeat the step above to create attributes for the rest of the article categories.


#### Example: Last Article Read

Lastly we want to define another attribute to contain the title of the last article a user has read. We can do that by defining the following attribute:

```python
article_last_read = Attribute(
  name="article_last_read",
  type="string",
  aggregation="last",
  events=[
    Event(
      vendor="com.snplow.example",
      name="article_details",
      version="1-0-0",
    )
  ],
  property="unstruct_event_com_snplow_sales_aws_article_details_1:name"
)
```

---

### Define a View & Service

Now we have defined all our Attributes, the next step we need to do is put all of the Attributes into a View and define a Service which we will use to retrieve the attribute values on our website.

You can think of a View and a Service as the following:
- **Views** are a versioned collection of attributes grouped by a common Entity (e.g., session_id or user_id).
- **Services** are a collection of views that streamlines the retrieval of multiple views and are used in real-time applications to retrieve attributes.

You can define Views and Services by performing the following:

```python
media_demo_view = View(
  name="media_demo_view",
  version=1,
  entity="domain_userid",  # Entity over which attributes are calculated
  online=True,             # Enable Snowplow Signals Real-time calculation of Attributes
  owner="joe.bloggs@snowplow.io",
  attributes=[
    article_last_read,
    article_category_business_read_count,
    article_category_ai_read_count,
    article_category_data_read_count,
    article_category_technology_read_count
  ]
)

media_demo_service = Service(
  name="media_demo_service",
  description="Media Demo Service",
  views=[media_demo_view],
  owner="joe.bloggs@snowplow.io"
)
```

---

### Test Your View

Now that you have successfully created a View and Service for your attributes, you can perform the following to test how your attributes currently look

#### Test Using the Data Warehouse

Signals provide a way to test how your attributes look using historical data. You can do this by running the following code and passing through the View you created earlier. It will generate a sample of attributes over the past hour from your atomic events table.

```python
data = signals.test(
  view=media_demo_view,
  app_ids=["website"],
)
print(data)
```

#### Test Using the Real-time Stream

Additionally, you may wish to see how the attributes are calculated in real-time for a certain identifier (user or session). 

For example, you can generate events on your own device and use the Snowplow inspector to identify your `domain_userid` and see how the attributes are calculated.

You can do that by running the following code:

```python
response = signals.get_online_attributes(
  source=media_demo_service,
  identifiers="INSERT_YOUR_ID"  # UUID for your entity value from the View eg. a domain_userid or domain_sessionid
)

print(response.model_dump()['data'])
```
