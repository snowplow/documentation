---
title: "Signals experiments browser API reference"
sidebar_position: 30
sidebar_label: "API reference"
description: "Reference for the Signals experiments functions in the Signals browser plugin: loadExperiments, getExperimentVariant, isLoadingExperiments, onExperimentsChange, the useExperimentVariant React hook, and the experiment_exposure event."
keywords: ["signals experiments api", "loadExperiments", "getExperimentVariant", "isLoadingExperiments", "onExperimentsChange", "useExperimentVariant", "experiment_exposure"]
date: "2026-11-27"
content_type: reference
---

:::note[Preview]
Signals experiments are in preview. The browser plugin's experiments API can change between versions.
:::

{/* TODO: add the minimum plugin version, with <AppliesTo>, once the release with experiments is published. */}

The experiments functions are exported from `@snowplow/signals-browser-plugin`, and the React hook from `@snowplow/signals-browser-plugin/react`. To set them up, follow the [quickstart](/docs/signals/applications/experiments/index.md).

## Functions

Call `loadExperiments()` once per page, then read variants with `getExperimentVariant()` or the React hook.

| Function | Returns |
| --- | --- |
| `loadExperiments(options)` | A promise that resolves once the user's assignment has loaded, failed, or taken longer than `timeoutMs`. It never rejects. An assignment that arrives after `timeoutMs` still applies, and `onExperimentsChange()` listeners run. Calling it again with the same options doesn't load again, unless the previous load failed or the user's `domain_userid` has changed. |
| `getExperimentVariant(name)` | The variant key the user has in the experiment called `name`, or `null` when they aren't in it, or while `isLoadingExperiments()` is `true`. When it returns a variant, it tracks an `experiment_exposure` event, once per page view. `name` must match the experiment's name in Signals exactly. |
| `isLoadingExperiments()` | `true` while the plugin is waiting for the user's assignment and has no earlier one to answer with. Never `true` for longer than `timeoutMs`. |
| `onExperimentsChange(listener)` | A function that removes the listener. `listener` runs with no arguments when the user's assignment or `isLoadingExperiments()` changes: when the assignment loads, when the wait times out, or when the user enters an experiment while on the page. |

### Options for loadExperiments

<ParamTable>
  <Param name="endpoint" type="string" required>
    Your Signals API URL, from the **Signals** > **Overview** page in Console.
  </Param>
  <Param name="timeoutMs" type="number" required={false} default={1500}>
    How long to wait for the user's assignment, in milliseconds.
  </Param>
  <Param name="tracker" type="string" required={false}>
    The name of the tracker to use, as passed to `newTracker()`. Defaults to the first tracker with `SignalsPlugin()`.
  </Param>
</ParamTable>

## React hook

`useExperimentVariant(name)` returns the experiment's state for the current user, and re-renders the component when it changes. It needs React 18 or later.

| Property | Type | Description |
| --- | --- | --- |
| `variant` | `string \| null` | The value of `getExperimentVariant(name)` |
| `loading` | `boolean` | The value of `isLoadingExperiments()` |

On the server, the hook returns `{ variant: null, loading: true }`. It only works with the plugin installed from npm, not with a plugin loaded from the CDN with `sp.js`.

## Tracked event

`getExperimentVariant()` and `useExperimentVariant()` track an `experiment_exposure` [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) the first time they return a variant on each page view. They track it with the tracker that loaded the experiments.

{/* TODO: switch this table to the SchemaProperties component once the schema is published to Iglu Central. */}

| Property | Description |
| --- | --- |
| `experiment_id` | The experiment's ID in Signals |
| `experiment` | The experiment's name, as passed to `getExperimentVariant()` |
| `variant` | The variant key the user saw |
| `entered_at` | When the user entered the experiment |

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
