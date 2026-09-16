---
title: "Define attributes conversationally"
position: 3
sidebar_label: "Define attributes"
description: "Prompt the Snowplow Assistant or your own AI assistant to create a Signals stream attribute group, test it against warehouse data, and publish it."
keywords: ["signals attribute group", "snowplow assistant", "conversational configuration", "test attributes", "publish signals"]
date: "2026-08-04"
---

With your assistant ready, you can define your first attribute group by describing it. You'll create a stream [attribute group](/docs/signals/attributes/attribute-groups/) that calculates three session metrics from page view events, the same ones as in the [Signals quick start](/tutorials/signals-quickstart/define-attribute-group):

* How many page views occurred in the last 15 minutes, per session
* The last seen browser name, per session
* The first seen page referrer, per session

Send the prompts on this page in the assistant you chose on the previous page. They're the same in the Snowplow Assistant and in an MCP-connected assistant, and so are the resources they create.

:::note[Transcripts are representative]
The transcript excerpts on this page come from a real Claude Code session with the MCP server, condensed for readability. Assistant output varies between runs and between assistants, so the wording you see, and even the steps your assistant takes, will differ. What stays the same are the resources it creates, and those are what you'll verify in Console in the next step.
:::

## Describe the attribute group

Write your prompt as a goal, with the details the assistant needs: the group name, the attribute key to aggregate against, and what each attribute should calculate. Asking the assistant not to publish keeps you in control of the review.

```text
Create a stream attribute group called tut_mcp_session_metrics, keyed on
domain_sessionid, with three attributes calculated from page_view events:

1. page_view_count: how many page views in the last 15 minutes
2. most_recent_browser: the last seen browser name, from the YAUAA context
3. first_referrer: the first seen referrer host, ignoring empty referrers

Save it as a draft, don't publish it yet.
```

The assistant works out the rest: which aggregation each attribute needs, the attribute types, and the exact event and entity references. A representative response:

```text
Assistant:
[calls signals_list_attribute_keys]
[calls signals_create_attribute_group]

Created tut_mcp_session_metrics version 1 as a draft, keyed on the built-in
domain_sessionid attribute key:

- page_view_count (int32): counter of page_view events over a 15-minute period
- most_recent_browser (string): last aggregation on the agentName property of
  the yauaa_context entity
- first_referrer (string): first aggregation on the refr_urlhost atomic field,
  with a criteria filter excluding events where page_referrer is empty

It's not published, so Signals isn't calculating anything yet.
```

The `most_recent_browser` attribute relies on the [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/), which attaches a `yauaa_context` entity to each event. If it's not enabled on your pipeline, ask the assistant to check: it can list your enrichment configurations too.

## Review the draft

New attribute groups are saved as drafts: definitions in the registry that aren't deployed to any compute engine. Nothing is calculated, and nothing reaches your applications, until you publish.

Before moving on, review what was actually created rather than trusting the summary. Ask the assistant to show the full definition:

```text
Show me the full definition of tut_mcp_session_metrics.
```

The assistant returns the stored configuration. Check that:

* The attribute key is `domain_sessionid`
* `page_view_count` uses a `counter` aggregation with a 15-minute period (`PT15M`)
* `most_recent_browser` uses a `last` aggregation on the `yauaa_context` entity's `agentName` property
* `first_referrer` uses a `first` aggregation on `refr_urlhost`, with a criteria filter on `page_referrer`

You'll confirm the same details in Snowplow Console on the next page. If anything is off, say so in plain language, for example "the period should be 15 minutes, not 15 days", and ask the assistant to update the draft.

## Test against warehouse data

Before publishing, you can test what the group would calculate. Testing runs the attribute definitions against recent events in your warehouse's atomic events table and returns sample results, the same calculation as [previewing an attribute group](/tutorials/signals-quickstart/define-attribute-group#test-the-attribute-definitions) in Console.

```text
Test tut_mcp_session_metrics against recent events before we publish.
```

The assistant presents the sample results in its own way: some render a small table with one row per `domain_sessionid` value found in the sample, others summarize the values for each attribute in prose. Either way, use the results to sanity-check the definitions, and iterate conversationally if something looks wrong:

* If `most_recent_browser` is always null, the YAUAA enrichment probably isn't enabled on your pipeline
* If `first_referrer` is mostly null, your traffic may be mostly direct, so try a test visit that arrives via a link
* If no rows come back at all, there were no page view events in the sampled window, so check that your tracking is sending events

Adjust the draft as many times as you like: ask for a different period, another filter, or an extra attribute, and test again.

:::note[Testing requires a warehouse connection]
Signals runs test queries against your warehouse rather than the live stream, so testing attribute definitions requires a warehouse destination connected to your organization. Without one, publish the draft and verify it against live events instead: the next page checks the values Signals calculates.
:::

## Publish the attribute group

Once you're satisfied with the definition, publish it:

```text
Looks good. Publish tut_mcp_session_metrics.
```

```text
Assistant:
[calls signals_publish]

Published tut_mcp_session_metrics version 1. Signals is now calculating the
three attributes from your live event stream.
```

Publishing deploys the configuration to the Signals streaming engine. From this moment on, every page view event flowing through your pipeline updates the three attributes for its session. Stream attribute groups only process events from the publish time onwards, unless you configured a [backfill](/docs/signals/attributes/attribute-groups/#backfill-attributes) — see the [configuration workflow](/docs/signals/attributes/#configuration-workflow) for how the lifecycle fits together.

The assistant says it's published. Next, you'll confirm that independently in Console, and watch the attribute values change in real time.
