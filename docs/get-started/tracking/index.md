---
title: "Track your first events"
sidebar_position: 5
sidebar_label: "Track your first events"
description: "Add the Snowplow web tracker to your site, track page views, and check that the events reach your pipeline."
keywords: ["event tracking", "trackers", "JavaScript tracker", "web tracking", "mobile tracking"]
content_type: tutorial
---

```mdx-code-block
import AiAssistantInstall from '@site/docs/reusable/ai-assistant-install/_index.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import EventComponent from '@site/src/components/FirstSteps';
import { sampleTrackingCode } from '@site/src/components/FirstSteps/sampleTrackingCode';
```

Once your pipeline is set up, add a tracker to your application to send [events](/docs/fundamentals/events/index.md) to it. This page sets up the web tracker on a website and tracks page views.

Choose your platform:

* Web: follow this page
* iOS and Android: [set up the native mobile trackers](/docs/sources/mobile-trackers/installation-and-set-up/index.md)
* Python: [set up the Python tracker](/docs/sources/python-tracker/setup/index.md)
* Node.js and other server trackers: [compare the trackers](/docs/sources/index.md#compare-trackers)

:::tip[Add the tracker with your AI assistant]
If you use Snowplow CDI, you can ask your coding agent to add the tracker instead of copying the snippet by hand. Connected to the Snowplow MCP server, it reads your pipeline details, adds the tracker to your application, and checks that the events arrive. For example: "Add the Snowplow JavaScript tracker to this app, track page views, and confirm the events reach my pipeline."

<AiAssistantInstall />
:::

## Get your Collector URL

The tracker sends events to your Collector URL.

<Tabs groupId="offering" queryString>
  <TabItem value="pmc" label="CDI Private Managed Cloud" default>

You can find the Collector URL (Collector endpoint) in [Console](https://console.snowplowanalytics.com/environments).

  </TabItem>
  <TabItem value="cloud" label="CDI Cloud">

You can find the Collector URL (Collector endpoint) in [Console](https://console.snowplowanalytics.com/environments).

  </TabItem>
  <TabItem value="self-hosted" label="Snowplow Self-Hosted">

Use the Collector URL you chose when deploying your Snowplow Self-Hosted pipeline.

If you have not yet configured an SSL certificate and a custom domain name for your Collector, you can use `http://<collector_dns_name>` (`http`, not `https`), where `collector_dns_name` is the output of the pipeline Terraform module.

  </TabItem>
</Tabs>

## Install the tracker

Install the tracker from npm if your site is built with a framework such as React, Angular, or Vue. Otherwise, add the JavaScript tag to your pages.

<Tabs groupId="platform" queryString>
  <TabItem value="browser" label="Browser (npm)" default>

Install the `@snowplow/browser-tracker` package with your package manager:

```bash
npm install @snowplow/browser-tracker
```

Then import it, and create a tracker by calling `newTracker` with your Collector URL. This creates a module-level instance of the tracker, so you don't need to keep a reference to it.

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';

newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [],
});
```

  </TabItem>
  <TabItem value="js" label="JavaScript (tag)">

Get a tag snippet for your deployment:

<Tabs groupId="offering" queryString>
  <TabItem value="pmc" label="CDI Private Managed Cloud" default>

Go to the [tag generator](https://console.snowplowanalytics.com/tag-generator) screen in Console, fill in the necessary parameters, and copy the snippet at the bottom.

  </TabItem>
  <TabItem value="cloud" label="CDI Cloud">

You can find the pre-generated snippet in the [Getting started](https://console.snowplowanalytics.com/) section of Console.

  </TabItem>
  <TabItem value="self-hosted" label="Snowplow Self-Hosted">

Follow the JavaScript tracker [quick start guide](/docs/sources/web-trackers/quick-start-guide/index.md) to create your snippet.

  </TabItem>
</Tabs>

The snippet loads the tracker and creates an instance with your Collector URL:

```javascript
window.snowplow('newTracker', 'sp1', '{{collector_url}}', {
  appId: 'my-app-id'
})
```

There are two common ways to deploy the snippet:

* If you have access to the source code of your site, paste the snippet into the `<head>` HTML section and deploy the changes.
* If you use Google Tag Manager, create a Custom HTML tag, paste the snippet into it, and set it to fire on **All Pages** or a trigger of your choosing. You can preview the tag to send some events before publishing it.

![Animated walkthrough of adding the Snowplow JavaScript snippet as a Custom HTML tag in Google Tag Manager, setting it to fire on All Pages, and previewing the tag](images/gtm.gif)

  </TabItem>
</Tabs>

:::tip[Strong user and session cookies and ad-blocker mitigation]

To make sure that your tracking is well configured for strong first-party cookies and resilient against the impact of ad-blockers, see [cookies and ad-blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).

:::

## Track page views

Creating the tracker doesn't send any events. Call `trackPageView` to track a page view:

<Tabs groupId="platform" queryString>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
trackPageView();
```

  </TabItem>
  <TabItem value="js" label="JavaScript (tag)">

```javascript
window.snowplow('trackPageView');
```

  </TabItem>
</Tabs>

In a single-page application, call `trackPageView` again each time the route changes. See [page views](/docs/sources/web-trackers/tracking-events/page-views/index.md) for the options.

## Check your events

Install [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) in your browser, open your site, and check that a page view event is sent to your Collector.

:::tip[Latency]

It might take a few minutes for events to reach your destination, such as a data warehouse. This depends on which [destination and loader](/docs/destinations/warehouses-lakes/index.md) you have configured.

:::

For other platforms, see the [mobile native trackers](/docs/sources/mobile-trackers/index.md) or the [full list of trackers](/docs/sources/index.md). To send test events from the command line in the [tracker protocol](/docs/events/index.md) format, use [Snowplow CLI](/docs/api-reference/snowplow-cli/send-events/index.md).

<details>
<summary>Send a quick test from this page</summary>

To test your pipeline before you add a tracker, use the box below to send some data, including [failed events](/docs/fundamentals/failed-events/index.md), to your Collector.

To use this tool, you need a Collector URL that starts with `https://`, not `http://`, because web browsers block traffic from HTTPS sites, such as this one, to non-HTTPS resources.

This tool uses the following tracking code:

<CodeBlock language="javascript">{sampleTrackingCode}</CodeBlock>

<EventComponent />

An application ID is sent with each event. Pick a value that makes it easy to filter out these test events from your data later, for example `WHERE app_id != 'test'`.

</details>
