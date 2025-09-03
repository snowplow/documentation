---
title: "Retrieving calculated values from the Profiles Store"
sidebar_position: 30
sidebar_label: "Retrieving attributes"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Your calculated attributes are stored in the Profiles Store, and retrieved using [services](/docs/signals/concepts/#services).

To use attributes to take action in your application, you'll want to retrieve only the relevant values. This would usually be the attributes for the current user.

For example, use the current user's unique `domain_userid` identifier to retrieve attributes defined against the `domain_userid` attribute key.

You have three options for consuming attributes, depending on your use case or application:
* Signals Node.js SDK (TypeScript)
* Signals Python SDK
* Signals API

## Connecting to Signals

To retrieve attributes, you'll need to connect to your Signals deployment. Use the credentials shown on the Signals overview page in BDP Console.

Save the credentials into your environment or project secrets.

<!-- TODO image landing page -->

Install the SDK into your project, and connect to Signals.

<Tabs groupId="signals" queryString>
<TabItem value="python" label="Python" default>

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SP_API_URL,
    api_key=SP_API_KEY,
    api_key_id=SP_API_KEY_ID,
    org_id=SP_ORG_ID,
)
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

TODO

</TabItem>
</Tabs>

## Using a service

The easiest way to retrieve attributes is by using a [service](/docs/signals/concepts/#services). This allows you to retrieve attributes in bulk, from multiple attribute groups.

<Tabs groupId="signals" queryString>
<TabItem value="python" label="Python" default>

Use `get_service_attributes()` to retrieve attributes from a service. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

calculated_values = sp_signals.get_service_attributes(
    name="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

The table below lists all available arguments for `get_service_attributes()`

| Argument        | Description                                  | Type     | Required? |
| --------------- | -------------------------------------------- | -------- | --------- |
| `name`          | The name of the service                      | `string` | ✅         |
| `attribute_key` | The attribute key to retrieve attributes for | `string` | ✅         |
| `identifier`    | The specific attribute key value             | `string` | ✅         |

</TabItem>
<TabItem value="nodejs" label="Node.js">

TODO

</TabItem>
</Tabs>

## Retrieving individual attributes

You can also retrieve attributes directly from a specific [attribute group](/docs/signals/concepts/#attribute-groups). This is useful when:
* You want to retrieve only a small subset of attributes
* You haven't defined a service

<Tabs groupId="signals" queryString>
<TabItem value="python" label="Python" default>

Use `get_attributes()` to retrieve specific attributes. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

view_attributes = sp_signals.get_view_attributes(
    name="my_view",
    version=1,
    attributes=["page_view_count"],
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

The table below lists all available arguments for `get_view_attributes()`

| Argument        | Description                             | Type                         | Required? |
| --------------- | --------------------------------------- | ---------------------------- | --------- |
| `name`          | The name of the attribute group         | `string`                     | ✅         |
| `version`       | The attribute group version             | `int`                        | ✅         |
| `attributes`    | The names of the attributes to retrieve | `string` or list of `string` | ✅         |
| `attribute_key` | The attribute_key name                  | `string`                     | ✅         |
| `identifier`    | The specific attribute key value        | `string`                     | ✅         |

</TabItem>
<TabItem value="nodejs" label="Node.js">

TODO

</TabItem>
</Tabs>

## Using the Signals API

For use cases where you aren't able to use the Signals SDKs, use the Signals API to retrieve attributes. To access the full Swagger API documentation for your Signals deployment, use your Signals API URL followed by `/docs/`:

```bash
{{API_URL}}/docs/
```
