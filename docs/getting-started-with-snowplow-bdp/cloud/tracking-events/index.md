---
title: "Tracking events with BDP Cloud"
sidebar_position: 1
---

# Tracking events with BDP Cloud

:::note Limits

Please note that BDP Cloud pipelines by default have an event volume cap of 60 events per second and a total of 80m events per month.

:::

## Instrumenting the web tracker in your application

- Copy the JavaScript code snippet from the [BDP Cloud Getting Started section](https://console.snowplowanalytics.com/environments/start-tracking-events?fromDocs).
- Paste the tracking code into the page source `<head>` section of your application and deploy the changes.
- Your pipeline should now capture events from your application.

## Instrumenting the web tracker via Google Tag Manager

![google-tag-manager-setup](../../../try-snowplow/tracking-events-with-try-snowplow/images/step3-2.gif)

- Copy the JavaScript code snippet from the BDP Cloud Snowplow console.
- Navigate to the Google Tag Manager account you wish to instrument tracking to
- Create a new Custom HTML tag and paste the Javascript snippet into the tag
- Set it to fire on 'All Pages' or a trigger of your choosing
- You can preview your tag to send some events into Try Snowplow before publishing it
- Your pipeline should now capture events from your application

## Using other Snowplow trackers

You can also use the Snowplow iOS and Android mobile trackers or instrument tracking on any other supported platform. For a full list of supported trackers, check out our [Sources documentation](/docs/collecting-data/collecting-from-own-applications/index.md).

## Understanding Snowplow data

Take a look at the [full list](/docs/understanding-your-pipeline/canonical-event/index.md) of properties you can expect in your data.

## Custom events & entities

You can also create your own custom events & entities using [the Data Structures Builder](/docs/understanding-tracking-design/managing-data-structures-with-data-structures-builder/index.md). To understand more about events & entities please see [here](/docs/understanding-tracking-design/understanding-events-entities/index.md).