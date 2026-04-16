---
title: "Client-side tracking"
sidebar_label: "Client-side tracking"
position: 3
description: "Add browser-side Snowplow tracking for user interactions - message sent, message received - with schema validation via Snowplow Micro."
keywords: ["snowplow", "agentic", "tracking", "ai", "client-side", "browser tracker"]
date: "2026-03-26"
---

You'll add browser-side Snowplow tracking for user interactions so that every message sent and every response received is captured as a validated, schema-backed event.

:::tip Code-along / Read-along
If you're coding along, continue from the starter app and create the files described below. If you're reading along, check out the tag and review the changes:

```bash
git checkout v0.1-client-tracking
npm install
```

To see exactly what changed: `git diff v0.0-starter..v0.1-client-tracking`
:::

## Key concepts

Before writing code, it's worth understanding Snowplow's event model. If you're already familiar with Snowplow, skip to [What you'll add](#what-youll-add).

:::note[Self-describing events and entities]
Snowplow uses a self-describing event model:

- Events are lightweight actions - "a message was sent", "a response was received". Each event references a schema that defines its structure.
- Entities are data objects attached to events. They describe the "who, what, where" - a `message_context` entity might include the message role, length, and a preview of the content.
- Schemas define and validate both events and entities. They live in an [Iglu](/docs/api-reference/iglu/) registry and follow a versioning format (e.g., `1-0-0`).
- Snowplow Micro runs locally in Docker and validates every incoming event against its schema in real-time. Events that pass validation land in `/micro/good`; those that fail land in `/micro/bad`, and viewable in the browser at `/micro/ui`.

This separation - thin events with rich attached entities - keeps events composable. The same `message_context` entity can be attached to both `message_sent` and `message_received` events without duplicating the schema.
:::

## What you'll add

This stage introduces:

- One new dependency: `@snowplow/browser-tracker`
- Two event schemas from Iglu Central: `message_sent` and `message_received`
- One entity schema from Iglu Central: `message_context`
- One new file: `src/lib/tracking/client.ts` - the client tracking module
- One new file: `start.sh` - dev startup script that runs Snowplow Micro alongside Next.js
- Modifications to: `src/app/page.tsx` (wiring tracking into the UI)

## Review the schemas

Every Snowplow event and entity needs a schema. The three schemas used in this stage - `message_sent`, `message_received`, and `message_context` - are published on [Iglu Central](https://github.com/snowplow/iglu-central) under vendor `com.snowplow.agent.tracking`. Your application references them by schema URI, and Snowplow resolves them automatically - you do not need to create or host these schemas yourself.

Here's what each schema defines:

### message_sent event

The `message_sent` event is deliberately minimal - it captures the session and timestamp. All the interesting message metadata lives in the attached `message_context` entity.

```yaml title="message_sent schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'User sends a message in the chat interface.'
  self:
    vendor: com.snowplow.agent.tracking
    name: message_sent
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    session_id:
      type: string
      description: 'Chat session identifier'
      maxLength: 36
    sent_at:
      type: string
      format: date-time
      description: 'Timestamp when message was sent'
  required:
    - session_id
    - sent_at
  additionalProperties: false
```

### message_received event

The `message_received` event is richer - it captures performance and usage metrics about the agent's response that are only available once the response completes.

```yaml title="message_received schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent response received and rendered in the chat interface.'
  self:
    vendor: com.snowplow.agent.tracking
    name: message_received
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    session_id:
      type: string
      description: 'Chat session identifier'
      maxLength: 36
    invocation_id:
      type: string
      description: 'Agent invocation that produced this response'
      maxLength: 36
    tokens_used:
      type:
        - integer
        - 'null'
      description: 'Total tokens consumed'
      minimum: 0
    response_time_ms:
      type: integer
      description: 'Time from message sent to response complete'
      minimum: 0
    tool_calls_count:
      type: integer
      description: 'Number of tool calls made'
      minimum: 0
    received_at:
      type: string
      format: date-time
      description: 'Timestamp when response was received'
  required:
    - session_id
    - invocation_id
    - response_time_ms
    - tool_calls_count
    - received_at
  additionalProperties: false
```

### message_context entity

The `message_context` entity is attached to both events. It describes the message itself - who sent it, how long it is, its position in the conversation.

```yaml title="message_context schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: entity
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Context entity describing a chat message.'
  self:
    vendor: com.snowplow.agent.tracking
    name: message_context
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    message_id:
      type: string
      description: 'Unique identifier for this message'
      maxLength: 36
    message_role:
      type: string
      enum:
        - user
        - assistant
      description: 'Who sent the message'
    message_length:
      type: integer
      description: 'Length of message in characters'
      minimum: 0
      maximum: 100000
    message_preview:
      type:
        - string
        - 'null'
      description: 'Truncated message content (first 100 chars)'
      maxLength: 100
    message_index:
      type: integer
      description: 'Position of this message in the conversation'
      minimum: 0
      maximum: 10000
    conversation_turn:
      type:
        - integer
        - 'null'
      description: 'Turn number (pair of user + assistant messages)'
      minimum: 0
      maximum: 5000
  required:
    - message_id
    - message_role
    - message_length
    - message_index
  additionalProperties: false
```

:::note[Why separate events from entities?]
`message_sent` doesn't contain the message text or length - that's in the `message_context` entity. This is a deliberate Snowplow pattern: events capture *what happened* and *when*, while entities capture *the context around it*. The same entity can be reused across multiple events without duplicating the schema definition.
:::

:::note[Privacy pattern]
The `message_preview` field is capped at 100 characters. Full message content is never sent to the Collector. This is a good practice for any user-generated content - capture enough for debugging and analysis, but respect user privacy.
:::

## Create the client tracking module

This module initializes the Snowplow browser tracker and provides two functions for tracking messages.

```typescript title="src/lib/tracking/client.ts"
'use client';

import {
  newTracker,
  trackPageView,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker';

// ---------------------------------------------------------------------------
// Tracker initialisation
// ---------------------------------------------------------------------------

let trackerInitialized = false;

/**
 * Initialise the Snowplow browser tracker.
 * Call once on app mount (e.g. in a useEffect).
 */
export const initClientTracker = () => {
  if (trackerInitialized) return;

  const collectorUrl = process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL;
  const appId = process.env.NEXT_PUBLIC_SNOWPLOW_APP_ID;

  if (!collectorUrl || !appId) {
    console.warn(
      'Snowplow browser tracker not initialized: missing NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL or NEXT_PUBLIC_SNOWPLOW_APP_ID',
    );
    return;
  }

  newTracker('sp', collectorUrl, {
    appId,
    contexts: {
      webPage: true,
      session: true,
    },
    anonymousTracking: false,
    stateStorageStrategy: 'localStorage',
  });

  trackerInitialized = true;
  trackPageView();
};
```

The tracker is initialized as a singleton - `initClientTracker()` is safe to call multiple times; it only runs once. It reads the collector URL and app ID from environment variables, enables built-in web page and session contexts, and fires an initial page view.

Next, add the two tracking functions:

```typescript title="src/lib/tracking/client.ts (continued)"
// ---------------------------------------------------------------------------
// Context entity builder
// ---------------------------------------------------------------------------

export interface MessageContextData {
  message_id: string;
  message_role: 'user' | 'assistant';
  message_length: number;
  message_preview: string | null;
  message_index: number;
  conversation_turn: number | null;
}

const buildMessageContext = (data: MessageContextData) => ({
  schema: 'iglu:com.snowplow.agent.tracking/message_context/jsonschema/1-0-0' as const,
  data: data as unknown as Record<string, unknown>,
});

// ---------------------------------------------------------------------------
// Event: message sent
// ---------------------------------------------------------------------------

export interface MessageSentParams {
  sessionId: string;
  messageId: string;
  message: string;
  messageIndex: number;
  conversationTurn?: number;
}

export const trackMessageSent = (params: MessageSentParams) => {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snowplow.agent.tracking/message_sent/jsonschema/1-0-0',
      data: {
        session_id: params.sessionId,
        sent_at: new Date().toISOString(),
      },
    },
    context: [
      buildMessageContext({
        message_id: params.messageId,
        message_role: 'user',
        message_length: params.message.length,
        message_preview: params.message.substring(0, 100),
        message_index: params.messageIndex,
        conversation_turn: params.conversationTurn ?? null,
      }),
    ],
  });
};

// ---------------------------------------------------------------------------
// Event: message received
// ---------------------------------------------------------------------------

export interface MessageReceivedParams {
  sessionId: string;
  invocationId: string;
  messageId: string;
  responseText: string;
  tokensUsed?: number | null;
  toolCallsCount: number;
  responseTimeMs: number;
  messageIndex: number;
  conversationTurn?: number;
  modelName: string;
  modelProvider: 'anthropic' | 'openai' | 'google';
}

export const trackMessageReceived = (params: MessageReceivedParams) => {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snowplow.agent.tracking/message_received/jsonschema/1-0-0',
      data: {
        session_id: params.sessionId,
        invocation_id: params.invocationId,
        tokens_used: params.tokensUsed ?? null,
        response_time_ms: params.responseTimeMs,
        tool_calls_count: params.toolCallsCount,
        received_at: new Date().toISOString(),
      },
    },
    context: [
      buildMessageContext({
        message_id: params.messageId,
        message_role: 'assistant',
        message_length: params.responseText.length,
        message_preview: params.responseText.substring(0, 100),
        message_index: params.messageIndex,
        conversation_turn: params.conversationTurn ?? null,
      }),
    ],
  });
};
```

Both functions:

1. Build the event payload (the thin event with timestamps and IDs)
2. Build the entity (the metadata about the message)
3. Fire the self-describing event with `trackSelfDescribingEvent()`

The `message_preview` is truncated to 100 characters in both functions - this matches the schema's `maxLength` constraint and protects user privacy.

## Wire tracking into the UI

The tracking module needs to be connected to four points in `src/app/page.tsx`:

### 1. Initialize the tracker on mount

Import the tracking functions and initialize the tracker in a `useEffect`:

```typescript title="src/app/page.tsx"
import {
  initClientTracker,
  trackMessageSent,
  trackMessageReceived,
} from '@/lib/tracking/client';

// Inside the Home component:
useEffect(() => {
  initClientTracker();
}, []);
```

### 2. Track message sent on submit

In the `onSubmit` handler, call `trackMessageSent()` before sending the message to the API:

```typescript title="src/app/page.tsx"
const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) return;

  startTimeRef.current = Date.now();
  const activeSessionId = ensureActiveSessionId();

  trackMessageSent({
    sessionId: activeSessionId,
    messageId: crypto.randomUUID(),
    message: input,
    messageIndex: messageIndex,
  });

  sendMessage(
    { role: 'user', parts: [{ type: 'text', text: input }] },
    { body: { sessionId: activeSessionId, modelId: selectedModelId } },
  );
  setInput('');
};
```

### 3. Track message sent from demo scenarios

The scenario handler follows the same pattern:

```typescript title="src/app/page.tsx"
const handleScenarioSelect = (message: string) => {
  startTimeRef.current = Date.now();
  const activeSessionId = ensureActiveSessionId();

  trackMessageSent({
    sessionId: activeSessionId,
    messageId: crypto.randomUUID(),
    message: message,
    messageIndex: messageIndex,
  });

  sendMessage(
    { role: 'user', parts: [{ type: 'text', text: message }] },
    { body: { sessionId: activeSessionId, modelId: selectedModelId } },
  );
};
```

### 4. Track message received on completion

In the `useChat` hook's `onFinish` callback, call `trackMessageReceived()` with the response metadata:

```typescript title="src/app/page.tsx"
const { messages, sendMessage, status } = useChat<UIMessage>({
  transport: chatTransport,
  onFinish: ({ message }) => {
    const responseTime = Date.now() - startTimeRef.current;
    const textContent = extractTextContent(message.parts);
    const toolCallsCount = extractToolCalls(message.parts).length;
    const activeSessionId = ensureActiveSessionId();

    trackMessageReceived({
      sessionId: activeSessionId,
      invocationId: message.id,
      messageId: message.id,
      responseText: textContent,
      tokensUsed: null,
      toolCallsCount: toolCallsCount,
      responseTimeMs: responseTime,
      messageIndex: messageIndex + 1,
      modelName: selectedModelId,
      modelProvider: selectedModelProvider,
    });

    setMessageIndex((prev) => prev + 2);
  },
});
```

The `onFinish` callback fires once the full response has been streamed. By this point, you have access to the complete text, the tool calls made, and the elapsed time since the user sent their message.

### 5. Enable the LiveTrackingPanel

The `LiveTrackingPanel` component was already in the codebase but disabled. Render it in the JSX:

```tsx title="src/app/page.tsx"
<LiveTrackingPanel sessionId={sessionId} />
```

This component polls Snowplow Micro's API every two seconds and displays events in a real-time sidebar. It requires Micro to be running.

## Set up Snowplow Micro

To validate events locally, you need [Snowplow Micro](/docs/testing/snowplow-micro/) running in Docker. The `start.sh` script handles this:

```bash title="start.sh"
#!/bin/bash
# Start Snowplow Micro and Next.js server

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

# Generic schemas (com.snowplow.agent.tracking) resolve from Iglu Central automatically.
# The local mount provides app-specific custom entities added in later stages.
docker run -d --name snowplow-micro \
  -p 9090:9090 \
  -v "$(pwd)/snowplow/iglu-local:/config/iglu-client-embedded" \
  snowplow/snowplow-micro:3.0.1

sleep 2

# Start Next.js dev server
npm run dev
```

Snowplow Micro validates every incoming event against its schema. The three schemas you're using in this stage - `message_sent`, `message_received`, and `message_context` - are published on [Iglu Central](https://github.com/snowplow/iglu-central), Snowplow's public schema registry. Micro resolves them automatically over the network, so you don't need local copies.

The `-v` mount maps the local `snowplow/iglu-local` directory into the container. This directory is where you'll add your own custom entity schemas in later stages - for example, domain-specific entities that describe travel intent or tool parameters. For the time being, it can remain empty; everything you need comes from Iglu Central.

Run the combined startup with:

```bash
npm run start:dev
```

This starts Snowplow Micro on port 9090 and Next.js on port 3000.

## Try it out

If the chatbot sends messages but never responds, check that `.env.local` has a real API key (not a placeholder) for the model you selected.

With both services running:

1. Open [http://localhost:3000](http://localhost:3000) and send a message: "Find flights from London to Paris tomorrow"
2. Open the **LiveTrackingPanel** (the sidebar on the right) - you'll see events appearing in real-time
3. Open **Snowplow Micro UI** at [http://localhost:9090/micro/ui](http://localhost:9090/micro/ui) - press **Refresh** to see events arriving. You can click on individual events to explore their properties and attached entities. The UI also shows any events that failed schema validation. ([Micro UI docs](/docs/testing/snowplow-micro/local/#checking-the-results))
4. Examine a `message_sent` event in the Micro UI - notice the self-describing event structure and the attached `message_context` entity showing role: "user", the message length, and the truncated preview
5. Examine a `message_received` event - notice the `response_time_ms` showing how long the agent took, and `tool_calls_count` showing how many tools it used

:::note[Programmatic access]
Micro also exposes raw JSON endpoints at `/micro/good` and `/micro/bad` if you prefer programmatic access, but the UI is the recommended way to explore events throughout this accelerator.
:::

:::note[Stage summary]
- Files: three added, three modified
- Events: `message_sent`, `message_received`
- Entities: `message_context`
:::

Client-side tracking gives you visibility into the user's experience, but the agent's internal behavior is still invisible. When the agent receives a message, it enters a multi-step reasoning loop - calling the LLM, deciding which tools to use, executing them, and generating a response. None of that is captured yet. In the next section, you'll add server-side tracking to see inside the agent's orchestration.
