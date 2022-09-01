---
title: "Tracking events with Try Snowplow"
date: "2020-11-23"
sidebar_position: 20
---

Event volume cap

Try Snowplow is a limited trial of the full Snowplow BDP product and has an event volume cap of 50 events per second.

## Instrumenting the web tracker in your application

- Copy the JavaScript code snippet from the Try Snowplow console.
- Paste the tracking code into the page source `<head>` section of your application and deploy the changes.
- Your pipeline should now capture events from your application.

## Instrumenting the web tracker via Google Tag Manager

![](images/step3-2.gif)

- Copy the JavaScript code snippet from the Try Snowplow console.
- Navigate to the Google Tag Manager account you wish to instrument tracking to
- Create a new Custom HTML tag and paste the Javascript snippet into the tag
- Set it to fire on 'All Pages' or a trigger of your choosing
- You can preview your tag to send some events into Try Snowplow before publishing it
- Your pipeline should now capture events from your application

## Tracking in Try Snowplow using other Snowplow trackers

The UI also has instructions for instrumenting Snowplow tracking on mobile using the native iOS and Android SDKs. However, you can use any Snowplow tracker with Try Snowplow. For a full list of supported trackers (and webhooks), check out our [Sources documentation](/docs/collecting-data/collecting-from-own-applications/index.md).

## Debugging

In the Try Snowplow UI select "Pipeline status" in the navigation to check the health of the application. As long as the first two lines are checked your pipeline is ready to receive events.

![](images/Screen-Shot-2020-10-12-at-16.41.59.png)
