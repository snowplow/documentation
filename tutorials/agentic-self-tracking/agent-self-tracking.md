---
title: "Agentic self-tracking"
sidebar_label: "Agent self-tracking"
position: 5
description: "Give the AI agent tools to track its own reasoning - intent detection, decision logging, and constraint violation reporting - completing the three-layer observability stack."
keywords: ["snowplow", "agentic", "tracking", "ai", "self-tracking", "intent", "decision", "constraint"]
date: "2026-03-26"
---

In this stage, you'll give the agent tools to track its own reasoning. By the end, the agent will log what it understood, why it made each decision, and when it can't meet a user's requirements.

:::tip Code-along / Read-along
If you're coding along, continue from the previous stage and create the files described below. If you're reading along:
```bash
git checkout v0.3-agentic-tracking
npm install
```
To see exactly what changed: `git diff v0.2-server-tracking..v0.3-agentic-tracking`
:::

## The paradigm shift

This stage is fundamentally different from the first two:

- **v0.1** tracked what the **user** did - events emitted by browser code you wrote
- **v0.2** tracked what the **system** did - events emitted by server framework callbacks
- **v0.3** tracks what the **agent thinks** - events emitted by the LLM itself, via tool calls

The agent becomes an observer of its own reasoning. You give it three new tools that don't perform business actions - they log the agent's internal state:

| Tool | Purpose | When called |
|------|---------|-------------|
| `track_user_intent` | "I understood the user wants X with confidence Y" | First, on every new user message |
| `track_agent_decision` | "I'm choosing to do Y because Z" | Before executing any business tool |
| `track_constraint_violation` | "The user wants A, but it's not possible because B" | When a requirement can't be met |

These are tools like any other - the LLM calls them when instructed by the system prompt. The difference is they don't search flights or book tickets; they log the agent's reasoning into Snowplow events.

## What you'll add

This stage introduces:

- 3 event schemas: `user_intent_detected`, `agent_decision_logged`, `constraint_violation`
- 1 new file: `src/lib/tools/self-tracking-tools.ts` - three tool factories
- Modifications to: `src/lib/tracking/server.ts` (three new tracking functions) and `src/app/api/chat/route.ts` (register tools + system prompt protocol)

No new entities are needed - the self-tracking events reuse the `agent_context` and `tool_context` entities from v0.2.

## Define the schemas

### user_intent_detected

Captures the agent's interpretation of what the user wants, including confidence and extracted entities.

```yaml title="snowplow/data-structures/events/agent/user_intent_detected.yml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs the detected user intent.'
  self:
    vendor: com.snowplow.demo
    name: user_intent_detected
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      maxLength: 36
    intent_id:
      type: string
      description: 'Unique identifier for this detected intent'
      maxLength: 36
    intent_category:
      type: string
      enum:
        - search_flights
        - book_flight
        - modify_booking
        - cancel_booking
        - get_recommendations
        - ask_question
      description: 'Category of user intent'
    confidence:
      type: number
      minimum: 0
      maximum: 1
      description: 'Confidence level (0-1)'
    extracted_entities:
      type: object
      description: 'Extracted entities from user message'
    reasoning:
      type:
        - string
        - 'null'
      description: 'Reasoning for this interpretation'
      maxLength: 2000
    detected_at:
      type: string
      format: date-time
      description: 'Timestamp when intent was detected'
  required:
    - invocation_id
    - intent_id
    - intent_category
    - confidence
    - extracted_entities
    - detected_at
  additionalProperties: false
```

The `confidence` field (0-1) and `extracted_entities` (free-form object) are particularly valuable for analysis. You can track how often the agent is confident in its interpretation and what entities it extracts from natural language.

### agent_decision_logged

Captures the reasoning behind a decision the agent is about to make, including what options it considered.

```yaml title="snowplow/data-structures/events/agent/agent_decision_logged.yml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs a decision the agent is about to make.'
  self:
    vendor: com.snowplow.demo
    name: agent_decision_logged
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      maxLength: 36
    decision_id:
      type: string
      description: 'Unique identifier for this decision'
      maxLength: 36
    decision_type:
      type: string
      enum:
        - tool_selection
        - parameter_reasoning
        - result_interpretation
        - clarification_needed
        - constraint_handling
      description: 'Type of decision'
    reasoning:
      type: string
      description: 'Natural language explanation of the decision'
      maxLength: 2000
    context:
      type:
        - object
        - 'null'
      description: 'Additional context (considered options, criteria, trade-offs)'
    logged_at:
      type: string
      format: date-time
      description: 'Timestamp when decision was logged'
  required:
    - invocation_id
    - decision_id
    - decision_type
    - reasoning
    - logged_at
  additionalProperties: false
```

### constraint_violation

Captures when the agent detects that a user's requirement can't be met, including what was requested, why it failed, and what alternatives exist.

```yaml title="snowplow/data-structures/events/agent/constraint_violation.yml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs when a user requirement cannot be met.'
  self:
    vendor: com.snowplow.demo
    name: constraint_violation
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      maxLength: 36
    violation_id:
      type: string
      description: 'Unique identifier for this violation'
      maxLength: 36
    constraint_type:
      type: string
      enum:
        - budget
        - dates
        - availability
        - route
        - preferences
        - other
      description: 'Type of constraint that was violated'
    user_requirement:
      type: string
      description: 'What the user requested'
      maxLength: 1000
    reason_not_met:
      type: string
      description: 'Why it cannot be fulfilled'
      maxLength: 2000
    alternatives_considered:
      type:
        - array
        - 'null'
      items:
        type: string
      description: 'Alternative options considered'
    recommendation:
      type:
        - string
        - 'null'
      description: 'Recommended alternative'
      maxLength: 2000
    violated_at:
      type: string
      format: date-time
      description: 'Timestamp when violation was detected'
  required:
    - invocation_id
    - violation_id
    - constraint_type
    - user_requirement
    - reason_not_met
    - violated_at
  additionalProperties: false
```

## Add server tracking functions

Add three new tracking functions to `src/lib/tracking/server.ts`. They follow the same pattern as the v0.2 functions, attaching both `agent_context` and `tool_context` entities (with `tool_category: 'self_tracking'`).

Here's `trackUserIntentDetected` as the pattern:

```typescript title="src/lib/tracking/server.ts"
export const trackUserIntentDetected = (params: UserIntentDetectedParams) => {
  const t = initServerTracker();
  if (!t) return;

  t.track(
    buildSelfDescribingEvent({
      event: {
        schema: 'iglu:com.snowplow.demo/user_intent_detected/jsonschema/1-0-0',
        data: {
          invocation_id: params.invocationId,
          intent_id: params.intentId,
          intent_category: params.intentCategory,
          confidence: params.confidence,
          extracted_entities: params.extractedEntities,
          reasoning: params.reasoning ?? null,
          detected_at: new Date().toISOString(),
        },
      },
    }),
    [
      buildToolContext({
        tool_name: 'track_user_intent',
        tool_category: 'self_tracking',
        tool_call_id: params.toolCallId,
      }),
      buildAgentContext({
        invocation_id: params.invocationId,
        session_id: params.sessionId,
        agent_type: 'travel_assistant',
        model_name: params.modelName,
        model_provider: params.modelProvider,
      }),
    ],
  );
};
```

`trackAgentDecisionLogged` and `trackConstraintViolation` follow the same structure with their respective schemas and data fields.

## Create the self-tracking tools

The three self-tracking tools are defined in a new file. Each is a tool factory that takes a `RequestContext` (the same one from v0.2) and returns a Vercel AI SDK tool.

```typescript title="src/lib/tools/self-tracking-tools.ts"
import { z } from 'zod';
import { tool } from 'ai';
import {
  trackUserIntentDetected,
  trackAgentDecisionLogged,
  trackConstraintViolation,
} from '../tracking/server';
import type { RequestContext } from '@/app/api/chat/route';
```

### track_user_intent

```typescript title="src/lib/tools/self-tracking-tools.ts (continued)"
const trackUserIntentInputSchema = z.object({
  intent_category: z
    .enum([
      'search_flights',
      'book_flight',
      'modify_booking',
      'cancel_booking',
      'get_recommendations',
      'ask_question',
    ])
    .describe('Category of user intent'),
  confidence: z.number().min(0).max(1).describe('Confidence level (0-1)'),
  extracted_entities: z
    .object({
      origin: z.string().nullish(),
      destination: z.string().nullish(),
      date: z.string().nullish(),
      return_date: z.string().nullish(),
      passengers: z.number().nullish(),
      budget_min: z.number().nullish(),
      budget_max: z.number().nullish(),
      currency: z.string().nullish(),
      preferences: z.array(z.string()).nullish(),
    })
    .passthrough()
    .describe('Extracted entities from user message'),
  reasoning: z
    .string()
    .optional()
    .describe('Your reasoning for this interpretation'),
});

export function createTrackUserIntentTool(ctx: RequestContext) {
  return tool({
    description:
      'Log your interpretation of the user intent. Call this FIRST when you receive a user message.',
    inputSchema: trackUserIntentInputSchema,
    execute: async (params) => {
      const startTime = Date.now();
      const toolCallId = crypto.randomUUID();
      const intentId = crypto.randomUUID();
      ctx.totalToolsCalled++;
      ctx.selfTrackingToolsCalled++;

      trackUserIntentDetected({
        invocationId: ctx.invocationId,
        sessionId: ctx.sessionId,
        intentId,
        intentCategory: params.intent_category,
        confidence: params.confidence,
        extractedEntities: params.extracted_entities,
        reasoning: params.reasoning || null,
        toolCallId,
        executionDurationMs: Date.now() - startTime,
        modelName: ctx.modelName,
        modelProvider: ctx.modelProvider,
      });

      return { tracked: true, intent_id: intentId };
    },
  });
}
```

Key things to notice:

- The Zod schema provides structured input validation for the agent's self-report. The `intent_category` is an enum, `confidence` is bounded 0-1, and `extracted_entities` has typed fields for known travel entities with `.passthrough()` allowing additional ones.
- The tool increments counters on the shared request context (`ctx.selfTrackingToolsCalled++`) so the `agent_completion` event has accurate totals.
- The return value `{ tracked: true, intent_id }` is simple - the agent doesn't need a complex response, just confirmation.
- The tool's `description` includes "Call this FIRST" - this is part of guiding the agent's behavior.

### track_agent_decision

```typescript title="src/lib/tools/self-tracking-tools.ts (continued)"
const trackAgentDecisionInputSchema = z.object({
  decision_type: z
    .enum([
      'tool_selection',
      'parameter_reasoning',
      'result_interpretation',
      'clarification_needed',
      'constraint_handling',
    ])
    .describe('Type of decision'),
  reasoning: z
    .string()
    .describe('Natural language explanation of your decision'),
  context: z
    .object({
      considered_options: z.array(z.string()).optional(),
      selected_option: z.string().optional(),
      selection_criteria: z.array(z.string()).optional(),
      trade_offs: z.string().optional(),
    })
    .passthrough()
    .optional()
    .describe('Additional context about the decision'),
});

export function createTrackAgentDecisionTool(ctx: RequestContext) {
  return tool({
    description:
      'Log a decision you are about to make. Call this BEFORE executing business tools.',
    inputSchema: trackAgentDecisionInputSchema,
    execute: async (params) => {
      const startTime = Date.now();
      const toolCallId = crypto.randomUUID();
      const decisionId = crypto.randomUUID();
      ctx.totalToolsCalled++;
      ctx.selfTrackingToolsCalled++;

      trackAgentDecisionLogged({
        invocationId: ctx.invocationId,
        sessionId: ctx.sessionId,
        decisionId,
        decisionType: params.decision_type,
        reasoning: params.reasoning,
        decisionContext: params.context,
        toolCallId,
        executionDurationMs: Date.now() - startTime,
        modelName: ctx.modelName,
        modelProvider: ctx.modelProvider,
      });

      return { tracked: true, decision_id: decisionId };
    },
  });
}
```

### track_constraint_violation

```typescript title="src/lib/tools/self-tracking-tools.ts (continued)"
const trackConstraintViolationInputSchema = z.object({
  constraint_type: z
    .enum(['budget', 'dates', 'availability', 'route', 'preferences', 'other'])
    .describe('Type of constraint that was violated'),
  user_requirement: z.string().describe('What the user requested'),
  reason_not_met: z.string().describe('Why it cannot be fulfilled'),
  alternatives_considered: z
    .array(z.string())
    .optional()
    .describe('Alternative options you considered'),
  recommendation: z
    .string()
    .optional()
    .describe('Your recommended alternative'),
});

export function createTrackConstraintViolationTool(ctx: RequestContext) {
  return tool({
    description:
      'Log when a user requirement cannot be met. Call this when you detect a constraint violation.',
    inputSchema: trackConstraintViolationInputSchema,
    execute: async (params) => {
      const startTime = Date.now();
      const toolCallId = crypto.randomUUID();
      const violationId = crypto.randomUUID();
      ctx.totalToolsCalled++;
      ctx.selfTrackingToolsCalled++;

      trackConstraintViolation({
        invocationId: ctx.invocationId,
        sessionId: ctx.sessionId,
        violationId,
        constraintType: params.constraint_type,
        userRequirement: params.user_requirement,
        reasonNotMet: params.reason_not_met,
        alternativesConsidered: params.alternatives_considered,
        recommendation: params.recommendation || null,
        toolCallId,
        executionDurationMs: Date.now() - startTime,
        modelName: ctx.modelName,
        modelProvider: ctx.modelProvider,
      });

      return { tracked: true, violation_id: violationId };
    },
  });
}
```

## Wire the tools into the chat route

Two changes are needed in `src/app/api/chat/route.ts`:

### 1. Register the tools

Add the three self-tracking tools alongside the three business tools:

```typescript title="src/app/api/chat/route.ts"
import {
  createTrackUserIntentTool,
  createTrackAgentDecisionTool,
  createTrackConstraintViolationTool,
} from '@/lib/tools/self-tracking-tools';

// In the streamText call:
tools: {
  search_flights: createSearchFlightsTool(requestContext),
  book_flight: createBookFlightTool(requestContext),
  check_calendar: createCheckCalendarTool(requestContext),
  track_user_intent: createTrackUserIntentTool(requestContext),
  track_agent_decision: createTrackAgentDecisionTool(requestContext),
  track_constraint_violation: createTrackConstraintViolationTool(requestContext),
},
```

The agent now has six tools available - three for business actions and three for self-tracking.

### 2. Add the self-tracking protocol to the system prompt

This is the critical piece - the system prompt instructions that tell the agent *when* and *how* to use its self-tracking tools:

```typescript title="src/app/api/chat/route.ts (system prompt addition)"
system: `You are a helpful travel assistant with self-awareness capabilities...

SELF-TRACKING PROTOCOL:
You MUST use self-tracking tools to make your reasoning transparent:

1. **When you receive a user message:**
   - First, provide a brief friendly response acknowledging their request
   - Then call track_user_intent to log your interpretation
   - Extract entities (origin, destination, dates, budget, preferences)
   - Provide confidence score (0.7-1.0 for clear requests, 0.3-0.7 for ambiguous)
   - Explain your reasoning

2. **Before executing any business tool:**
   - Call track_agent_decision with decision_type: "tool_selection"
   - Explain why you are choosing this tool and these parameters
   - Document your reasoning process

3. **When you cannot meet requirements:**
   - Call track_constraint_violation immediately
   - Specify the constraint type (budget, dates, availability, etc.)
   - Document what the user wanted and why it is not possible
   - Suggest alternatives

WORKFLOW EXAMPLE:
User: "Find cheap flights to Paris tomorrow"
Response: "I'll help you find affordable flights to Paris for tomorrow."
1. track_user_intent(intent_category="search_flights", confidence=0.9, ...)
2. track_agent_decision(decision_type="tool_selection", reasoning="Will use search_flights with sort_by='price'...")
3. search_flights(...)
4. [After receiving results] Present the results to the user

IMPORTANT: After calling tracking tools, you MUST continue to take action on the user's request.
Do not just track -- actually help them by calling business tools or asking for missing information.`,
```

:::note Why this matters: prompt engineering for self-tracking
Without clear instructions, the LLM might skip tracking, over-track, or treat tracking as its primary task rather than a secondary one. The protocol addresses each risk:

- **"MUST use self-tracking tools"** - prevents skipping
- **"First, provide a brief friendly response"** - ensures the user gets an immediate acknowledgment before tracking tools run
- **"IMPORTANT: After calling tracking tools, you MUST continue to take action"** - prevents the agent from treating tracking as the end goal
- **The workflow example** - gives the agent a concrete template to follow

The balance matters: you want complete tracking without disrupting the conversation flow.
:::

## Try it out

```bash
git checkout v0.3-agentic-tracking  # (or verify your code-along)
npm run start:dev
```

### Scenario A: Normal flow

Send "Find cheap flights from London to Paris tomorrow"

1. Open **Snowplow Micro UI** at [http://localhost:9090/micro/ui](http://localhost:9090/micro/ui) and refresh after the agent responds
2. Find the `user_intent_detected` event - drill into it to see:
   - `intent_category`: "search_flights"
   - `confidence`: ~0.9 (this is a clear request)
   - `extracted_entities`: `{ origin: "London", destination: "Paris", date: "...", preferences: ["cheap"] }`
   - `reasoning`: The agent's explanation of how it interpreted the message
3. Find the `agent_decision_logged` event - see:
   - `decision_type`: "tool_selection"
   - `reasoning`: "Will use search_flights with sort_by='price' since user said 'cheap'"
4. Find the `tool_execution` for `search_flights` (this existed in v0.2)
5. Trace the full event chain through the Micro UI - all events share the same `invocation_id`

### Scenario B: Constraint violation

Send "Find a flight to Tokyo for $20"

1. Refresh the Micro UI after the agent responds
2. Find the `user_intent_detected` event - notice the confidence might be lower and the budget constraint is noted in `extracted_entities`
3. Find the `constraint_violation` event - drill into it to see:
   - `constraint_type`: "budget"
   - `user_requirement`: "$20 to Tokyo"
   - `reason_not_met`: An explanation of why flights to Tokyo can't cost $20
   - `alternatives_considered`: What other options the agent thought about
   - `recommendation`: What the agent suggests instead
4. The agent still responds helpfully to the user with alternatives - tracking doesn't interrupt the conversation

---

> Summary
> Files: 1 added, 2 modified | Events: `user_intent_detected`, `agent_decision_logged`, `constraint_violation` | Entities: reuses `agent_context`, `tool_context` from v0.2
> Key takeaway: the agent now documents its own reasoning - what it understood, why it chose a course of action, and when it can't meet requirements. This answers "what did the agent think?"

You now have all three layers of tracking in place. The final section puts it all together - showing how events connect across layers and what you can build with this data.
