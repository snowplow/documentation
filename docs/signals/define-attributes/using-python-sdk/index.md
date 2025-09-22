---
title: "Defining attributes using the Python SDK"
sidebar_position: 200
sidebar_label: "Using the Python SDK"
description: "Use the Snowplow Signals Python SDK to programmatically define attribute groups and services via code."
---

The pages in this section describe how to use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) to define attribute groups and services. See the [interventions section](/docs/signals/define-interventions/index.md) to learn how to [define interventions](/docs/signals/define-interventions/using-python-sdk/index.md) using the SDK.

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` object:

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_DEPLOYED_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)
```

Check out the [attribute groups](/docs/signals/define-attributes/using-python-sdk/attribute-groups/index.md) and [services](/docs/signals/define-attributes/using-python-sdk/services/index.md) pages to learn how to configure them programmatically.

Read more about retrieving calculated attributes in [Retrieving values](/docs/signals/retrieve-attributes/index.md).
