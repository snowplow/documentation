---
title: "Configure Signals GenUI surfaces"
sidebar_position: 20
sidebar_label: "Configure surfaces"
description: "Choose which behavior powers each generative UI surface in Console: client-side attributes computed in the browser, default event counts, and Signals attribute groups, services and agentic contexts, each with a description for the model."
keywords: ["signals genui", "surface", "client-side attributes", "event counts", "signals attributes", "services", "agentic context", "generative ui"]
date: "2026-10-22"
---

A surface declares which behavior powers one place in your app where a model composes UI, and what each value means. You create and edit surfaces in Console, so you can change them without a deploy.

## Create a surface

To create a surface, go to **Signals** > **GenUI surfaces** in Snowplow Console and select **Create surface**.

The surface editor has five sections:

![The surface editor in Console, with the surface ID, default event counts, client-side attributes, Signals inputs, and a preview of what the model sees](../../../images/genui-create-surface.png)

| Section | What you set |
| --- | --- |
| **Surface** | The **Surface ID** your app passes to the surface hook, for example `pdp_purchase_assist`. It can't change after you create the surface. |
| **Default event counts** | Whether to [count every event](#count-every-event) the tracker sends |
| **Client-side attributes** | [Values computed in the user's browser](#add-client-side-attributes), which the generated UI can react to |
| **Signals inputs** | [What Signals knows about the user](#add-signals-data), read on your server |
| **What the model sees** | A preview of the lines Signals GenUI adds to the model's system prompt. It updates as you edit. |

Select **Create** to save the surface, then **Publish** on its page. Signals GenUI only loads published surfaces: when you edit a published surface, your app keeps using the published version until you publish the change.


## Add client-side attributes

A client-side attribute is one named value that Signals GenUI computes in the browser from the [events](/docs/fundamentals/events/index.md) your tracker sends. Its settings are the same as a Signals [attribute](/docs/signals/attributes/attributes/index.md)'s. Each one is live in your UI framework's state under its name, for example `/signals/pings_on_page`, so the generated UI can react to it without a new request.

| Setting | Description |
| --- | --- |
| **Name** | The value's name, in the prompt and in your UI framework's state |
| **Events** | The events to read. With none, the attribute reads every event. |
| **Aggregation** | How the events become one value. See below. |
| **Property** | For every aggregation except a count: the property to read |
| **Scope** | **Page view** restarts the value on every page view. **Session** keeps it for the user's session. |
| **Criteria** | Optional: only events that meet conditions on their properties |
| **What it means, for the model** | The attribute's description: what the value means, for the model. Without one, the model sees only the attribute's definition. See [write descriptions for the model](#write-descriptions-for-the-model). |

Each aggregation has a starting value, so the model and your UI can tell that something hasn't happened yet:

| Aggregation | Value | Before the event happens |
| --- | --- | --- |
| Count | How many matching events | `0` |
| First | The property's value in the first matching event | `null` |
| Last | The property's value in the latest matching event | `null` |
| Unique list | The property's distinct values, in the order they first appeared | `[]` |

A property can be an atomic field the tracker sends, such as `page_urlpath` or `page_title`, a value in a self-describing event's data, or a value in one of the event's [entities](/docs/fundamentals/entities/index.md). Criteria compare a property with a value, using `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `in`, `is null`, or `is not null`.

Session-scoped values are kept in the browser's memory, so a full page reload resets them. Client-side navigation keeps them.

### Track page pings

Client-side attributes on `page_ping` events need [activity tracking](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md). If you pass your own tracker to the page component, enable activity tracking on it. If Signals GenUI creates the tracker, set the page component's `tracking` prop:

```tsx
<SignalsGenUI
  signalsUrl="https://{{123abc}}.signals.snowplowanalytics.com"
  appId="my-app"
  collectorUrl="https://collector.example.com"
  tracking={{ activity: { minimumVisitLength: 10, heartbeatDelay: 10 } }}
/>
```

### Count every event

Turn on **Default event counts** to count every event the tracker sends, by `event_name`, without adding an attribute for each one: `page_view`, `page_ping`, `event` for structured events, or a self-describing event's schema name, such as `snowplow_ecommerce_action`.

Choose the counts' scope, as for a client-side attribute: **Session**, the default, or **Page view**. To leave out events you don't want counted, such as `page_ping`, select them next to the scope. Events are counted by event name, so leaving out a name leaves out every event with it.

The counts are live in your UI framework's state under `event_counts`, for example `/signals/event_counts/page_view`. An event count is missing until its event first happens. The model gets the 30 most frequent events.

## Add Signals data

Signals data gives the model what Signals knows about the user beyond the current page. Add it under **Signals inputs**:

* **Attribute groups**: a published version of an [attribute group](/docs/signals/attributes/attribute-groups/index.md), and the [calculated attributes](/docs/signals/attributes/index.md) the model reads from it
* **Services**: a published [service](/docs/signals/applications/services/index.md), and the attributes the model reads from it
* **Agentic context**: optional, one [agentic context](/docs/signals/applications/agentic-contexts/index.md), with a description for the model. It's the user's recent activity in this session.

The model gets only the attributes you add, not the whole group or service. Give each one a description, as for a client-side attribute.

Signals GenUI reads Signals data by the identifiers the browser tracker sends, so each attribute group and service must use one of these [attribute keys](/docs/signals/attributes/attribute-keys/index.md): `domain_userid`, `domain_sessionid`, or `user_id`. A surface can use groups and services with different keys.

Your server reads this data for each request, when [`surfaceContext()`](/docs/signals/applications/generative-ui/reference/index.md#server-api) builds the surface's context, or when `signalsMiddleware` calls it for you. It reads each attribute group and service by the user's identifier for its attribute key, and the agentic context by the session ID, both from the [surface request](/docs/signals/applications/generative-ui/reference/index.md#surface-request). Then it adds the values to the system prompt, with each attribute's description. The model gets a group's or service's values as unknown when the request has no identifier for its key, for example no `user_id` for a user who hasn't logged in, or when the read fails or takes more than two seconds.

## Write descriptions for the model

A value's description is how the model learns what the value means. The model already gets a short summary of each client-side attribute's definition, such as `count of page_ping`, so use the description for what the value says about the user.

Good descriptions:

* Say what the value measures, in the user's terms: "Activity heartbeats on this page, about one per 10 seconds of active reading"
* Give the thresholds that matter: "2 means about 20 seconds engaged, 4 means the user is reading closely"
* Say what a value suggests, without dictating the UI: "Once it's 1, they have decided"

Check the result in **What the model sees**. Descriptions never pass through the browser, so the user can't change what the model is told a value means.
