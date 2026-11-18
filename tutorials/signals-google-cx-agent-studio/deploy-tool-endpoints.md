---
title: "Deploy the agent tool endpoints"
sidebar_label: "Deploy tool endpoints"
position: 3
description: "Understand why the CX Agent Studio agent calls endpoints you host rather than Signals directly, walk through the context endpoint, and deploy the storefront and its tool endpoints to Vercel."
keywords: ["CX Agent Studio", "OpenAPI tools", "Signals", "Vercel", "tool endpoint", "agentic context"]
date: "2026-11-09"
---

The CX Agent Studio agent doesn't call Signals directly. Instead, it calls five API endpoints that the storefront hosts, and those endpoints call Signals. On this page, you'll learn why, look at how the context endpoint works, and deploy the storefront so that CX Agent Studio can reach the endpoints over public HTTPS.

## Understand why the agent calls your endpoints

The storefront's `/api/agent/*` routes sit between CX Agent Studio and Snowplow:

| Endpoint                         | Tool                       | What it does                                                                 |
| -------------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `GET /api/agent/context`         | `getUserContext`           | Reads the shopper's Signals attributes and agentic context                   |
| `GET /api/agent/catalog`         | `searchCatalog`            | Searches the demo product catalog                                            |
| `POST /api/agent/track-intent`   | `trackUserIntent`          | Tracks a `user_intent_detected` event                                         |
| `POST /api/agent/track-decision` | `trackAgentDecision`       | Tracks an `agent_decision_logged` event                                       |
| `POST /api/agent/track-constraint` | `trackConstraintViolation` | Tracks a `constraint_violation` event                                       |

There are four reasons to have endpoints in the middle.

The first is authentication. The Signals API authenticates with an API key and an API key ID, which you exchange for a short-lived access token. CX Agent Studio OpenAPI tools authenticate with a service agent ID token, a service account, OAuth, or a single static API key, and none of these performs that exchange. The endpoints hold the Snowplow credentials server-side, and CX Agent Studio authenticates to them with a shared secret.

The second is the response shape. Each OpenAPI tool maps to a single operation. The agent needs both the session's attributes and its recent activity, and the context endpoint combines the two Signals reads into one response. That means one tool call per turn instead of two. The endpoint also flattens arrays and objects into strings, which are easier for the model to read than nested JSON.

The third is tracking. CX Agent Studio runs the agent, so you can't add tracking code to the agent itself. The endpoints are the only part of the request path you control, and each one tracks a Snowplow event as it handles a tool call. Without them, you'd have no `tool_execution` events.

The fourth is identity. CX Agent Studio adds the shopper's Snowplow IDs to each tool request as headers, which you'll configure on the next page. The endpoints read those headers, look up the right session in Signals, and set the same IDs on the server-side events. That's how agent events end up with the shopper's `domain_sessionid`, so you can join them to the shopper's browsing events.

## Walk through the context endpoint

The context endpoint is in `storefront/src/app/api/agent/context/route.ts`. Here's a shortened version, with the tracking and error handling simplified:

```typescript title="storefront/src/app/api/agent/context/route.ts"
const SERVICE_NAME = "fashion_ecommerce_demo";
const EVENT_LOG_NAME = "fashion_session_activity";
const ATTRIBUTE_KEY = "domain_sessionid";

const DEGRADED_PAYLOAD = { profile: {}, recent_activity: "", agent_instructions: "" };

export async function GET(request: NextRequest) {
  // Reject requests without the shared secret in the x-agent-api-key header
  if (!isAuthorizedAgentRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  const identity = resolveAgentIdentity(request, sessionId);
  let degradedReason = "none";
  let responsePayload = DEGRADED_PAYLOAD;

  try {
    if (!sessionId) {
      degradedReason = "missing_session";
    } else {
      // Read attributes and the agentic context in parallel
      const signals = getSignalsClient();
      const [profileResult, contextResult] = await Promise.allSettled([
        signals.getServiceAttributes({
          name: SERVICE_NAME,
          attribute_key: ATTRIBUTE_KEY,
          identifier: sessionId,
        }),
        signals.getAgenticContext({
          name: EVENT_LOG_NAME,
          identifier: sessionId,
          format: "json",
        }),
      ]);

      const context = contextResult.value;
      responsePayload = {
        profile: flattenProfile(profileResult.value),
        recent_activity: [context.summary, ...renderEventLines(context.events)].join("\n"),
        agent_instructions: context.prompt,
      };
    }
  } finally {
    // Track a tool_execution event with a context_lookup entity
    await trackContextLookupToolExecution({ identity, degradedReason /* ... */ });
  }

  return NextResponse.json(responsePayload);
}
```

The endpoint uses the [Signals Node.js SDK](/docs/signals/connection/) to make two reads, both keyed by `domain_sessionid`. The `getServiceAttributes` call reads the attribute group through the `fashion_ecommerce_demo` service, as described in [retrieve attributes](/docs/signals/applications/retrieve-attributes/). The `getAgenticContext` call reads the session's recent events, a summary, and the agentic context's prompt, as described in [use agentic contexts](/docs/signals/applications/agentic-contexts/).

The endpoint always returns `200`, even when it has no session ID, the session is unknown, or Signals is unreachable. In those cases it returns the empty `DEGRADED_PAYLOAD`. The agent's instructions tell it to treat an empty payload as a new customer, so the shopper never sees an error. The endpoint records why the payload was empty in the `degraded_reason` field of the `context_lookup` entity: `missing_session`, `no_credentials`, or `upstream_error`. You can query how often each happens on the analytics page.

The other endpoints follow the same pattern: check the shared secret, read the identity headers, do the work, and track an event. The three self-tracking endpoints also validate what the model sends. For example, `trackUserIntent` only accepts an `intent_category` from a fixed list such as `complete_look`, `occasion_dressing`, or `gift`, and a `confidence` between 0 and 1. Invalid requests get a `400` response, so malformed values from the model don't reach your pipeline.

## Deploy the storefront to Vercel

CX Agent Studio calls the tool endpoints from Google's servers, so the endpoints need a public HTTPS address. You'll deploy the storefront to Vercel using the Vercel CLI.

Deploy with the CLI from your local `storefront/` directory, rather than connecting the Vercel project to a Git repository. The Snowtype code you generated on the previous page isn't committed, so a build from Git fails. The CLI uploads your local files, including the generated code.

Create a strong shared secret for the deployed endpoints. Don't reuse the value from `.env.local`:

```bash
openssl rand -hex 32
```

Keep this value. You'll add it to CX Agent Studio on the next page.

Link the `storefront/` directory to a new Vercel project:

```bash
vercel link
```

In the Vercel dashboard, open the project's **Settings** > **Environment Variables**, and add these variables for the **Production** environment:

| Variable                             | Value                                                    | Exposed to the browser |
| ------------------------------------ | -------------------------------------------------------- | ---------------------- |
| `SNOWPLOW_CONSOLE_API_KEY`           | From `.env.local`                                        | No, mark as sensitive  |
| `SNOWPLOW_CONSOLE_API_KEY_ID`        | From `.env.local`                                        | No, mark as sensitive  |
| `SNOWPLOW_CONSOLE_ORG_ID`            | From `.env.local`                                        | No, mark as sensitive  |
| `SIGNALS_DEPLOYED_URL`               | From `.env.local`                                        | No, mark as sensitive  |
| `AGENT_SHARED_SECRET`                | The value you just created                               | No, mark as sensitive  |
| `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL` | From `.env.local`                                        | Yes                    |
| `NEXT_PUBLIC_SNOWPLOW_APP_ID`        | `atelier-storefront`                                     | Yes                    |
| `NEXT_PUBLIC_SNOWPLOW_POST_PATH`     | Your custom tracker request path, if you set one         | Yes                    |

Next.js only includes variables that start with `NEXT_PUBLIC_` in the browser bundle. The Snowplow credentials and the shared secret stay on the server.

Server-side agent events use the app ID `atelier-storefront-agent` by default, which is the browser app ID plus `-agent`. Both app IDs are registered in the tracking plan you published.

Deploy to production:

```bash
vercel --prod
```

The repository's `vercel.json` sets `Cache-Control: no-store` and `X-Robots-Tag: noindex` on every `/api/agent/*` response, so tool responses are never cached or indexed.

### Check the deployment

Run the deployment check against your production URL, using the shared secret you set in Vercel:

```bash
AGENT_SHARED_SECRET=<your-shared-secret> npm run verify:deploy -- https://<your-storefront-url>
```

The script checks that:

- The site is publicly reachable
- Every agent endpoint rejects requests without the shared secret with a `401` response
- Authorized requests return the expected response shapes

The self-tracking checks send an `x-agent-tracking-dry-run: 1` header, so they validate the request without sending events to your pipeline.

Then repeat the browsing check from the previous page on your deployed URL. Browse a few products, add one to the cart, and confirm that your session's attributes appear.
