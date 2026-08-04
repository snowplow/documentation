---
title: "Connect Signals to the Google ADK agent"
sidebar_label: "Connect Signals and agent"
position: 5
description: "Fetch Signals profile attributes and the agentic context narrative from Python, inject both into a Google ADK agent's system instruction each turn, and forward the Snowplow session ID from the React front-end through CopilotKit."
keywords: ["Google ADK", "CopilotKit", "AG-UI", "Signals", "agentic context", "LlmAgent", "before_model_callback"]
date: "2026-08-04"
---

The next step is to connect Signals to the Google ADK agent, and forward the Snowplow session ID through CopilotKit so the agent knows which user to fetch context for.

## Fetch Signals context from Python

Your agent will fetch two kinds of context from Signals on every turn, using the same session ID for both:

* Profile attributes, from the [service](/docs/signals/concepts/#services): computed aggregates that you format into an instruction section yourself
* Recent session activity, from the [agentic context](/docs/signals/applications/agentic-contexts/): fetched with `format="narrative"`, which returns a ready-made text block, so there's no formatting code to write

Create a module inside the `agent/` directory that fetches both, wrapping the [Snowplow Signals Python SDK](/docs/signals/connection/):

```python
# agent/signals_context.py
from __future__ import annotations

import os
from typing import Optional

from snowplow_signals import Signals

_signals_client: Optional[Signals] = None

def _get_signals_client() -> Optional[Signals]:
    """Lazily initialize the Signals client from environment variables."""
    global _signals_client
    if _signals_client is not None:
        return _signals_client

    api_url = os.getenv("SNOWPLOW_SIGNALS_BASE_URL")
    api_key = os.getenv("SNOWPLOW_SIGNALS_API_KEY")
    api_key_id = os.getenv("SNOWPLOW_SIGNALS_API_KEY_ID")
    org_id = os.getenv("SNOWPLOW_SIGNALS_ORG_ID")

    if not all([api_url, api_key, api_key_id, org_id]):
        return None

    _signals_client = Signals(
        api_url=api_url,
        api_key=api_key,
        api_key_id=api_key_id,
        org_id=org_id,
    )
    return _signals_client

def _get_profile_section(client: Signals, domain_session_id: str) -> str:
    """Profile attributes: computed aggregates, served by the Signals service."""
    service_name = os.getenv("SNOWPLOW_SIGNALS_SERVICE_NAME")
    if not service_name:
        return ""

    # get_service_attributes() returns a plain dict[str, Any], with a key for
    # every attribute in the service. Attributes the session hasn't produced a
    # value for yet come back as None, so drop them rather than telling the
    # model "page_views_count: None".
    attributes = client.get_service_attributes(
        name=service_name,
        attribute_key="domain_sessionid",
        identifier=domain_session_id,
    )
    known = {key: value for key, value in attributes.items() if value is not None}
    if not known:
        return ""

    lines = [f"- {key}: {value}" for key, value in known.items()]
    return "\n".join(
        [
            "## User profile (Snowplow Signals attributes)",
            "Computed attributes describing the current user's session so far:",
            *lines,
        ]
    )

def _get_activity_section(client: Signals, domain_session_id: str) -> str:
    """Session activity: LLM-ready narrative, served by the agentic context."""
    context_name = os.getenv("SNOWPLOW_SIGNALS_AGENTIC_CONTEXT_NAME")
    if not context_name:
        return ""

    # format="narrative" returns a ready-to-use string, not a response object
    narrative = client.get_agentic_context(
        name=context_name,
        identifier=domain_session_id,
        format="narrative",
    )
    if not narrative:
        return ""

    return "\n".join(
        [
            "## Recent session activity (Snowplow Signals agentic context)",
            narrative,
        ]
    )

def get_signals_sections(domain_session_id: str) -> list[str]:
    """Fetch both kinds of Signals context as instruction sections.

    Each fetch is independent, so one section can appear without the other.
    Returns an empty list when Signals is not configured, the session ID is
    empty, or both fetches come back empty — the agent then degrades
    gracefully to its base instruction.
    """
    client = _get_signals_client()
    if client is None or not domain_session_id:
        return []

    sections: list[str] = []
    for label, fetch in (
        ("profile attributes", _get_profile_section),
        ("session activity", _get_activity_section),
    ):
        try:
            section = fetch(client, domain_session_id)
        except Exception as exc:  # noqa: BLE001
            print(f"[signals-context] {label} fetch failed: {exc}")
            continue
        if section:
            sections.append(section)

    return sections
```

The profile fetch returns raw attribute values from the service, which `_get_profile_section()` formats into a Markdown list:

```json
{
  "first_event_timestamp": "2026-07-30T14:02:53.477Z",
  "last_event_timestamp": "2026-07-30T14:03:12.840Z",
  "page_views_count": 6,
  "unique_pages_viewed": [
    "http://localhost:3000/",
    "http://localhost:3000/products/electronics",
    "http://localhost:3000/products/clothing/linen-overshirt",
    "http://localhost:3000/products/electronics/wireless-headphones",
    "http://localhost:3000/pricing"
  ]
}
```

`unique_pages_viewed` holds full URLs, because the Basic Web template builds it from the `page_url` atomic property. Your agentic context selects `page_urlpath` instead, so the same six page views appear there as paths. Both describe the same browsing at different levels of detail.

The activity fetch needs no formatting. With `format="narrative"`, `get_agentic_context()` returns the prompt you configured, followed by a block delimited by `[START CONTEXT]` and `[END CONTEXT]`. For the same six-page browsing session, that looks like:

```text
You are a helpful assistant for Signal Shop. Use this recent activity to understand what the user is exploring right now, and tailor your answers to it.
[START CONTEXT]
59 seconds on the current page. Session started 78 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /, {page_title: 'Signal Shop'}
3, page_view, /products/electronics, {page_title: 'Electronics | Signal Shop'}
7, page_view, /products/electronics/wireless-headphones, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
11, page_view, /products/clothing/linen-overshirt, {page_title: 'Linen Overshirt | Signal Shop'}
16, page_view, /products/electronics/wireless-headphones, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
19, page_view, /pricing, {page_title: 'Pricing | Signal Shop'}
[END CONTEXT]
```

Signals generates the opening summary and the event table from the events you selected when defining the agentic context.

## Build the agent

Replace the scaffold's `agent/main.py` with one that reads the Snowplow session ID from state and calls `get_signals_sections` on every turn.

```python
# agent/main.py
from __future__ import annotations

import logging
import os
import sys
from typing import Any, Optional

from ag_ui.core.types import RunAgentInput
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from dotenv import load_dotenv
from fastapi import FastAPI
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse
from starlette.requests import Request

from signals_context import get_signals_sections

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="[agent] %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger("signals_agent")

BASE_INSTRUCTION = """You are a helpful assistant for Signal Shop.
Help users understand features, answer questions, and guide them through their journey.

When real-time user context is available below, use it to personalize your responses.
The user profile section describes the session in aggregate. The recent session
activity section lists what the user has just been doing, oldest event first.
Reference what the user has been looking at to give more relevant answers."""

def inject_signals_context(
    callback_context: CallbackContext,
    llm_request: LlmRequest,
) -> Optional[LlmResponse]:
    """Fetch both kinds of Signals context each turn and append them to the instruction."""
    state_dict = callback_context.state.to_dict()
    domain_session_id = state_dict.get("snowplowDomainSessionId", "")
    log.info(
        "before_model_callback: state_keys=%s snowplow_session_id=%r",
        list(state_dict.keys()),
        domain_session_id,
    )

    if not domain_session_id:
        return None

    sections = get_signals_sections(domain_session_id)
    if not sections:
        return None

    log.info("injecting %d signals section(s)", len(sections))
    llm_request.append_instructions(sections)
    return None

root_agent = LlmAgent(
    name="SignalsAgent",
    model="gemini-2.5-flash",
    instruction=BASE_INSTRUCTION,
    before_model_callback=inject_signals_context,
)

# ADKAgent exposes the LlmAgent over the AG-UI protocol
adk_agent = ADKAgent(
    adk_agent=root_agent,
    app_name="signals_adk_agent",
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True,
)

async def extract_snowplow_session(
    request: Request, input_data: RunAgentInput
) -> dict[str, Any]:
    """Pull the Snowplow session ID from CopilotKit's forwarded properties into ADK state.

    CopilotKit's `properties` prop sends data as `forwarded_props` in every
    AG-UI request — including the very first turn — so the session ID is
    available from the start of the conversation.
    """
    forwarded = input_data.forwarded_props or {}
    session_id = forwarded.get("snowplowDomainSessionId", "")
    if session_id:
        return {"snowplowDomainSessionId": session_id}
    return {}

app = FastAPI(title="Signals ADK Agent")
add_adk_fastapi_endpoint(
    app, adk_agent, path="/", extract_state_from_request=extract_snowplow_session
)

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn

    if not os.getenv("GOOGLE_API_KEY"):
        print("⚠️  GOOGLE_API_KEY is not set — Gemini calls will fail.")

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

The `inject_signals_context` function is the `before_model_callback`. It runs every turn, just before ADK calls the LLM. It reads the session ID from state, fetches both kinds of fresh Signals context, and appends them to the system instruction. Because it runs on every turn, the context reflects the user's most recent behavior, including pages they've visited during the conversation.

The resulting system instruction for a turn where Signals has both kinds of context looks like:

```text
You are a helpful assistant for Signal Shop.
Help users understand features, answer questions, and guide them through their journey.

When real-time user context is available below, use it to personalize your responses.
The user profile section describes the session in aggregate. The recent session
activity section lists what the user has just been doing, oldest event first.
Reference what the user has been looking at to give more relevant answers.

## User profile (Snowplow Signals attributes)
Computed attributes describing the current user's session so far:
- first_event_timestamp: 2026-07-30T14:02:53.477Z
- last_event_timestamp: 2026-07-30T14:03:12.840Z
- page_views_count: 6
- unique_pages_viewed: ['http://localhost:3000/', 'http://localhost:3000/products/electronics', 'http://localhost:3000/products/clothing/linen-overshirt', 'http://localhost:3000/products/electronics/wireless-headphones', 'http://localhost:3000/pricing']

## Recent session activity (Snowplow Signals agentic context)
You are a helpful assistant for Signal Shop. Use this recent activity to understand what the user is exploring right now, and tailor your answers to it.
[START CONTEXT]
89 seconds on the current page. Session started 109 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /, {page_title: 'Signal Shop'}
3, page_view, /products/electronics, {page_title: 'Electronics | Signal Shop'}
7, page_view, /products/electronics/wireless-headphones, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
11, page_view, /products/clothing/linen-overshirt, {page_title: 'Linen Overshirt | Signal Shop'}
16, page_view, /products/electronics/wireless-headphones, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
19, page_view, /pricing, {page_title: 'Pricing | Signal Shop'}
[END CONTEXT]
```

The agentic context's own `prompt` instructions arrive at the top of the narrative, ahead of `[START CONTEXT]`, so you can steer the agent from your Signals configuration as well as from `BASE_INSTRUCTION`.

## Forward the session ID from front-end to agent

Extend the placeholder `CopilotProvider` you created in the tracking setup stage to read the session ID via the `getDomainSessionId()` helper from `snowplow.ts`, and pass it to `<CopilotKit>` via the `properties` prop:

```tsx
// src/components/copilot-provider.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { getDomainSessionId } from "@/lib/snowplow";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const id = getDomainSessionId();
    if (id) {
      setSessionId(id);
      return;
    }
    // Tracker initializes in SnowplowProvider's effect, which runs in parallel
    // with this one. Poll briefly until the tracker is ready.
    const interval = setInterval(() => {
      const id = getDomainSessionId();
      if (id) {
        setSessionId(id);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const properties = useMemo(
    () => ({ snowplowDomainSessionId: sessionId }),
    [sessionId],
  );

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="my_agent"
      properties={properties}
    >
      {children}
    </CopilotKit>
  );
}
```

`SnowplowProvider` wraps `CopilotProvider` in `layout.tsx` and initializes the tracker first. Because both effects run after mount, the provider polls briefly to handle the case where the tracker isn't ready yet.

## Check the CopilotKit proxy endpoint

The scaffold includes a server-side endpoint that bridges CopilotKit to your Python agent at `src/app/api/copilotkit/route.ts`. Verify it matches:

```tsx
// src/app/api/copilotkit/route.ts
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

const serviceAdapter = new ExperimentalEmptyAdapter();

const runtime = new CopilotRuntime({
  agents: {
    my_agent: new HttpAgent({
      url: process.env.AGENT_URL || "http://localhost:8000/",
    }),
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

This is a thin proxy. `CopilotRuntime` handles the AG-UI envelope including state sync, tool calls, and readables. `HttpAgent` relays every request to your FastAPI service at `http://localhost:8000/`, where `ADKAgent` decodes AG-UI messages back into ADK sessions. In the scaffold this lives in a Next.js API route.

## Try it out and verify Signals context

Run the stack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and browse a handful of pages, revisiting one product page after looking at another. Then open the CopilotKit sidebar and ask a general question, such as "Can you help me understand your pricing?".

A grounded response names what you just did: for the six-page session above, it picks out the return to the wireless headphones and the pricing page, rather than listing the plans generically.

The `[agent]` lines in your `npm run dev` output confirm both fetches landed:

```text
[agent] injecting 2 signals section(s)
```

Two sections means the profile attributes and the activity narrative both arrived.

On the Signals side, check in Console that your attribute group, service, and agentic context are published under the names you set in `.env`, or ask the [Snowplow Assistant](/docs/llms-support/console-agent/) to confirm them for you.

To confirm the tracker and Signals agree on your session, use the [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/signals-integration/). Connect it to Console, add your API credentials in the extension options, then browse the app with the extension open and compare its **Attributes** tab with its **Events** tab.
