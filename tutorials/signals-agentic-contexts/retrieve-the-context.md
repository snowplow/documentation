---
position: 3
title: "Retrieve a Signals agentic context as JSON or a narrative"
sidebar_label: "Retrieve the context"
description: "Find the domain_sessionid for a live session, then read the agentic context back from Signals as structured JSON or as a plain-language narrative, in Python or Node.js."
keywords: ["agentic context", "get_agentic_context", "domain_sessionid", "narrative format", "signals node sdk"]
date: "2026-08-04"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Your agentic context is live, so browse a few pages on your tracked site to give it something to capture. Visit several different pages, and leave a few seconds between them, so the record has a shape you can recognize later.

## Get the session identifier

An agentic context is scoped to one session, so you read it for a single `domain_sessionid` value. There are two ways to get one.

To find the identifier for the session you just generated, connect the [Snowplow Inspector](/docs/testing/snowplow-inspector/signals-integration/) browser extension to Signals, then browse your site with the extension open. Inspector builds its list of attribute keys from the events it observes, so the **Attributes** tab shows the `domain_sessionid` value for the session you're in.

In application code, read it client-side with the JavaScript tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/#domain-session-id) method and send it to your back-end, because retrieval happens server-side:

```javascript
const domainSessionId = sp.getDomainSessionId();
```

## Read it as JSON

In your own code, use `format="json"` when you want to work with the activity programmatically, for example to build your own prompt or apply your own logic. If you defined the agentic context in Console or with an assistant, install the SDK with `pip install snowplow-signals` and connect it using your [Signals connection credentials](/docs/signals/connection/):

```python
import os
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=os.environ["SP_API_URL"],
    api_key=os.environ["SP_API_KEY"],
    api_key_id=os.environ["SP_API_KEY_ID"],
    org_id=os.environ["SP_ORG_ID"],
)
```

Then pass the name of your agentic context and the session identifier:

```python
context = sp_signals.get_agentic_context(
    name="session_context",
    identifier="2f8b41d0-5c6e-4a1b-9f3a-7d21c4e8b905",
)
```

For a session that visited a product page, its reviews, the size guide, and then the returns policy, the response looks like this:

```json
{
  "summary": "13 seconds on the current page. Session started 50 seconds ago. Based on last 50 recorded events for the last 1800 seconds.",
  "attribute_key": "domain_sessionid",
  "identifier": "2f8b41d0-5c6e-4a1b-9f3a-7d21c4e8b905",
  "name": "session_context",
  "version": 1,
  "prompt": "You are a support assistant on a product website. The activity below is what the user has just been doing. Use it to work out what they are trying to achieve, then answer their question in that context. If the activity is too thin to tell, say so rather than guessing.",
  "started_at_ms": 1785334905303,
  "events": [
    {
      "derived_tstamp": "2026-07-29T14:21:45.303Z",
      "event_name": "page_view",
      "page_title": "Trail running shoes | Example Shop",
      "page_urlpath": "/products/trail-running-shoes"
    },
    {
      "derived_tstamp": "2026-07-29T14:21:57.373Z",
      "event_name": "page_view",
      "page_title": "Reviews: Trail running shoes | Example Shop",
      "page_urlpath": "/products/trail-running-shoes/reviews"
    },
    {
      "derived_tstamp": "2026-07-29T14:22:09.497Z",
      "event_name": "page_view",
      "page_title": "Size guide | Example Shop",
      "page_urlpath": "/size-guide"
    },
    {
      "derived_tstamp": "2026-07-29T14:22:21.632Z",
      "event_name": "page_view",
      "page_title": "Returns policy | Example Shop",
      "page_urlpath": "/support/returns-policy"
    }
  ]
}
```

The events are ordered oldest to most recent, so the last entry is the page the user is on, and each one carries the properties you selected plus a `derived_tstamp` that Signals adds for you. The `prompt` you wrote travels with the data, so whatever reads this context also gets its instructions.

## Read it as a narrative

Use `format="narrative"` when you want to drop the activity straight into a model's context without writing any formatting logic yourself. Signals returns a single string:

```python
narrative = sp_signals.get_agentic_context(
    name="session_context",
    identifier="2f8b41d0-5c6e-4a1b-9f3a-7d21c4e8b905",
    format="narrative",
)

print(narrative)
```

The same session comes back like this:

```text
You are a support assistant on a product website. The activity below is what the user has just been doing. Use it to work out what they are trying to achieve, then answer their question in that context. If the activity is too thin to tell, say so rather than guessing.
[START CONTEXT]
13 seconds on the current page. Session started 50 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /products/trail-running-shoes, {page_title: 'Trail running shoes | Example Shop'}
12, page_view, /products/trail-running-shoes/reviews, {page_title: 'Reviews: Trail running shoes | Example Shop'}
24, page_view, /size-guide, {page_title: 'Size guide | Example Shop'}
36, page_view, /support/returns-policy, {page_title: 'Returns policy | Example Shop'}
[END CONTEXT]
```

Your prompt comes first, then the activity wrapped in `[START CONTEXT]` and `[END CONTEXT]` markers so a model can tell your instructions from the data. The summary line tells the model how fresh the activity is, and the table gives one row per event with the seconds elapsed since the session started. The `page_title` you selected lands in `event_context`, because only `event_name` and `page_urlpath` have columns of their own.

## Retrieve it from Node.js

If your agent runs on Node.js, use the [Node.js SDK](/docs/signals/connection/#signals-nodejs-sdk) instead. Install it with `npm i @snowplow/signals-node`, then call `getAgenticContext` with the same arguments:

```javascript
import { Signals } from "@snowplow/signals-node";

const signals = new Signals({
  baseUrl: process.env.SNOWPLOW_SIGNALS_BASE_URL,
  apiKey: process.env.SNOWPLOW_SIGNALS_API_KEY,
  apiKeyId: process.env.SNOWPLOW_SIGNALS_API_KEY_ID,
  organizationId: process.env.SNOWPLOW_SIGNALS_ORG_ID,
});

const narrative = await signals.getAgenticContext({
  name: "session_context",
  identifier: domainSessionId,
  format: "narrative",
});

console.log(narrative);
```

Define agentic contexts in Console, with an assistant, or with the Python SDK, and read them back from either SDK.
