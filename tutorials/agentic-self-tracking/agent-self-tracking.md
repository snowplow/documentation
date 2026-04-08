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

- `v0.1` tracked what the user did - events emitted by browser code you wrote
- `v0.2` tracked what the system did - events emitted by server framework callbacks
- `v0.3` tracks what the agent thinks - events emitted by the LLM itself, via tool calls

The agent becomes an observer of its own reasoning. You give it three new tools that don't perform business actions - they log the agent's internal state:


| Tool                         | Purpose                                             | When called                        |
| ---------------------------- | --------------------------------------------------- | ---------------------------------- |
| `track_user_intent`          | "I understood the user wants X with confidence Y"   | First, on every new user message   |
| `track_agent_decision`       | "I'm choosing to do Y because Z"                    | Before executing any business tool |
| `track_constraint_violation` | "The user wants A, but it's not possible because B" | When a requirement can't be met    |


These are tools like any other - the LLM calls them when instructed by the system prompt. The difference is they don't search flights or book tickets; they log the agent's reasoning into Snowplow events.

## What you'll add

This stage introduces:

- Three event schemas from Iglu Central: `user_intent_detected`, `agent_decision_logged`, `constraint_violation`
- One custom entity schema (created locally): `intent_extraction` - domain-specific entity for the travel app's extracted intent data
- One new file: `src/lib/tools/self-tracking-tools.ts` - three tool factories
- Modifications to: `src/lib/tracking/server.ts` (three new tracking functions) and `src/app/api/chat/route.ts` (register tools + system prompt protocol)

## Define the schemas

The three event schemas are published on [Iglu Central](https://github.com/snowplow/iglu-central) under vendor `com.snowplow.agent.tracking`, just like the schemas from previous stages. You'll also create one custom entity for domain-specific data.

### user_intent_detected

Captures the agent's interpretation of what the user wants, including a confidence score and reasoning.

```yaml title="user_intent_detected schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs the detected user intent category and confidence.'
  self:
    vendor: com.snowplow.agent.tracking
    name: user_intent_detected
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      format: uuid
    intent_id:
      type: string
      description: 'Unique identifier for this detected intent'
      format: uuid
    intent_category:
      type: string
      examples:
        - search_flights
        - submit_order
        - ask_question
        - cancel_booking
        - get_recommendations
      description: 'Category of user intent (application-defined)'
      maxLength: 255
    confidence:
      type: number
      minimum: 0
      maximum: 1
      description: 'Confidence level (0-1)'
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
    - detected_at
  additionalProperties: false
```

Notice that `intent_category` is a permissive `string` with `examples`, not a restricted enum. The Iglu Central schema is domain-agnostic - a travel app uses `search_flights`, while a support app might use `open_ticket`. You'll enforce your travel-specific values with Zod in [the two-tier validation pattern](#use-permissive-schemas-with-strict-application-code) later in this page.

Also notice what's *not* here: there's no `extracted_entities` field. The generic event captures *that* intent was detected - the category and confidence. *What* was extracted (origin, destination, dates) is domain-specific data that belongs in a custom entity.

### Create the intent extraction entity

Just like you created `tool_params` and `tool_results` custom entities in the previous stage, you'll create an `intent_extraction` entity to capture what the agent interpreted from the user's message. This follows the same pattern: the generic Iglu Central event carries lifecycle data, your custom entity carries the business data.

Create the entity at `snowplow/iglu-local/schemas/com.snowplow.demo.travel/intent_extraction/jsonschema/1-0-0`:

```json title="snowplow/iglu-local/schemas/com.snowplow.demo.travel/intent_extraction/jsonschema/1-0-0"
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "What the agent interpreted from the user's message in the travel demo app. Attached to user_intent_detected events to capture extracted travel intent details.",
  "self": {
    "vendor": "com.snowplow.demo.travel",
    "name": "intent_extraction",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "origin": {
      "type": ["string", "null"],
      "description": "Origin city or airport code",
      "maxLength": 200
    },
    "destination": {
      "type": ["string", "null"],
      "description": "Destination city or airport code",
      "maxLength": 200
    },
    "date": {
      "type": ["string", "null"],
      "description": "Departure date in YYYY-MM-DD format",
      "maxLength": 10
    },
    "return_date": {
      "type": ["string", "null"],
      "description": "Return date for round-trip in YYYY-MM-DD format",
      "maxLength": 10
    },
    "passengers": {
      "type": ["integer", "null"],
      "description": "Number of passengers",
      "minimum": 1
    },
    "budget_min": {
      "type": ["number", "null"],
      "description": "Minimum budget amount"
    },
    "budget_max": {
      "type": ["number", "null"],
      "description": "Maximum budget amount"
    },
    "currency": {
      "type": ["string", "null"],
      "description": "Currency code for budget values",
      "maxLength": 10
    },
    "preferences": {
      "type": ["array", "null"],
      "description": "User preferences extracted from the message",
      "items": {
        "type": "string",
        "maxLength": 500
      }
    }
  },
  "additionalProperties": false
}
```

Key things to notice about this entity:

- Vendor: `com.snowplow.demo.travel` - your application's namespace, not the shared registry
- All fields nullable: the agent may not extract every field from every message. A message like "flights to Paris" has a destination but no date, budget, or passenger count.
- No required fields: unlike the event schemas, the entity is entirely optional data. Which fields are populated depends on what the agent extracts.
- Location: this lives in `snowplow/iglu-local/`, resolved by Snowplow Micro from the mounted volume - just like the `tool_params` and `tool_results` entities from the previous stage

:::note Why intent_extraction is separate from tool_params
You might notice that `intent_extraction` shares some fields with `tool_params` - both have `origin`, `destination`, `date`, and `passengers`. They are separate entities because they represent different points in the agent lifecycle with different semantic meaning:

- `intent_extraction` captures what the agent *understood* from the user's message, attached to `user_intent_detected`. This happens before any tool runs. The values are the agent's interpretation - they may be incomplete, inferred, or wrong.
- `tool_params` captures what the agent *actually passed* to a business tool, attached to `tool_execution`. This happens later, after the agent has made decisions. The values are concrete parameters that drove a real action.

Comparing the two for the same conversation turn tells you how the agent translated user intent into action. Did it fill in defaults the user didn't mention? Did it ignore a preference? Did it change a parameter after seeing search results? These are the questions a separate-entity model lets you answer in your warehouse, and they collapse into noise if both stages share a single entity.
:::

### agent_decision_logged

Captures the reasoning behind a decision the agent is about to make, including what factors it considered.

```yaml title="agent_decision_logged schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs a decision the agent is about to make, including reasoning and considerations.'
  self:
    vendor: com.snowplow.agent.tracking
    name: agent_decision_logged
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      format: uuid
    decision_id:
      type: string
      description: 'Unique identifier for this decision'
      format: uuid
    decision_type:
      type: string
      examples:
        - tool_selection
        - parameter_reasoning
        - result_interpretation
        - clarification_needed
        - constraint_handling
      description: 'Type of decision (application-defined)'
      maxLength: 255
    reasoning:
      type: string
      description: 'Natural language explanation of the decision'
      maxLength: 2000
    considerations:
      type:
        - array
        - 'null'
      description: 'Factors the agent considered when making this decision'
      items:
        type: string
        maxLength: 2000
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

```yaml title="constraint_violation schema (Iglu Central)"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: 'http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#'
  description: 'Agent self-tracking: logs when a user requirement cannot be met due to a constraint.'
  self:
    vendor: com.snowplow.agent.tracking
    name: constraint_violation
    format: jsonschema
    version: 1-0-0
  type: object
  properties:
    invocation_id:
      type: string
      description: 'Unique identifier for the agent invocation'
      format: uuid
    violation_id:
      type: string
      description: 'Unique identifier for this violation'
      format: uuid
    constraint_type:
      type: string
      examples:
        - budget
        - dates
        - availability
        - permissions
        - rate_limit
      description: 'Type of constraint that was violated (application-defined)'
      maxLength: 255
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
        maxLength: 1000
      description: 'Alternative options considered'
    recommendation:
      type:
        - string
        - 'null'
      description: 'Recommended alternative'
      maxLength: 1000
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

Add three new tracking functions to `src/lib/tracking/server.ts`. They follow the same pattern as the v0.2 functions, attaching `agent_context` and `tool_context` entities (with `tool_category: 'self_tracking'`). The `trackUserIntentDetected` function also conditionally attaches the `intent_extraction` custom entity.

Here's `trackUserIntentDetected` as the pattern:

```typescript title="src/lib/tracking/server.ts"
export const trackUserIntentDetected = (params: UserIntentDetectedParams) => {
  const t = initServerTracker();
  if (!t) return;

  const contexts: Array<{ schema: string; data: Record<string, unknown> }> = [
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
  ];

  if (params.intentExtraction) {
    contexts.push(buildIntentExtraction(params.intentExtraction));
  }

  t.track(
    buildSelfDescribingEvent({
      event: {
        schema: 'iglu:com.snowplow.agent.tracking/user_intent_detected/jsonschema/1-0-0',
        data: {
          invocation_id: params.invocationId,
          intent_id: params.intentId,
          intent_category: params.intentCategory,
          confidence: params.confidence,
          reasoning: params.reasoning ?? null,
          detected_at: new Date().toISOString(),
        },
      },
    }),
    contexts,
  );
};
```

The `buildIntentExtraction` helper references the local custom entity schema:

```typescript title="src/lib/tracking/server.ts (continued)"
const buildIntentExtraction = (data: IntentExtractionData) => ({
  schema: 'iglu:com.snowplow.demo.travel/intent_extraction/jsonschema/1-0-0' as const,
  data: data as unknown as Record<string, unknown>,
});
```

This is the same entity composition pattern from the previous stage - generic Iglu Central event plus custom entities from `iglu-local`. A single `user_intent_detected` event carries three entities: `tool_context`, `agent_context` (both from Iglu Central), and `intent_extraction` (from `iglu-local`).

`trackAgentDecisionLogged` and `trackConstraintViolation` follow the same structure with their respective schemas and data fields. Neither needs custom entities - `considerations` (a string array) and `constraint_violation` fields are generic enough to live on the Iglu Central event directly.

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
  origin: z.string().nullish().describe('Origin city or airport'),
  destination: z.string().nullish().describe('Destination city or airport'),
  date: z.string().nullish().describe('Travel date'),
  return_date: z.string().nullish().describe('Return date'),
  passengers: z.number().nullish().describe('Number of passengers'),
  budget_min: z.number().nullish().describe('Minimum budget'),
  budget_max: z.number().nullish().describe('Maximum budget'),
  currency: z.string().nullish().describe('Budget currency'),
  preferences: z
    .array(z.string())
    .nullish()
    .describe('Travel preferences'),
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
        intentExtraction: {
          origin: params.origin ?? null,
          destination: params.destination ?? null,
          date: params.date ?? null,
          return_date: params.return_date ?? null,
          passengers: params.passengers ?? null,
          budget_min: params.budget_min ?? null,
          budget_max: params.budget_max ?? null,
          currency: params.currency ?? null,
          preferences: params.preferences ?? null,
        },
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

- The Zod schema enforces `intent_category` as a strict enum (six travel-specific values), while the Iglu Central schema accepts any string. This is the [two-tier validation pattern](#use-permissive-schemas-with-strict-application-code).
- The extracted entity fields (`origin`, `destination`, `date`, etc.) are flat on the Zod schema - they're part of what the LLM provides. The `execute` function collects them into an `intentExtraction` object that `trackUserIntentDetected` attaches as a custom entity.
- The tool increments counters on the shared request context (`ctx.selfTrackingToolsCalled++`) so the `agent_completion` event has accurate totals.
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
  considerations: z
    .array(z.string())
    .optional()
    .describe('Key factors, options, or trade-offs you considered'),
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
        considerations: params.considerations,
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

## Use permissive schemas with strict application code

You may have noticed a deliberate mismatch between the Iglu Central schemas and the Zod schemas you just defined. Compare `intent_category` in both:

Iglu Central (the schema that validates the Snowplow event):

```yaml
intent_category:
  type: string
  maxLength: 255
  description: 'Category of user intent (application-defined)'
```

Zod (the schema that validates the LLM's tool call input):

```typescript
intent_category: z.enum([
  'search_flights',
  'book_flight',
  'modify_booking',
  'cancel_booking',
  'get_recommendations',
  'ask_question',
])
```

The Iglu Central schema accepts any string up to 255 characters. The Zod schema only accepts six specific values. The same pattern applies to `decision_type` and `constraint_type` across all three self-tracking tools.

This is intentional - and it's the recommended approach for production agentic tracking implementations.

### Why the schemas are permissive

The Iglu Central schemas are designed to work for any agentic application - travel, customer support, finance, healthcare. A support app's intent categories might be `open_ticket`, `escalate`, or `check_status`. A finance app might use `analyze_portfolio` or `execute_trade`. Hardcoding enums into the registry schema would break this reusability.

Instead, the Iglu Central schemas use `examples` to suggest common values and `maxLength` to prevent unbounded strings, but accept any value:

```yaml
# From the Iglu Central constraint_violation schema
constraint_type:
  type: string
  examples: ["budget", "dates", "availability", "permissions", "rate_limit"]
  description: 'Type of constraint that was violated (application-defined)'
  maxLength: 255
```

### Why application code is strict

Your application knows its own domain. The travel app has exactly six intent categories and six constraint types - the LLM should not invent new ones. The Zod enum enforces this at the tool call boundary, before the data ever reaches Snowplow:

1. The LLM calls `track_user_intent` with `intent_category: "search_flights"`
2. Zod validates that `"search_flights"` is in the allowed enum - if not, the tool call fails and the LLM retries
3. The validated value flows into the Snowplow event, which Iglu Central also validates (it passes, since any string under 255 characters is valid)

If you add a new intent category to your app - say `compare_flights` - you update the Zod enum in `self-tracking-tools.ts`. No schema version bump needed. No registry update. The Iglu Central schema already accepts it.

:::tip When to use this pattern
Two-tier validation works well for any field where the *set of valid values* is application-specific but the *field itself* is generic. It's not needed for fields like `confidence` (0-1 number range is universal) or `reasoning` (free-text by nature). Focus it on categorical fields that vary by domain.
:::

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

The agent has six tools available - three for business actions and three for self-tracking.

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

- "MUST use self-tracking tools" - prevents skipping
- "First, provide a brief friendly response" - ensures the user gets an immediate acknowledgment before tracking tools run
- "IMPORTANT: After calling tracking tools, you MUST continue to take action" - prevents the agent from treating tracking as the end goal
- The workflow example - gives the agent a concrete template to follow

The balance matters: you want complete tracking without disrupting the conversation flow.
:::

## Try it out

Check that `.env.local` has a valid API key for the model you plan to use - placeholder values like `sk-ant-...` cause silent failures.

```bash
git checkout v0.3-agentic-tracking  # (or verify your code-along)
npm run start:dev
```

### Test a normal flow

Send "Find cheap flights from London to Paris tomorrow"

1. Open **Snowplow Micro UI** at [http://localhost:9090/micro/ui](http://localhost:9090/micro/ui) and refresh after the agent responds
2. Find the `user_intent_detected` event - drill into it to see:
  - `intent_category`: "search_flights"
  - `confidence`: ~0.9 (this is a clear request)
  - `reasoning`: The agent's explanation of how it interpreted the message
  - In the event's entities, find the `intent_extraction` custom entity: `{ origin: "London", destination: "Paris", date: "2026-04-10", preferences: ["cheap"] }`
3. Find the `agent_decision_logged` event - see:
  - `decision_type`: "tool_selection"
  - `reasoning`: "Will use search_flights with sort_by='price' since user said 'cheap'"
  - `considerations`: the factors the agent weighed
4. Find the `tool_execution` for `search_flights` (this existed in v0.2)
5. Trace the full event chain through the Micro UI - all events share the same `invocation_id`

### Test constraint handling

Send "Find a flight to Tokyo for $20"

1. Refresh the Micro UI after the agent responds
2. Find the `user_intent_detected` event - notice the confidence might be lower. Check the `intent_extraction` entity for the budget constraint noted in `budget_max`
3. Find the `constraint_violation` event - drill into it to see:
  - `constraint_type`: "budget"
  - `user_requirement`: "$20 to Tokyo"
  - `reason_not_met`: An explanation of why flights to Tokyo can't cost $20
  - `alternatives_considered`: What other options the agent thought about
  - `recommendation`: What the agent suggests instead
4. The agent still responds helpfully to the user with alternatives - tracking doesn't interrupt the conversation

:::note Stage summary
- Files: one added, two modified
- Events: `user_intent_detected`, `agent_decision_logged`, `constraint_violation`
- Entities: `agent_context`, `tool_context` (Iglu Central) + `intent_extraction` (custom)

The agent documents its own reasoning - what it understood, why it chose a course of action, and when it can't meet requirements. Domain-specific extracted data lives in a custom entity, following the same pattern as `tool_params` and `tool_results` from the previous stage.
:::

You have all three layers of tracking in place. The final section puts it all together - showing how events connect across layers and what you can build with this data.