---
title: "Test your behavioral attributes"
position: 4
description: "Verify that your Snowplow Signals attributes are working correctly by generating behavioral events and checking attribute values."
keywords: ["testing", "attributes", "Snowplow Inspector", "behavioral events", "verification"]
date: "2025-01-21"
---

After defining your attributes, you need to verify they're working correctly, by generating behavioral events and checking that the attribute values update as expected.

Use the Snowplow Inspector browser extension to monitor both the events being sent to your Collector, and the resulting attribute values. This provides real-time visibility into how user behavior translates into attribute data.

## Viewing attribute values in real-time

Return to your [demo site](http://localhost:8086), and open the browser Developer console. Navigate to the Snowplow Inspector tab and then to the **Attributes** tab.

## Updating attributes

In your notebook, you defined a number of attributes. Test two straighforward ones now. Start by generating events:

1. Click on **Destinations** in the top navigation bar to go to the destinations page
2. Click on any destination page (`/destinations/id`)
3. Once you have landed on this page, refresh the page

Use the Snowplow Inspector to verify that:
- In the **Events** tab, you can see page view events being successfully sent to your Collector endpoint
- In the **Attributes** tab, the `page_view_count` and `dest_page_view_count` attributes have non-zero values

<!-- TODO image -->

If you are not using the Chrome extension, you can also verify this by opening the Developer console and looking at the logs. Note that the logs are outputted when the page is refreshed, so may lag behind values presented in the Inspector.

If your values are appearing as null or zero, check that your events are being successfully sent to the Collector. If you're using forwarding, check that your forwarding address is correct.
