---
title: "Use Signals experiment variants in your app"
sidebar_position: 20
sidebar_label: "Use variants in your app"
description: "Handle the loading state, show a variant to users who enter an experiment while on the page, render with React on the server, and keep Signals experiment results accurate."
keywords: ["signals experiments", "a/b testing", "onExperimentsChange", "isLoadingExperiments", "useExperimentVariant", "server-side rendering", "exposure"]
date: "2026-11-27"
content_type: how-to
---

:::note[Preview]
Signals experiments are in preview. The browser plugin's experiments API can change between versions.
:::

Once your website [shows a variant](/docs/signals/applications/experiments/index.md), decide what users see while their assignment loads, and what happens when they enter an experiment while already on the page. The examples on this page use the `free_shipping_banner` experiment from the quickstart.

## Avoid switching variants on load

`loadExperiments()` returns a promise that resolves once the assignment has loaded, or after `timeoutMs`, 1500 ms by default. It never rejects. Await it before your first render if you'd rather wait than show the default and then switch:

```javascript
await loadExperiments({ endpoint: '000000000000.signals.snowplowanalytics.com' });

renderHeader();
```

If you don't wait, `isLoadingExperiments()` tells you whether the plugin has an answer yet. While it's `true`, `getExperimentVariant()` returns `null` because the plugin doesn't know the variant yet, not because the user isn't in the experiment. Show a placeholder instead of the default:

```javascript
import { getExperimentVariant, isLoadingExperiments } from '@snowplow/signals-browser-plugin';

function renderHeader() {
  if (isLoadingExperiments()) {
    showHeaderPlaceholder();
  } else if (getExperimentVariant('free_shipping_banner') === 'banner') {
    showFreeShippingBanner();
  } else {
    showDefaultHeader();
  }
}
```

To replace the placeholder once the answer arrives, run `renderHeader()` again from an [`onExperimentsChange()`](#show-the-variant-to-users-who-enter-mid-page) listener. In React, the hook's `loading` value is the same flag, and the hook re-renders for you.

Users who are already in an experiment get their variant on the first render of every later page, so `isLoadingExperiments()` is `false` for them from the start. For other users, it's `true` until the load answers, and never for longer than `timeoutMs`.

## Show the variant to users who enter mid-page

A user can enter an experiment while they're on the page, when the entry condition becomes true. To show them their variant without a reload, register a listener with `onExperimentsChange()`, and read the variant again inside it, as in the [quickstart](/docs/signals/applications/experiments/index.md#show-the-variant). Without a listener, the user sees their variant from their next page load.

The listener runs when the assignment loads, when the wait times out, and when the user enters an experiment. `onExperimentsChange()` returns a function that removes the listener. Call it when the part of the page that shows the experiment goes away:

```javascript
const unsubscribe = onExperimentsChange(renderHeader);

// Later, when the header is removed
unsubscribe();
```

`useExperimentVariant()` does this for you, so React components re-render on their own.

## Render React components on the server

`useExperimentVariant()` works with server rendering. On the server, it returns `{ variant: null, loading: true }`, so the server renders your loading placeholder, the page hydrates without a mismatch, and the component then renders the variant in the browser.

The hook only works with the plugin installed from npm. A plugin loaded from the CDN with `sp.js` keeps its own state, which the hook can't read.

## Keep results accurate

How you track events affects who enters an experiment and how their results are counted:

* Users are identified by the tracker's `domain_userid`. Track your goal events with the same tracker and cookie domain as the one that loads experiments, so that Signals can match them to the user's variant.
* Users tracked [anonymously](/docs/sources/web-trackers/anonymous-tracking/index.md) have no `domain_userid`, so they never enter experiments, and `getExperimentVariant()` returns `null` for them
* A user is in at most one experiment at a time
* Stopping an experiment takes effect on the user's next page load. Pages that are already open keep showing the variant.

Reading the variant is what counts as an exposure. In React, the hook tracks the exposure while rendering, so if React discards a render, for example in a transition or while suspended, the exposure is still tracked.

For every function and option, see the [API reference](/docs/signals/applications/experiments/reference/index.md).

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
