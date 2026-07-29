---
position: 4
title: "Use a Signals agentic context with an LLM"
sidebar_label: "Use it with an LLM"
description: "Paste a Signals agentic context narrative into any chat LLM, ask questions about the user's session, and refine the answers by editing the agentic context prompt."
keywords: ["agentic context", "llm context", "prompt engineering", "ai agent", "signals"]
date: "2026-07-29"
---

The narrative format exists so you can hand a model real user activity without writing any glue code. Before wiring it into an agent framework, it's worth doing it by hand once, to see what the model can and can't infer from what you chose to capture.

You don't need an API key or an SDK for this page. Any chat LLM will do.

## Ask a model about the user

Copy the whole narrative string from the previous page, paste it into a chat LLM, and add a question underneath. For example:

```text
[paste the narrative here]

The user has just asked: "Do these run true to size?"
Answer them.
```

The model should pick up that this user has already read the reviews and the size guide, so it shouldn't send them back to either. A generic assistant with no context would suggest exactly that. This difference is the whole point of an agentic context.

Notice that you didn't have to explain the format, label the columns, or tell the model what a session is. The `[START CONTEXT]` markers and the summary line do that work, and your prompt is already sitting at the top of the string.

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
```

Paste this newer version into a fresh chat and ask the same question. The answer should change, because the situation has: this user has reached a checkout, not idly browsing a product page. That's what "real-time context" buys you, and it's why an agent should re-read the context on every turn rather than caching it.

## Change the prompt, not the capture

So far the prompt has framed this as a support job. Change that framing and the same activity supports a different conclusion. Edit the **Prompt instructions** field of your agentic context in Console and publish it again:

```text
You are a conversion assistant on a product website. From the activity below,
identify the single biggest thing standing between this user and completing their
purchase, and suggest one concrete way to remove it. Say which part of the
activity tells you this.
```

Retrieve the narrative once more. Only the first line has changed:

```text
You are a conversion assistant on a product website. From the activity below, identify the single biggest thing standing between this user and completing their purchase, and suggest one concrete way to remove it. Say which part of the activity tells you this.
[START CONTEXT]
77 seconds on the current page. Session started 197 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
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

Every captured event survived the change, because the prompt has no effect on what gets buffered. Publishing a new prompt doesn't reset the session, so you can refine your wording against a session that's still in flight.

Ask a model the same question with this version and the emphasis moves. Where the support framing explained the returns policy, the conversion framing is more likely to read that same visit as hesitation about fit and to suggest addressing it at the checkout.

:::tip[Iterate on the prompt first]
The prompt is the least expensive part of the configuration to change, so it's the first place to look when an agent's answers disappoint. Before you add events or properties to the capture, try rewording the prompt: state the agent's role, what it should conclude, and what to do when the activity is inconclusive.
:::

## What to do differently in an agent

Two habits carry over from this manual exercise. Retrieve the context on every turn, because a session that's minutes old is a different session. And keep the capture narrow: every property you add is context the model has to read, so add one only when it changes what the agent can conclude.
