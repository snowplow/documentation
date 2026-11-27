---
title: "Show Signals experiment variants on your website"
sidebar_position: 10
sidebar_label: "Quickstart"
description: "Add Signals experiments to a website with the Signals browser plugin: load the user's assignment, show their variant, and track the exposure."
keywords: ["signals experiments", "a/b testing", "experiment variant", "browser plugin", "getExperimentVariant", "useExperimentVariant", "react"]
date: "2026-11-27"
content_type: how-to
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::note[Preview]
Signals experiments are in preview. The browser plugin's experiments API can change between versions.
:::

A Signals experiment is an A/B test that a user enters when a Signals attribute condition becomes true for them, for example when their basket goes idle, or on their third visit to the pricing page. Each user who enters gets one variant, and keeps it for as long as the experiment runs.

Your website asks the Signals browser plugin which variant the current user has, and shows it. When you read the variant, the plugin tracks an exposure event, and the experiment's results count each user from their first exposure.

This guide uses an experiment named `free_shipping_banner`, with two variants: `control`, which shows the usual header, and `banner`, which shows a free shipping banner.

## Before you begin

You'll need:

* A running experiment in Signals, and its name. The name your code passes must match it exactly.
* The Snowplow [browser tracker](/docs/sources/web-trackers/index.md), installed from npm
* Your Signals API URL, from the **Signals** > **Overview** page in Console

## Add experiments to your website

<Steps>

### Install the plugin

Install the [Signals browser plugin](https://www.npmjs.com/package/@snowplow/signals-browser-plugin):

```bash
npm install @snowplow/signals-browser-plugin
```

### Load the user's assignment

Add `SignalsPlugin()` to your tracker, then call `loadExperiments()` with your Signals API URL. Call it once on every page that shows an experiment, as early as you can, for example right after you create the tracker:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SignalsPlugin, loadExperiments } from '@snowplow/signals-browser-plugin';

newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app',
  plugins: [SignalsPlugin()],
});

loadExperiments({ endpoint: '000000000000.signals.snowplowanalytics.com' });
```

The plugin requests nothing until you call `loadExperiments()`.

### Show the variant

Read the variant where you show it:

<Tabs groupId="experiments-framework" queryString>
<TabItem value="javascript" label="JavaScript" default>

`getExperimentVariant()` returns the user's variant key, or `null` when the user isn't in the experiment. Render once, then again from `onExperimentsChange()`, which runs when the assignment loads or the user enters the experiment while on the page:

```javascript
import { getExperimentVariant, onExperimentsChange } from '@snowplow/signals-browser-plugin';

function renderHeader() {
  if (getExperimentVariant('free_shipping_banner') === 'banner') {
    showFreeShippingBanner();
  } else {
    showDefaultHeader(); // control, not in the experiment, or still loading
  }
}

renderHeader();
onExperimentsChange(renderHeader);
```

</TabItem>
<TabItem value="react" label="React">

`useExperimentVariant()` returns the variant, and whether the plugin is still waiting for an answer. It needs React 18 or later. Create the tracker and call `loadExperiments()` outside your components, as shown in [Load the user's assignment](#load-the-users-assignment).

```jsx
import { useExperimentVariant } from '@snowplow/signals-browser-plugin/react';

function Header() {
  const { variant, loading } = useExperimentVariant('free_shipping_banner');

  if (loading) return <HeaderPlaceholder />;
  return variant === 'banner' ? <FreeShippingBanner /> : <DefaultHeader />;
}
```

The hook re-renders the component when the assignment loads, or when the user enters the experiment while on the page.

</TabItem>
</Tabs>

Reading the variant tracks an exposure, once per page view, so it's safe to call on every render. Read it only where the variant is shown, and in the same way for every variant, including `control`. Reading it earlier, or only for some variants, skews the results.

### Check that it works

Make the experiment's entry condition true for yourself, for example by viewing the pricing page three times, then go to the page that shows the experiment. You should see your variant.

In [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md), look for an `experiment_exposure` event with the experiment name and your variant.

</Steps>

## Troubleshooting

The plugin logs these messages to the browser console:

| Message | Fix |
| --- | --- |
| `loadExperiments: no tracker has activated SignalsPlugin` | Add `SignalsPlugin()` to the tracker, and create the tracker before you call `loadExperiments()` |
| `No domain_userid (anonymous tracking?); no experiments to load` | The tracker is in [anonymous tracking](/docs/sources/web-trackers/anonymous-tracking/index.md) mode. Users without a `domain_userid` never enter experiments. |
| `Failed to load experiments` | Check that `endpoint` is your Signals API URL |

If `getExperimentVariant()` always returns `null` and there's no message, check that:

* The name you pass matches the experiment's name in Signals exactly, including case
* The experiment is running
* The entry condition became true for you while the experiment was running. A user enters when the condition changes from false to true, so if it was already true when the experiment started, you won't enter until it becomes true again.

To handle the loading state, users who enter while on the page, and other details, see [Use experiment variants in your app](/docs/signals/applications/experiments/usage/index.md). Every function and option is in the [API reference](/docs/signals/applications/experiments/reference/index.md).

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
