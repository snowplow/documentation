---
position: 4
title: Create and deploy a view
---

A `View` is a collection of attributes that share a common entity (e.g., session or user). Here's how to create a view with the attributes we defined earlier:

```python
from snowplow_signals import View, domain_sessionid

my_attribute_view = View(
    name="my_attribute_view",
    version=1,
    entity=domain_sessionid,
     attributes=[
        page_view_count,
        products_added_to_cart_feature,
    ],
    owner="user@company.com",
)
```

Before deploying the view, you can test it on the atomic events table from the past hour:


```python
data = sp_signals.test(
    view=view,
    app_ids=["website"],
)
print(data)
```

Example Output

| **domain_sessionid** | **page_view_count** | **products_added_to_cart** |
| -------------------- | ------------------- | -------------------------- |
| xyz                  | 5                   | [`red_hat`, `blue_shoes`]  |
| abc                  | 3                   | [`green_trainers`]         |

:::warning
**Note:** You can filter on specific app_ids during testing. To avoid unnecessary compute, the streaming engine is typically configured to process only a subset of relevant app_ids. While you may be able to test using any app_id, bear in mind that data retrieval might not return expected results if that app_id isn't included in the streaming engine’s configuration.
:::

## Deploy the view

Once you're satisfied with the View, deploy it to the API using the `apply` method:

```python
sp_signals.apply([my_attribute_view])
```

This makes the View live, and events will start being processed based on the defined attributes.
