---
title: "Personalize generative UI with Signals GenUI"
sidebar_position: 28
sidebar_label: "Generative UI"
description: "Give the model that composes your UI the current user's behavior, let the generated UI react as the user keeps browsing, and measure what the user saw."
keywords: ["generative ui", "signals genui", "json-render", "a2ui", "personalization", "llm", "behavioral context", "react", "next.js"]
date: "2026-10-22"
---

Signals GenUI connects Snowplow behavioral data to generative UI. When a model composes part of your page, such as a block under **Add to bag** or a help panel, Signals GenUI tells it what the user is doing, so it can choose what's most likely to help. The generated UI keeps reacting as the user browses, and you can see what the model chose and what the user saw.

It works with the model, prompt, and components you already have.

:::note[Preview]
Signals GenUI is in preview. Its API can change between versions.
:::

## How it works

Each part of a page that a model composes is a *surface*. For each surface, you choose in Console which behavior matters and describe what it means, so you can change what a surface uses without a deploy.

![Signals GenUI flow: the user browses and your tracker sends events; Signals GenUI turns their behavior into context; your model composes the UI; the UI reacts live as the user keeps browsing; what the model chose and what the user saw are measured in your warehouse](../../images/genui-how-it-works.png)

The behavior the model sees can come from two places:

* The current page: what the user is doing right now, from your Snowplow tracker, such as how long they've been reading or whether they added the product to their bag
* Earlier visits: what Signals knows about the user, from [calculated attributes](/docs/signals/attributes/index.md) and [agentic contexts](/docs/signals/applications/agentic-contexts/index.md)

You can start with the current page alone, and add Signals data later without changing your code.

## What you can build

Some examples of what a surface can do:

* A product page block that starts light, then shows fit guidance once the user has read the page for about 20 seconds without adding the product to their bag
* A comparison with the products the user looked at on earlier visits, for a user who keeps coming back without deciding
* Outfit ideas built from the categories the user browses most

## Get started

Signals GenUI works in React apps, with [json-render](https://json-render.dev/), [A2UI](https://a2ui.org/), or your own components. Adding it takes a component in your layout, a surface in Console, a hook in the component that renders the generated UI, and a change to the route that prompts your model.

To try it, follow the [quickstart](/docs/signals/applications/generative-ui/quickstart/index.md). Then:

* [Configure surfaces](/docs/signals/applications/generative-ui/configure-surfaces/index.md): choose the behavior each surface uses
* [Use your UI framework](/docs/signals/applications/generative-ui/frameworks/index.md): json-render, A2UI, or your own components
* [API reference](/docs/signals/applications/generative-ui/reference/index.md): every option, function, and tracked event
