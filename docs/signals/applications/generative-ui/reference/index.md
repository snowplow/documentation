---
title: "Signals GenUI API reference"
sidebar_position: 40
sidebar_label: "API reference"
description: "Reference for the Signals GenUI SDK: the page component, the surface hooks, the surface request, server functions, tracked events, and environment variables."
keywords: ["signals genui api", "SignalsGenUI", "useJsonRenderSurface", "useA2UISurface", "useSignalsSurface", "surfaceContext", "recordDecision", "surface_render", "surface_decision"]
date: "2026-10-22"
---

The `@snowplow/signals-genui` package has one entry point per environment and per UI framework, so your app only loads what it uses:

| Entry point | Runs in | Exports |
| --- | --- | --- |
| `@snowplow/signals-genui/nextjs` | Browser | `SignalsGenUI` for Next.js |
| `@snowplow/signals-genui/react` | Browser | `SignalsGenUI`, `useSignalsSurface` |
| `@snowplow/signals-genui/json-render` | Browser | `useJsonRenderSurface` |
| `@snowplow/signals-genui/a2ui` | Browser | `useA2UISurface` |
| `@snowplow/signals-genui/server` | Server | `surfaceContext`, `recordDecision`, `signalsMiddleware`, `signalsPaths`, `liveConditionCheck` |

The server entry point reads your Signals credentials. In a browser bundle, it throws an error as soon as it's imported.

## Browser API

Render the page component once, and use a surface hook in each component that requests and renders a surface.

### SignalsGenUI

`<SignalsGenUI />` connects Signals GenUI to the browser tracker and loads your published surfaces from Signals. Render it once, anywhere on the page, for example next to `{children}` in your root layout. It renders nothing, and it reads its props once: later changes are ignored.

| Prop | Type | Description |
| --- | --- | --- |
| `signalsUrl` | `string` | Required: your Signals API URL, the same value as `SNOWPLOW_SIGNALS_BASE_URL` on your server. The page component reads the published surfaces from it. |
| `tracker` | `BrowserTracker` | Your app's Snowplow tracker. Your app keeps tracking its own page views, and keeps its own tracking configuration. |
| `appId` | `string` | With `collectorUrl`, instead of `tracker`: the app ID for a tracker that Signals GenUI creates |
| `collectorUrl` | `string` | The Collector URL for the tracker Signals GenUI creates |
| `tracking` | `object` | Optional, for the tracker Signals GenUI creates: `activity` turns on [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md), with the tracker's `minimumVisitLength` and `heartbeatDelay` settings |

A tracker that Signals GenUI creates tracks a page view when the page loads. Import `SignalsGenUI` from `@snowplow/signals-genui/nextjs` in a Next.js app using the App Router, and it also tracks a page view on every route change. In other apps with client-side routing, track later page views yourself.

### Surface hooks

Each hook takes the surface ID and options. Use one hook per surface, in the component that requests and renders it.

| Hook | Options | Sends `surface_render` |
| --- | --- | --- |
| `useJsonRenderSurface(id, options)` | All optional. Streaming apps pass nothing, and give the returned `onComplete` to `useUIStream`. Apps that don't stream pass `spec` and `complete`. Also: `store`, a json-render store to write the live values to; `statePath`, default `"/signals"`. | ✅ |
| `useA2UISurface(id, options)` | `spec`, `complete`, and `surface`: the A2UI `SurfaceModel` to write the live values to. Optional: `statePath`, default `"/signals"`. | ❌ |
| `useSignalsSurface(id, options)` | `spec` and `complete` | ❌ |

The common options are:

* `spec`: the generated UI you're rendering, or `null` if there's none yet
* `complete`: `true` once the generated UI is final. Defaults to `spec !== null`.

The hooks return:

| Property | Type | Description |
| --- | --- | --- |
| `live` | `Record<string, number \| boolean \| string \| null \| array>` | The surface's tracker field values, by name. A unique list is an array. Updates as events arrive. |
| `eventCounts` | `Record<string, number>` | With default event counts on: how many times each event happened, by event name. Otherwise `undefined`. |
| `liveState` | `object` | `useJsonRenderSurface` only. What goes at `/signals` in json-render's state: `live`, plus `eventCounts` under `event_counts`. |
| `request` | `() => SurfaceRequest` | Builds a [surface request](#surface-request) for your request body. Synchronous, never throws, and stable across renders. |
| `ready` | `boolean` | `true` once the surface's config has loaded |
| `onComplete` | `(spec) => void` | `useJsonRenderSurface` only. Pass it to json-render's `useUIStream`: `useUIStream({ api, onComplete })`. It marks the generated UI as complete when the latest stream finishes. |

## Surface request

`request()` returns the surface request: everything your server needs to build the surface's context. Send it unchanged with the request that asks your model for UI. If the surface hasn't loaded yet, it contains the user's identifiers and no values.

| Field | Type | Description |
| --- | --- | --- |
| `surface` | `string` | The surface ID |
| `selectionId` | `string` | A new ID for every request. The tracked events carry it as `selection_id`. |
| `configVersion` | `number` | The version of the surface the values were computed with. Your server uses the values only when it has the same version. |
| `identity` | `object` | The user's `domain_userid`, `domain_sessionid`, and `user_id`, when set |
| `fields` | `object` | The surface's tracker field values, by name |
| `eventCounts` | `object` | With default event counts on: the event counts, by event name |
| `renderer` | `object` | The UI framework the live values are wired into, and their path. Absent with `useSignalsSurface`. |
| `capturedAt` | `number` | When the request was built, as a Unix timestamp in milliseconds |

## Server API

The server functions take the surface request as your route received it, and check its shape themselves. None of them throws.

| Function | Returns |
| --- | --- |
| `surfaceContext(signals, { format })` | The surface's context for the system prompt, as `"text"` (default) or `"json"`. An empty string when there's nothing to add. |
| `recordDecision(signals, { spec, selector })` | A promise that resolves once a `surface_decision` event is sent: the components in `spec`, and the values the model had. `selector` is an optional label, such as the model ID. Call it after `surfaceContext()`, once the model has finished, for example in `streamText`'s `onFinish`. |
| `signalsMiddleware(signals)` | AI SDK language model middleware, for `wrapLanguageModel({ model, middleware })`. It adds `surfaceContext(signals)` as a system message after yours, and records `surface_decision` when the model has finished, with the model ID as the selector. Use it instead of calling `surfaceContext()` and `recordDecision()` yourself. |
| `signalsPaths(signals)` | The paths of the live values the generated UI may read, for example `["/signals/pings_on_page", "/signals/event_counts/page_view"]`. An empty array with `useSignalsSurface`, or when the browser's values are for another version of the surface. |
| `liveConditionCheck(signals)` | A function that takes a condition and returns the paths it reads that aren't live values. See [Check the model's conditions](/docs/signals/applications/generative-ui/frameworks/index.md#check-the-models-conditions). |

`recordDecision()` and `signalsMiddleware()` read the selected components from json-render output. For other UI frameworks, the event lists no components.

## Tracked events

Signals GenUI tracks two [self-describing events](/docs/fundamentals/events/index.md#self-describing-events): one `surface_decision` for each request, and a `surface_render` each time the generated UI renders or changes. Both carry a `surface_selection` [entity](/docs/fundamentals/entities/index.md) with the request's `selection_id`, `surface_id`, and `config_version`, so you can join what the model selected with what the user saw.

{/* TODO: switch these tables to the SchemaProperties component once the schemas are published to Iglu Central. */}

| Event | Sent from | When | Properties |
| --- | --- | --- | --- |
| `surface_decision` | Your server, through `signalsMiddleware()` or `recordDecision()` | Once the model has finished | `selected`: the components the model selected. `inputs`: the tracker values it had. `attributes`: the Signals attribute values it had. `agentic_context`: the agentic context it had. `selector`: your label. |
| `surface_render` | The browser, through your tracker | When the generated UI is complete, and each time what's visible changes | `trigger`: `complete`, `state_change`, or `default` when there's no generated UI. `renderer`: the UI framework. `rendered`: the visible components. `inputs`: the values sent with the request. `live`: the values when it rendered. |

The server sends `surface_decision` as the user identified in the surface request, so it joins the browser's events for the same user and session.

## Environment variables

Your server reads these environment variables. Keep them in your server's environment secrets, and never expose them to the browser, for example with a `NEXT_PUBLIC_` prefix.

| Variable | Value |
| --- | --- |
| `SNOWPLOW_SIGNALS_BASE_URL` | Your Signals API URL |
| `SNOWPLOW_SIGNALS_API_KEY` | Your API key |
| `SNOWPLOW_SIGNALS_API_KEY_ID` | Your API key ID |
| `SNOWPLOW_ORGANIZATION_ID` | Your organization ID |
| `SNOWPLOW_COLLECTOR_URL` | Your Collector URL, for `surface_decision` events |
| `SNOWPLOW_APP_ID` | Optional: the app ID on `surface_decision` events. Defaults to `signals-genui`. |

The first four are your [connection credentials](/docs/signals/connection/index.md#connection-credentials). Your server reads your surfaces from Signals with them, so without them it logs a warning and adds nothing to the prompt. Without `SNOWPLOW_COLLECTOR_URL`, the server logs a warning and doesn't track `surface_decision`.
