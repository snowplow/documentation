---
title: "Optional: Create an intervention"
position: 7
description: "Use Snowplow Signals interventions to automatically trigger chatbot appearance based on specific user behaviors."
keywords: ["interventions", "chatbot timing", "user engagement", "behavioral triggers", "proactive assistance"]
date: "2025-01-21"
---

Use Snowplow Signals interventions to control when the chatbot appears, transforming reactive customer support into proactive assistance based on behavioral triggers.

In the previous section, you personalized chatbot responses based on user behavior. This section shows how to use interventions to automatically present the chatbot when users demonstrate specific behaviors that suggest they might benefit from help.

Instead of waiting for users to click the chat icon, you can automatically trigger the agent to appear when users exhibit certain behaviors, such as browsing extensively without taking action.

## How it works

You'll create an intervention in Signals that triggers the agent to appear when a user has viewed more than three destination pages in a single session. This demonstrates how you can use interventions to control when an agent appears based on user behavior.

When the user views their fourth destination page, the agent will automatically appear and offer assistance.

## Create the intervention

Open your Jupyter notebook and run the final cell labeled "Interventions". This creates an intervention based on the `dest_page_view_count` attribute.

## Test the intervention

The travel site automatically subscribes to interventions for the current user and session using the [Signals browser plugin](/docs/signals/receive-interventions/).

Once you've created the intervention, test it by:

1. Navigating to the travel site
2. Viewing more than three destination pages
3. When you view the fourth page, the agent should automatically expand, rather than requiring a click, and offer assistance

This proactive approach can significantly improve user experience by providing help at the right moment based on behavioral signals.
