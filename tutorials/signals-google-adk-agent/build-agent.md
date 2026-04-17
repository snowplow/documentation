---
title: "Build the agent integration"
sidebar_label: "Build the agent"
position: 5
description: "Fetch Signals attributes from Python, build a Google ADK agent that injects them into its system instruction each turn, and forward the Snowplow session ID from the React frontend through CopilotKit."
keywords: ["Google ADK", "CopilotKit", "AG-UI", "Signals", "LlmAgent", "before_model_callback"]
date: "2026-04-17"
---

This is the core of the tutorial — connecting Signals to your Google ADK agent, and wiring the Snowplow session ID through CopilotKit so the agent knows *which* user to fetch context for.

## Fetch Signals context from Python

Create a module inside the `agent/` directory that wraps the Snowplow Signals Python SDK:

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

With context fetching isolated in its own module, the agent code can stay focused on request handling and delegate Signals lookups to a single function call.

## Build the ADK agent

Now replace the scaffold's `agent/main.py` — which is wired up for the proverbs demo — with one that reads the Snowplow session ID from state and calls `get_signals_context` on every turn.

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

# ADKAgent wraps the LlmAgent and makes it speak AG-UI.
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

There are three key pieces to understand here:

- **`extract_snowplow_session`** — an `ag_ui_adk` hook that runs before the ADK session is created. It reads from `input_data.forwarded_props` (populated by CopilotKit's `properties` prop) and returns a dict that gets merged into the ADK session state. Because `forwarded_props` is sent on every AG-UI request, the session ID is available for each chat message.
- **`inject_signals_context`** (the `before_model_callback`) — runs every turn, just before the LLM is called. It reads the session ID from state, fetches fresh Signals attributes, and appends them to the system instruction. Because it runs on every turn, the context reflects the user's latest behavior — including pages they've visited during the conversation.
- **`append_instructions`** — an ADK `LlmRequest` method that adds content to the system instruction for this turn only. It doesn't mutate the agent's `instruction` field permanently — every turn starts fresh and gets the latest Signals data appended.

The resulting system prompt for a turn where Signals has data looks like:

```
You are a helpful assistant for Signal Shop.
Help users understand features, answer questions, and guide them through their journey.

When you have real-time user context available (provided below), use it to personalize
your responses. Reference what the user has been looking at to give more relevant answers.

## Real-Time User Context (Snowplow Signals)
The following attributes describe the current user's session behavior on this application:
- page_views_count: 12
- unique_pages_viewed: {'/': 1, '/products/electronics': 2, '/products/electronics/wireless-headphones': 4, '/products/electronics/smart-speaker-mini': 2, '/pricing': 3}
- first_event_timestamp: 2026-04-09T14:23:01.000Z
- last_event_timestamp: 2026-04-09T14:41:03.000Z
```

Gemini treats this as factual context about the current user. No special prompting tricks needed — the model naturally incorporates the context when formulating responses.

## Wire the session ID from frontend to agent

The backend's `extract_snowplow_session` expects the Snowplow session ID to arrive in `forwarded_props.snowplowDomainSessionId`. CopilotKit's `properties` prop is the mechanism that delivers it — anything passed to `properties` is sent as `forwarded_props` in every AG-UI request, including the first.

Now extend the placeholder `CopilotProvider` you created in the tracking setup step to read the session ID via the `getDomainSessionId()` helper from `snowplow.ts` and pass it to `<CopilotKit>` via the `properties` prop:

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

`getDomainSessionId()` is the single source of truth for session ID lookup — it wraps `tracker.getDomainUserInfo()` so you don't duplicate cookie parsing here. `SnowplowProvider` (which wraps `CopilotProvider` in `layout.tsx`) initializes the tracker in its own `useEffect`; because both effects run after mount, you poll briefly on the first render to handle the case where the tracker isn't ready yet. By the time a user types their first chat message, the session ID is reliably available.

## Verify the CopilotKit proxy endpoint

The scaffold already created a server-side endpoint that bridges CopilotKit to your Python agent (`src/app/api/copilotkit/route.ts`). It should look like this — nothing to change:

```tsx
// src/app/api/copilotkit/route.ts (scaffolded — verify it matches)
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

This is a thin proxy. `CopilotRuntime` handles the AG-UI envelope (state sync, tool calls, readables) and `HttpAgent` relays every request to your FastAPI service at `http://localhost:8000/`, where `ADKAgent` decodes AG-UI messages back into ADK sessions. In the scaffold this lives in a Next.js API route; in a plain SPA you'd host it in a small Express server.

## Replace the scaffold's page

The scaffold's `src/app/page.tsx` imports the demo components you deleted in the project setup step, so it needs to be replaced. The chat sidebar is already mounted by `ChatShell` in `layout.tsx`, so the page itself only needs homepage content:

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Signal Shop</h1>
        <p className="text-lg text-gray-600">
          Browse around and chat with the assistant to see Signals in action.
        </p>
      </div>
    </main>
  );
}
```

:::tip[Need a richer demo?]
A single page won't generate interesting Signals attributes (unique pages will always be 1). See the "Need a demo app?" section in the project setup step for a prompt to generate a multi-page store.
:::
