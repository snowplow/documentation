---
title: "Define attribute keys"
sidebar_position: 20
sidebar_label: "Attribute keys"
description: "Create custom attribute keys based on atomic properties to specify the analytical context for attribute calculations. Use built-in keys like domain_userid or define your own."
keywords: ["attribute keys", "custom attribute keys", "analytical context", "atomic properties"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

An [attribute key](/docs/signals/concepts/index.md#attribute-keys) is the identifier that attributes are calculated against. All attribute groups need an attribute key.

Signals includes four built-in attribute keys, based on commonly used identifiers from the atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-fields) in all Snowplow events.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

The built-in attribute keys are available to select when creating an attribute group in Snowplow Console: `domain_userid`, `domain_sessionid`, `network_userid`, and `user_id`.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Import the built-in attribute keys directly:

```python
from snowplow_signals import (
    domain_userid,
    domain_sessionid,
    user_id,
    network_userid,
)
```

</TabItem>
</Tabs>

## Custom attribute keys

You can define custom attribute keys to calculate attributes against any other Snowplow atomic property. Atomic properties are those defined in the [atomic fields](/docs/fundamentals/canonical-event/index.md#common-fields) of the core Snowplow event, not properties tracked as part of an entity.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Navigate to **Signals** > **Attribute keys** in Console. Click the **Create attribute key** button.

![Create attribute key form with name, description, and atomic property selection](../../images/attribute-key-create.png)

You will need to provide:
* A unique name
* An optional description
* An optional email address for the primary owner or maintainer
* Which [atomic](/docs/fundamentals/canonical-event/index.md#common-fields) property you want to calculate attributes against

To edit or delete a custom attribute key, go to the key details page and click the **Edit** button, or the `⋮` button followed by **Delete**.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Use the `AttributeKey` class to define a custom attribute key:

```python
from snowplow_signals import AttributeKey

app_id_attribute_key = AttributeKey(
    name="app_id_attribute_key",
    description="The id for the app",
    key="app_id",
)
```

The table below lists all available arguments:

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the attribute key | `string` | ✅ |
| `description` | A description of the attribute key | `string` | ❌ |
| `key` | The atomic property to join against (defaults to `name` if not set) | `string` | ❌ |
| `owner` | The owner of the attribute key | `string` | ❌ |
| `ttl` | Time attributes for this key will live in the Profiles Store | `timedelta` | ❌ |

Here's a full example using the atomic `platform` property:

```python
from datetime import timedelta
from snowplow_signals import AttributeKey

platform_attribute_key = AttributeKey(
    name="platform_tracking_attribute_key",
    description="Attribute key for analyzing user behavior patterns across different platforms",
    key="platform",
    owner="analytics-team@company.com",
    ttl=timedelta(days=365),
)
```

Custom attribute keys are used in attribute groups in the same way as built-in keys.

</TabItem>
</Tabs>
