---
title: "Use Signals GenUI with your UI framework"
sidebar_position: 30
sidebar_label: "Frameworks"
description: "Connect Signals GenUI to json-render, A2UI, or your own React components, and let generated UI react to live behavioral values."
keywords: ["signals genui", "json-render", "a2ui", "live values", "visibility conditions", "react", "generative ui"]
date: "2026-10-22"
---

Each UI framework has its own surface hook. It builds the surface request your app sends with its prompt, and puts the surface's *live values* where the generated UI can read them, so a block can appear once the user's behavior reaches a point, without a new request.

The live values are the surface's client-side attributes, at `/signals/<name>` in the framework's state, and, with default event counts on, its event counts, at `/signals/event_counts/<event name>`. Before its event happens, a count attribute is `0`, a first or last attribute is `null`, a unique list is `[]`, and an event count is missing.

## json-render

`useJsonRenderSurface` puts the live values in json-render's state model, where `visible` conditions read them with [`$state`](https://json-render.dev/docs/visibility):

```json
{
  "type": "ReviewHighlight",
  "props": { "reviewIds": ["r1", "r2"] },
  "visible": [
    { "$state": "/signals/pings_on_page", "gte": 2 },
    { "$state": "/signals/added_to_bag", "eq": 0 }
  ]
}
```

The model writes these conditions itself: Signals GenUI tells it in the prompt where the live values are and how to refer to them. You don't add anything to your catalog.

Put the live values in json-render's state in one of two ways:

* Uncontrolled: add them to the provider's initial state, `<JSONUIProvider initialState={{ ...yourState, signals: liveState }}>`, with `liveState` from the hook, as in the [quickstart](/docs/signals/applications/generative-ui/quickstart/index.md)
* Controlled: pass your json-render store, such as one from `createStateStore`, to the hook, `useJsonRenderSurface(id, { store })`, and it writes the live values into the store as they change

The hook sends a `surface_render` event when the generated UI finishes streaming, and again each time what's visible changes. It works out what's visible with json-render's own rules. With a store, conditions on your app's own state count too. Without one, the hook knows only the live values, and treats a condition on your own state as false.

## A2UI

`useA2UISurface` puts the live values in an [A2UI](https://a2ui.org/) version 0.9 surface's data model. Data bindings in your catalog read them with `{"path": "/signals/<name>"}`, and conditions use A2UI's basic functions: `numeric`, `required`, `and`, `or`, and `not`.

A2UI has no visibility property, so add a component to your catalog that shows its child while a condition holds:

```tsx
import { createComponentImplementation } from "@a2ui/react/v0_9";
import { CommonSchemas } from "@a2ui/web_core/v0_9";
import { z } from "zod";

export const Reveal = createComponentImplementation(
  {
    name: "Reveal",
    schema: z.object({ when: CommonSchemas.DynamicBoolean, child: CommonSchemas.ComponentId }),
  },
  ({ props, buildChild }) => (props.when ? buildChild(props.child) : null),
);
```

The model can then reveal a block once the user has read the page for about 20 seconds:

```json
{
  "id": "later",
  "component": "Reveal",
  "when": { "call": "numeric", "args": { "value": { "path": "/signals/pings_on_page" }, "min": 2 } },
  "child": "reviews"
}
```

Pass the hook the surface your app renders. A2UI's React renderer works with an app-owned `MessageProcessor`, so get the surface when it's created:

```tsx
"use client";

import { A2uiSurface, type ReactCatalogComponent } from "@a2ui/react/v0_9";
import { MessageProcessor, type SurfaceModel } from "@a2ui/web_core/v0_9";
import { useA2UISurface } from "@snowplow/signals-genui/a2ui";
import { useEffect, useState } from "react";
import { catalog } from "@/lib/catalog";

export function PurchaseAssist() {
  const [processor] = useState(() => new MessageProcessor<ReactCatalogComponent>([catalog]));
  const [surface, setSurface] = useState<SurfaceModel<ReactCatalogComponent> | null>(null);

  useEffect(() => {
    const created = processor.onSurfaceCreated((s) => s.id === "pdp_purchase_assist" && setSurface(s));
    return () => created.unsubscribe();
  }, [processor]);

  const { request } = useA2UISurface("pdp_purchase_assist", { spec: surface, surface });

  // Send request() with the message that asks your agent for UI, then feed its reply to the processor.

  return surface ? <A2uiSurface surface={surface} /> : null;
}
```

Send `request()` with the message that asks your agent for UI, as metadata on your transport: for example, a key in the A2A message `metadata`, next to the renderer's capabilities. In your agent, pass it to `surfaceContext()`, and add the result to the agent's instructions.

If your agent replaces the whole data model, the hook writes `/signals` back. The A2UI hook doesn't send `surface_render` events. `@a2ui/react` doesn't render on the server, so load the component with server rendering disabled, for example with `next/dynamic` and `ssr: false`.

## Your own components

If your app renders its own components from the model's output, for example from an AI SDK tool call, use `useSignalsSurface`. It builds the surface request and gives you the live values, and any event counts, to read directly:

```tsx
import { useSignalsSurface } from "@snowplow/signals-genui/react";

const { live, request } = useSignalsSurface("pdp_purchase_assist", { spec: toolResult });

// Show the comparison once the user has read the page for about 20 seconds
const showComparison = toolResult?.compare && Number(live.pings_on_page) >= 2;
```

With `useSignalsSurface`, the model gets the values and their meaning, but no instructions for writing conditions: your components decide how to react. Because the hook can't tell what your components show, it doesn't send `surface_render` events.

## Check the model's conditions

Your UI framework has its own validation for what the model writes. If your app also filters the model's output, `liveConditionCheck()` tells you whether a condition reads only live values. It returns a function that lists the paths a condition reads that aren't live values for this request:

```ts
import { liveConditionCheck } from "@snowplow/signals-genui/server";

const notLive = await liveConditionCheck(context?.signals);

if (notLive(element.visible).length > 0) {
  // Drop the element
}
```

Drop the whole element, not just its condition, so a block meant to wait never shows straight away. Most apps don't need this check.
