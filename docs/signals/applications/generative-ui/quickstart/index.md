---
title: "Add Signals GenUI to a json-render app"
sidebar_position: 10
sidebar_label: "Quickstart"
description: "Add the current user's behavior to a json-render app: add the page component, create a surface in Console, connect the surface, and add the context to your prompt. Signals GenUI then tracks what the model selected and what the user saw."
keywords: ["signals genui quickstart", "json-render", "useUIStream", "streamText", "vercel ai sdk", "next.js", "generative ui"]
date: "2026-10-22"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This guide adds Signals GenUI to an app built with json-render's [quick start](https://json-render.dev/docs/quick-start) and [AI SDK integration](https://json-render.dev/docs/ai-sdk): a catalog, a registry, a route that streams a spec with `streamText`, and a component that renders it with `useUIStream`. You don't change your catalog, your registry, or your components.

When you finish, the model knows how long the user has been reading the page, and can compose a block that appears only once they've read for about 20 seconds. Signals GenUI also tracks what the model selected and what the user saw, with no tracking code of your own.

In the code below, highlighted lines are the ones Signals GenUI needs you to add or change. The rest is code your app already has.

You'll need:

* A Next.js app using the App Router, with React 19
* json-render set up as in its quick start, with `@json-render/core`, `@json-render/react`, and `ai`
* A Signals deployment, and your [connection credentials](/docs/signals/connection/index.md#connection-credentials)

## Install and add the page component

Install the SDK:

```bash
npm install @snowplow/signals-genui
```

The page component connects Signals GenUI to the Snowplow [browser tracker](/docs/sources/web-trackers/index.md), and loads your surfaces from Signals. Render it once, in your root layout. It renders nothing.

<Tabs groupId="genui-tracker" queryString>
<TabItem value="new" label="Create a tracker" default>

Add the page component to your root layout, with your Signals API URL, your app ID, and your Collector URL. It creates the tracker, and tracks a page view on every route change. `tracking` turns on the page pings this guide uses:

```tsx title="app/layout.tsx"
// highlight-next-line
import { SignalsGenUI } from "@snowplow/signals-genui/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* highlight-start */}
        <SignalsGenUI
          signalsUrl="https://{{123abc}}.signals.snowplowanalytics.com"
          appId="my-app"
          collectorUrl="https://collector.example.com"
          tracking={{ activity: { minimumVisitLength: 10, heartbeatDelay: 10 } }}
        />
        {/* highlight-end */}
      </body>
    </html>
  );
}
```

</TabItem>
<TabItem value="existing" label="Use your tracker">

If your app already has a Snowplow tracker, pass it to the page component, with your Signals API URL. A tracker can't be passed from a server component, so create a client component for it:

```tsx title="components/signals-genui.tsx"
"use client";

import { SignalsGenUI } from "@snowplow/signals-genui/nextjs";
import { tracker } from "@/lib/tracker"; // Your app's tracker, created with newTracker()

export function SignalsGenUIProvider() {
  return tracker ? <SignalsGenUI tracker={tracker} signalsUrl="https://{{123abc}}.signals.snowplowanalytics.com" /> : null;
}
```

Then render it in your root layout. Your app keeps tracking its own page views:

```tsx title="app/layout.tsx"
// highlight-next-line
import { SignalsGenUIProvider } from "@/components/signals-genui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* highlight-next-line */}
        <SignalsGenUIProvider />
      </body>
    </html>
  );
}
```

This guide counts page pings, so enable [activity tracking](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md) on your tracker if it isn't on already.

</TabItem>
</Tabs>


## Create a surface in Console

A surface tells Signals GenUI which behavior to compute, and tells the model what each value means.

{/* TODO: add the Console navigation path to the surface editor, and the name of the save button, once confirmed. */}

Create a surface, and add one client-side attribute that counts the page pings on the current page:

1. Set **Surface ID** to `pdp_purchase_assist`, the ID your component passes to the SDK
2. Under **Client-side attributes**, click **Add attribute**, and set:
    * **Name**: `pings_on_page`
    * **Events**: `page_ping`
    * **Aggregation**: **Count**
    * **Scope**: **Page view**, so the count restarts on every page
3. In the attribute's description, write what the value means for the model: "Activity heartbeats on this page, about one per 10 seconds of active reading. 2 means about 20 seconds engaged."
4. Save the surface

![The surface editor in Console, with the surface ID, default event counts, client-side attributes, Signals inputs, and a preview of what the model sees](../../../images/genui-create-surface.png)

**What the model sees**, at the bottom of the editor, shows the lines Signals GenUI adds to the model's system prompt for this surface. They update as you edit.

## Connect the surface

In the component that requests and renders the generated UI, add `useJsonRenderSurface` before `useUIStream`. It gives you the surface's live state, a `request()` function that builds the surface request to send with your prompt, and an `onComplete` callback for `useUIStream`:

```tsx title="components/purchase-assist.tsx"
"use client";

import { JSONUIProvider, Renderer, useUIStream } from "@json-render/react";
// highlight-next-line
import { useJsonRenderSurface } from "@snowplow/signals-genui/json-render";
import { useEffect } from "react";
import { registry } from "@/lib/registry";

export function PurchaseAssist() {
  // highlight-next-line
  const { liveState, request, onComplete } = useJsonRenderSurface("pdp_purchase_assist");
  // highlight-next-line
  const { spec, isStreaming, send } = useUIStream({ api: "/api/generate", onComplete });

  useEffect(() => {
    // highlight-next-line
    void send("Compose the block under Add to bag", { signals: request() });
  }, [send, request]);

  return (
    // highlight-next-line
    <JSONUIProvider registry={registry} initialState={{ signals: liveState }}>
      <Renderer spec={spec} registry={registry} loading={isStreaming} />
    </JSONUIProvider>
  );
}
```

The changes do the following:

* `onComplete`: `useUIStream` calls it with the final spec, which tells Signals GenUI that the generated UI is complete. If your component already passes an `onComplete`, call the hook's `onComplete` from yours.
* `send(prompt, { signals: request() })`: `useUIStream` posts its second argument as `context`, so the surface request reaches your route as `context.signals`
* `initialState={{ signals: liveState }}`: the live values go into json-render's state model at `/signals`, where `visible` conditions can read them

If your component already sends a context or an initial state, add `signals` to it. If it doesn't stream, pass the spec to the hook instead: `useJsonRenderSurface(id, { spec, complete })`.

## Add the context to your prompt

In your route, pass `context.signals` to Signals GenUI. It adds the surface's context to the system prompt and, when the model has finished, records what it selected:

<Tabs groupId="genui-route" queryString>
<TabItem value="middleware" label="AI SDK middleware" default>

Wrap your model with `signalsMiddleware`. `wrapLanguageModel` takes a model object, so pass your model ID to `gateway()`, or use your provider's function, such as `anthropic()`:

```ts title="app/api/generate/route.ts"
// highlight-next-line
import { signalsMiddleware } from "@snowplow/signals-genui/server";
import { gateway, streamText, wrapLanguageModel } from "ai";
import { catalog } from "@/lib/catalog";

export async function POST(req: Request) {
  // highlight-next-line
  const { prompt, context } = await req.json();

  const result = streamText({
    model: wrapLanguageModel({
      model: gateway("anthropic/claude-haiku-4.5"),
      // highlight-next-line
      middleware: signalsMiddleware(context?.signals),
    }),
    system: catalog.prompt(),
    prompt,
  });

  return result.toTextStreamResponse();
}
```

</TabItem>
<TabItem value="functions" label="Without middleware">

Add the surface context to your system prompt with `surfaceContext()`, and record what the model selected with `recordDecision()` once it has finished:

```ts title="app/api/generate/route.ts"
// highlight-start
import { compileSpecStream } from "@json-render/core";
import { recordDecision, surfaceContext } from "@snowplow/signals-genui/server";
// highlight-end
import { streamText } from "ai";
import { catalog } from "@/lib/catalog";

export async function POST(req: Request) {
  // highlight-next-line
  const { prompt, context } = await req.json();

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    // highlight-next-line
    system: catalog.prompt() + "\n\n" + (await surfaceContext(context?.signals)),
    prompt,
    // highlight-next-line
    onFinish: ({ text }) => recordDecision(context?.signals, { spec: compileSpecStream(text) }),
  });

  return result.toTextStreamResponse();
}
```

</TabItem>
</Tabs>

Your server reads the surface from Signals, so it needs your [connection credentials](/docs/signals/connection/index.md#connection-credentials). To record what the model selected, it also needs your Collector URL. Add them to your server's environment:

```bash title=".env.local"
SNOWPLOW_SIGNALS_BASE_URL=https://{{123abc}}.signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_API_KEY=<API key>
SNOWPLOW_SIGNALS_API_KEY_ID=<API key ID>
SNOWPLOW_ORGANIZATION_ID=<organization ID>
SNOWPLOW_COLLECTOR_URL=https://collector.example.com
```

If Signals GenUI can't read the surface, it adds nothing to the prompt, and your route works as before.

## Check that it works

Ask the model for a block that depends on behavior, for example by adding a rule to your catalog's prompt: "Add a block that appears only once the user has read the page for about 20 seconds". Then:

1. Open the page: the generated UI renders as before
2. Stay on the page and scroll: after about 20 seconds of reading, the new block appears, without a new request
3. In [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md), find two `surface_render` events: one when the generated UI rendered, and one when the block appeared. Your server sends a `surface_decision` event for the same request, which you can find with [Snowplow Micro](/docs/testing/snowplow-micro/index.md) or in your warehouse.

Next, [configure your surfaces](/docs/signals/applications/generative-ui/configure-surfaces/index.md) with more client-side attributes, and with what Signals knows about the user from earlier visits. Your code doesn't change.
