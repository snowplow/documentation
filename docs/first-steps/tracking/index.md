---
title: "Tracking your first events"
sidebar_position: 3
sidebar_label: "Tracking events"
description: "Tracking your first Snowplow events"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import EventComponent from '@site/src/components/FirstSteps';
import { sampleTrackingCode } from '@site/src/components/FirstSteps/sampleTrackingCode';
```

Once your pipeline is set up, you will want to send some events to it. Here’s an overview of the different options.

:::note Limits

Keep in mind that some of our offerings have limits on the number of events you can send:
* For Try Snowplow, there is cap of 50 events per second. Any events above this cap will be dropped
* For Open Source, the default setup is sized for around 100 events per second

:::

:::tip Latency

Regardless of how you send the events, it might take a few minutes for them to reach your destination (e.g. data warehouse). This depends on which [destination and loader](/docs/storing-querying/storage-options/index.md) you have configured.

:::

## A quick test

If you are eager to look at some Snowplow events or just test your pipeline, you can use the box below to send some data (including [failed events](/docs/understanding-your-pipeline/failed-events/index.md)) to your Collector.

<Tabs groupId="offering" queryString>
  <TabItem value="enterprise" label="BDP Enterprise" default>

You can find the Collector URL (Collector Endpoint) in the [Console](https://console.snowplowanalytics.com/environments).

  </TabItem>
  <TabItem value="cloud" label="BDP Cloud">

You can find the Collector URL (Collector Endpoint) in the [Console](https://console.snowplowanalytics.com/environments).

  </TabItem>
  <TabItem value="try" label="Try Snowplow">

You can find the Collector URL (Collector Endpoint) in the [Console](https://try.snowplowanalytics.com/).

  </TabItem>
  <TabItem value="opensource" label="Open Source">

Input the Collector URL you’ve chosen when deploying your Open Source pipeline.

If you have not yet configured an SSL certificate and a custom domain name for your Collector, you can use `http://<collector_dns_name>` (`http`, not `https`), where `collector_dns_name` is the output of the pipeline Terraform module.

  </TabItem>
</Tabs>

<details>
<summary>Which events are sent?</summary>
We use the following tracking code:
<CodeBlock language="javascript">{sampleTrackingCode}</CodeBlock>
</details>

<EventComponent />

:::tip Application ID

An application ID is sent along with each Snowplow event. You can pick a value that will make it easy to filter out these test events from your data later, e.g. like this:

```sql
...
WHERE app_id != 'test'
...
```

:::

Now, let’s take a look at how to set up actual event tracking.

## Using the JavaScript tracker

The [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/quick-start-guide/index.md) is our most commonly used tracker. It’s a good choice for websites, and the installation process is similar to other tools like Google Analytics.

To use the JavaScript tracker on your site, you will need to obtain a code snippet first.

<Tabs groupId="offering" queryString>
  <TabItem value="enterprise" label="BDP Enterprise" default>

BDP Enterprise can automatically generate the snippet for you. Go to the [tag generator](https://console.snowplowanalytics.com/tag-generator) screen, fill in the necessary parameters, and copy the snippet at the bottom.

  </TabItem>
  <TabItem value="cloud" label="BDP Cloud">

You can find the pre-generated snippet in the [Getting started](https://console.snowplowanalytics.com/environments/start-tracking-events?fromDocs) section.

  </TabItem>
  <TabItem value="try" label="Try Snowplow">

You can find the pre-generated snippet in the [Console](https://try.snowplowanalytics.com/).

  </TabItem>
  <TabItem value="opensource" label="Open Source">

Take note of the Collector URL you’ve chosen when deploying your Open Source pipeline.

If you have not yet configured an SSL certificate and a custom domain name for your Collector, you can use `http://<collector_dns_name>` (`http`, not `https`), where `collector_dns_name` is the output of the pipeline Terraform module.

Then, follow the JavaScript tracker [quick start guide](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/quick-start-guide/index.md) to create your snippet.
  
  </TabItem>
</Tabs>

Once you have the snippet, there are two common ways to deploy it.

<Tabs groupId="snippet-deployment" queryString>
  <TabItem value="direct" label="Editing your website directly" default>

If you have access to the source code of your site, paste the snippet into the `<head>` HTML section and deploy the changes.

  </TabItem>
  <TabItem value="gtm" label="Using Google Tag Manager">

If you are already using Google Tag Manager to add various code snippets to your site, you can add your Snowplow snippet there.

![google-tag-manager-setup](images/gtm.gif)

- Navigate to the Google Tag Manager account you wish to add tracking to
- Create a new Custom HTML tag and paste the Javascript snippet into the tag
- Set it to fire on 'All Pages' or a trigger of your choosing
- You can preview your tag to send some events before publishing it


  </TabItem>
</Tabs>

The JavaScript tracker captures many events (e.g. page views) automatically, so you should start accumulating your first events as soon as the changes are rolled out to your users.

## Using other trackers

We have many different trackers in different programming languages, in case the JavaScript tracker is not a fit for you. For example, see the [mobile native trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md) or the [full list](/docs/collecting-data/collecting-from-own-applications/index.md) of what’s available.

:::tip

For quick testing, you might be tempted to send data to your Collector URL using a basic command-line tool like `cURL`. However, you would need to ensure that the data format follows our [tracker protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md). Instead, take a look at the [command-line tracker](/docs/collecting-data/collecting-from-own-applications/snowplow-tracking-cli/index.md) that will do this for you.

:::
