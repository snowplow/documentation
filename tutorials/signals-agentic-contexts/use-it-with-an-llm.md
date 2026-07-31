---
position: 4
title: "Use a Signals agentic context with an LLM"
sidebar_label: "Use it with an LLM"
description: "Paste a Signals agentic context narrative into any chat LLM, ask questions about the user's session, and refine the answers by editing the agentic context prompt."
keywords: ["agentic context", "llm context", "prompt engineering", "ai agent", "signals"]
date: "2026-07-29"
---

The narrative format exists so you can hand a model real user activity without writing any glue code. Do it by hand once, to see what the model infers from what you chose to capture.

## Ask a model about the user

If your assistant is connected to the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/), it can fetch the context and answer in one step:

```text
Fetch the session_context agentic context for session
2f8b41d0-5c6e-4a1b-9f3a-7d21c4e8b905, then answer as the support assistant would.
The user has just asked: "Do these run true to size?"
```

Otherwise, copy the whole narrative string from the previous page, paste it into any chat LLM, and add a question underneath:

```text
[paste the narrative here]

The user has just asked: "Do these run true to size?"
Answer them.
```

The model should pick up that this user has already read the reviews and the size guide, so it answers about fit rather than pointing them back to either. Your prompt and the `[START CONTEXT]` markers do the rest of the work, so there's no format to explain.

## Browse more, then ask again

The buffer is live, so keep browsing your site: add something to a cart, or move to a checkout page. Wait a few seconds, then retrieve the narrative again with the same session identifier.

The two new page views appear at the end, with the seconds since the session started showing the gap:

```text
You are a support assistant on a product website. The activity below is what the user has just been doing. Use it to work out what they are trying to achieve, then answer their question in that context. If the activity is too thin to tell, say so rather than guessing.
[START CONTEXT]
28 seconds on the current page. Session started 147 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /products/trail-running-shoes, {page_title: 'Trail running shoes | Example Shop'}
12, page_view, /products/trail-running-shoes/reviews, {page_title: 'Reviews: Trail running shoes | Example Shop'}
24, page_view, /size-guide, {page_title: 'Size guide | Example Shop'}
36, page_view, /support/returns-policy, {page_title: 'Returns policy | Example Shop'}
109, page_view, /cart, {page_title: 'Your cart | Example Shop'}
119, page_view, /checkout, {page_title: 'Checkout | Example Shop'}
[END CONTEXT]
```

Paste this newer version into a fresh chat and ask the same question. The answer should change: this user has reached a checkout rather than idly browsing a product page. Retrieve the context on every turn, so your agent always sees the current session.

## Change the prompt, not the capture

So far the prompt has framed this as a support job. Change that framing and the same activity supports a different conclusion. Ask your assistant to replace the prompt and publish the change, or click **Edit** on your agentic context's details page in Console, replace the **Prompt** text with this, then publish the draft:

```text
You are a conversion assistant on a product website. From the activity below,
identify the single biggest thing standing between this user and completing their
purchase, and suggest one concrete way to remove it. Say which part of the
activity tells you this.
```

Retrieve the narrative once more. Only the first line has changed:

```text
You are a conversion assistant on a product website. From the activity below, identify the single biggest thing standing between this user and completing their purchase, and suggest one concrete way to remove it. Say which part of the activity tells you this.
```

The captured events are unchanged, because the prompt doesn't affect what's buffered, so you can refine your wording against a session that's still in flight.

Ask a model the same question with this version and the emphasis moves. Where the support framing explained the returns policy, the conversion framing reads that same visit as hesitation about fit, and suggests addressing it at the checkout.
