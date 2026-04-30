---
title: "Connect Signals to the Google ADK agent"
sidebar_label: "Connect Signals and agent"
position: 5
description: "Fetch Signals attributes from Python, build a Google ADK agent that injects them into its system instruction each turn, and forward the Snowplow session ID from the React frontend through CopilotKit."
keywords: ["Google ADK", "CopilotKit", "AG-UI", "Signals", "LlmAgent", "before_model_callback"]
date: "2026-04-17"
---

The next step is to connect Signals to the Google ADK agent, and forward the Snowplow session ID through CopilotKit so the agent knows which user to fetch context for.

## Fetch Signals context from Python

Create a module inside the `agent/` directory that wraps the [Snowplow Signals Python SDK](/docs/signals/attributes/using-python-sdk/):

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

def _format_attributes(attributes: dict) -> str:
    """Render a Signals attribute dict as a markdown block for the system prompt."""
    lines = [f"- {key}: {value}" for key, value in attributes.items()]
    return "\n".join(
        [
            "## Real-Time User Context (Snowplow Signals)",
            "The following attributes describe the current user's session behavior "
            "on this application:",
            *lines,
        ]
    )

def get_signals_context(domain_session_id: str) -> str:
    """Fetch attributes for the given session and return a markdown context block.

    Returns an empty string when Signals is not configured, the session ID is
    empty, or the fetch fails — the agent then degrades gracefully to its base
    instruction.
    """
    client = _get_signals_client()
    if client is None or not domain_session_id:
        return ""

    service_name = os.getenv("SNOWPLOW_SIGNALS_SERVICE_NAME")
    if not service_name:
        return ""

    try:
        # get_service_attributes() returns a plain dict[str, Any]
        attributes = client.get_service_attributes(
            name=service_name,
            attribute_key="domain_sessionid",
            identifier=domain_session_id,
        )
        if not attributes:
            return ""
        return _format_attributes(attributes)
    except Exception as exc:  # noqa: BLE001
        print(f"[signals-context] failed to fetch attributes: {exc}")
        return ""
```

## Build the agent

Replace the scaffold's `agent/main.py` with one that reads the Snowplow session ID from state and calls `get_signals_context` on every turn.

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

from signals_context import get_signals_context

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="[agent] %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger("signals_agent")

BASE_INSTRUCTION = """You are a helpful assistant for Signal Shop.
Help users understand features, answer questions, and guide them through their journey.

When you have real-time user context available (provided below), use it to personalize
your responses. Reference what the user has been looking at to give more relevant answers."""

def inject_signals_context(
    callback_context: CallbackContext,
    llm_request: LlmRequest,
) -> Optional[LlmResponse]:
    """Fetch Signals attributes each turn and append them to the system instruction."""
    state_dict = callback_context.state.to_dict()
    domain_session_id = state_dict.get("snowplowDomainSessionId", "")
    log.info(
        "before_model_callback: state_keys=%s snowplow_session_id=%r",
        list(state_dict.keys()),
        domain_session_id,
    )

    if not domain_session_id:
        return None

    signals_block = get_signals_context(domain_session_id)
    if not signals_block:
        return None

    log.info("injecting signals block (%d chars)", len(signals_block))
    llm_request.append_instructions([signals_block])
    return None

root_agent = LlmAgent(
    name="SignalsAgent",
    model="gemini-3-flash-preview",
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

The `inject_signals_context` method is the `before_model_callback`. It runs every turn, just before the LLM is called. It reads the session ID from state, fetches fresh Signals attributes, and appends them to the system instruction. Because it runs on every turn, the context reflects the user's latest behavior, including pages they've visited during the conversation.

Within `inject_signals_context`, `append_instructions` is an ADK `LlmRequest` method that adds content to the system instruction for this turn only. It doesn't mutate the agent's `instruction` field permanently; every turn starts fresh and gets the latest Signals data appended.

The `extract_snowplow_session` method is an `ag_ui_adk` hook that runs before the ADK session is created. It reads from `input_data.forwarded_props`, which is populated by CopilotKit's `properties` prop. It returns a dictionary that gets merged into the ADK session state. Because `forwarded_props` is sent on every AG-UI request, the session ID is available for each chat message.

The resulting system prompt for a turn where Signals has data looks like:

```
You are a helpful assistant for Signal Shop.
Help users understand features, answer questions, and guide them through their journey.

When you have real-time user context available (provided below), use it to personalize
your responses. Reference what the user has been looking at to give more relevant answers.

## Real-Time User Context (Snowplow Signals)
The following attributes describe the current user's session behavior on this application:
- page_views_count: 12
- unique_pages_viewed: ["http://localhost:3000/products/electronics",
    "http://localhost:3000/products/electronics/wireless-headphones"]
- first_event_timestamp: 2026-04-09T14:23:01.000Z
- last_event_timestamp: 2026-04-09T14:41:03.000Z
```

Gemini treats the Signals block as factual context about the current user. No special prompting is needed beyond including it: the model naturally incorporates the context when formulating responses.

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

## Try it out

Your application is now ready to try out.

Run the stack:

```bash
npm run dev
```

Make sure you've replaced the placeholder values in `.env` with real credentials.

Open [http://localhost:3000](http://localhost:3000) and browse around for a few minutes. Visit different pages, click some links. The Browser tracker will record these interactions, and Signals will compute your attributes in real time.

Open the CopilotKit sidebar and ask a general question. If your Signals service is returning attributes for your session, the agent's response will reference what you've been doing.

## Verify Signals context

You can verify that the app is receiving the Signals context by checking the agent logs. When you run `npm run dev`, watch the `[agent]` prefix. You should see the session ID present from the first turn:

```
[agent] before_model_callback: state_keys=['snowplowDomainSessionId', '_ag_ui_thread_id', '_ag_ui_app_name', '_ag_ui_user_id'] snowplow_session_id='472f97c1-eec1-45fe-b081-3ff695c30415'
[agent] injecting signals block (287 chars)
```

If the session ID is missing, the Snowplow tracker never initialized. Check:
* The browser's Network tab for requests to your Collector
* That your Collector URL environment variable is set and exposed to the browser (`NEXT_PUBLIC_` prefix in the scaffold)
* That `SnowplowProvider` wraps `CopilotProvider` in `layout.tsx`

If the Signals block is empty but the session ID is present, check:
* Is your attribute group published?
* Did you create a service with the right name?
* Have you been browsing for long enough for events to flow through the pipeline?
