---
title: "Verify and refine"
position: 4
sidebar_label: "Verify and refine"
description: "Confirm the conversationally created attribute group in Snowplow Console, retrieve live attribute values, then add an attribute and republish through the assistant."
keywords: ["verify attribute group", "snowplow console", "retrieve attributes", "snowplow inspector", "republish"]
date: "2026-07-29"
---

The assistant reports success, but the real test is whether the configuration exists in your Snowplow account and produces values. In this step you'll verify both, then make your first conversational edit.

## Confirm the group in Console

Log in to [Snowplow Console](https://console.snowplowanalytics.com) and go to **Signals** > **Attribute groups**. You should see `tut_mcp_session_metrics` in the list, at version 1, with a published status.

Open it and check the definition against what you reviewed in the previous step:

* Attribute key: `domain_sessionid`
* `page_view_count`: counter of `page_view` events, 15-minute period
* `most_recent_browser`: last `agentName` from the `yauaa_context` entity
* `first_referrer`: first `refr_urlhost`, filtered to non-empty referrers

This is the same screen you'd have used to build the group by hand in the [quick start](/tutorials/signals-quickstart/define-attribute-group). Whether a group was created through the Console UI, the Python SDK, or an AI assistant, it lands in the same registry, and Console is always the neutral place to audit what's deployed.

## Retrieve live attribute values

Now generate some data. Open your tracked website and view a few pages, so your session produces page view events. You'll need your session ID to look up the calculated attributes: install the [Snowplow Inspector](/docs/testing/snowplow-inspector/) browser extension, select one of your page view events, and copy the `domain_sessionid` value from its details.

The Inspector can also display Signals attributes directly: with the [Signals integration](/docs/testing/snowplow-inspector/signals-integration/) configured, the extension shows the calculated attribute values for your current session alongside the events, updating as you browse.

Alternatively, retrieve the values with one Signals Python SDK call. Install the SDK in a fresh environment:

```bash
python3 -m venv signals-env
source signals-env/bin/activate
pip install snowplow-signals
```

Then fetch the attributes for your session, using the [connection credentials](/docs/signals/connection/) from earlier in this tutorial:

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url="https://YOUR_ID.signals.snowplowanalytics.com",
    api_key="YOUR_API_KEY",
    api_key_id="YOUR_API_KEY_ID",
    org_id="YOUR_ORG_ID",
)

attributes = sp_signals.get_group_attributes(
    name="tut_mcp_session_metrics",
    version=1,
    attributes=["page_view_count", "most_recent_browser", "first_referrer"],
    attribute_key="domain_sessionid",
    identifier="YOUR_SESSION_ID",
)
print(attributes)
```

The output shows the values Signals calculated from the page views you just generated:

```text
{'first_referrer': 'www.google.com', 'most_recent_browser': 'Chrome', 'page_view_count': 3}
```

You can ask the assistant for the same lookup — "what are the current attribute values for session YOUR_SESSION_ID?" calls the `signals_get_online_attributes` tool — but retrieving them yourself, from the same Profiles Store your applications will read, is the verification that counts. View another page and query again: `page_view_count` increments within seconds.

## Add an attribute and republish

Attribute groups rarely stay finished. Ask the assistant to extend the group:

```text
Add a most_recent_page_title attribute to tut_mcp_session_metrics: the last
seen page title for the session. Then republish it.
```

```text
Assistant:
[calls signals_update_attribute_group]
[calls signals_publish]

Added most_recent_page_title (string, last aggregation on the page_title
atomic field) to tut_mcp_session_metrics version 1 and republished it. The
group now calculates four attributes.
```

The update tool edits the version you name and returns it to draft until it's published again. The values already in the Profiles Store are unaffected: after republishing, existing attributes like `page_view_count` continue counting from where they left off.

:::note[Versioning published groups]
Editing a group in place is convenient while you're iterating alone. If applications already consume the group in production, ask the assistant to create the next version instead, and migrate consumers deliberately. See [versioning](/docs/signals/attributes/attribute-groups/#versioning) for how versions behave.
:::

Verify the change the same way as before: the group's page in Console now lists four attributes, and after viewing another page on your site, a retrieval call for the extra attribute returns its value:

```text
{'first_referrer': 'www.google.com', 'most_recent_browser': 'Chrome', 'most_recent_page_title': 'Checkout', 'page_view_count': 4}
```

You've now completed the full loop: defined, tested, published, verified, refined, and republished a Signals attribute group without leaving your assistant, with every change confirmed in Console or from the Profiles Store.
