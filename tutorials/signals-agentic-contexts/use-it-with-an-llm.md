---
position: 4
title: "Feed a Signals agentic context to your agent"
sidebar_label: "Feed it to your agent"
description: "Paste a Signals agentic context narrative into a chat LLM, then append it to your customer-facing agent's system prompt on every turn so its answers reflect the user's current session."
keywords: ["agentic context", "system prompt", "customer-facing agent", "llm context", "ai agent", "signals"]
date: "2026-08-04"
---

The narrative is a plain string, so any model can read it and any language can build it into a prompt. Try it by hand first, to see what a model infers from what you chose to capture, then put the same string into your agent.

## See what a model makes of it

Copy the whole narrative string from the previous page, paste it into any chat LLM, and add a question underneath:

```text
[paste the narrative here]

The user has just asked: "Do these run true to size?"
Answer them.
```

The model picks up that this user has already read the reviews and the size guide, so it answers about fit rather than pointing them back to either. Your prompt and the `[START CONTEXT]` markers do the rest of the work, so there's no format to explain.

## Add the narrative to your system prompt

Your agent does that same read on every turn, without anyone pasting anything. Its back-end already knows which session the conversation belongs to, so it retrieves the narrative for that `domain_sessionid` and appends it to the instructions it sends to the model. Your own instructions go first, and the narrative brings both the prompt you wrote and the activity itself:

```python
BASE_INSTRUCTIONS = (
    "You are the support assistant for Example Shop. "
    "Answer in two sentences or fewer, and link to a page on the site where it helps."
)

def build_system_prompt(domain_session_id):
    narrative = sp_signals.get_agentic_context(
        name="session_context",
        identifier=domain_session_id,
        format="narrative",
    )
    return f"{BASE_INSTRUCTIONS}\n\n{narrative}"
```

This uses the same `sp_signals` connection you built on the previous page, and `getAgenticContext` from the Node.js SDK slots in the same way. Call `build_system_prompt` at the start of every turn, then pass what it returns as the system prompt, or instructions, of your model call, alongside the conversation history and the user's new message. Whatever provider or framework you're on, that's the whole integration: one string, rebuilt per turn.

## Browse more, then ask again

Rebuilding per turn is what keeps the agent current, because the buffer is live. Keep browsing your site: add something to a cart, or move to a checkout page. Wait a few seconds, then retrieve the narrative again with the same session identifier.

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

Paste this newer version into a fresh chat and ask the same question. The answer changes: this user has reached a checkout rather than idly browsing a product page. An agent that rebuilds its system prompt each turn follows that shift on its own.

## Change the prompt, not the capture

Your agent's own instructions live in your code, but the prompt that tells it how to read the activity lives in the agentic context, so you can reshape its behavior without a deploy. So far that prompt has framed the job as support. Change the framing and the same activity supports a different conclusion. Ask your assistant to replace the prompt and publish the change, or click **Edit** on your agentic context's details page in Console, replace the **Prompt** text with this, then publish the draft:

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

## Take it into a framework

The pattern above holds wherever your agent runs. These tutorials build it into a working application, with the provider calls filled in:

* [Vercel AI SDK, in a Next.js application](/tutorials/signals-ai-agent-context/introduction)
* [Google ADK, with a React front end](/tutorials/signals-google-adk-agent/introduction)
* [Strands Agents on AWS Bedrock AgentCore](/tutorials/signals-agentic-accelerator/intro)
