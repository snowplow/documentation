---
title: "Control chatbot timing with interventions (Optional)"
position: 7
description: "Use Snowplow Signals interventions to automatically trigger chatbot appearance based on specific user behaviors and engagement patterns."
keywords: ["interventions", "chatbot timing", "user engagement", "behavioral triggers", "proactive assistance"]
date: "2025-01-21"
---

Proactive customer assistance often proves more effective than waiting for users to request help. Snowplow Signals interventions enable you to automatically trigger specific actions when users exhibit particular behavioral patterns, creating timely and contextual interactions.

In the previous section, you personalized chatbot responses based on user behavior. This section explores how to use interventions to control when the chatbot appears, transforming reactive customer support into proactive assistance based on behavioral triggers.

Traditionally, users must actively engage with a chat interface to receive assistance. With interventions, you can automatically present the chatbot when users demonstrate specific behaviors that suggest they might benefit from help, such as browsing extensively without taking action or showing signs of decision fatigue.

## How it will work

We will create a new Intervention in Signals that will trigger the agent to appear when a user has viewed more than 3 destination pages in a single session. This is a simplistic example but it demonstrates how we can use Interventions to control when an agent appears based on user behavior.

When the user views their 4th destination page the agent will automatically appear and offer assistance.

## Creating the intervention

To create the intervention open up the Jupyter notebook and run the final cell (Interventions) which will create an intervention based on the dest_page_view_count attribute.

## Testing the intervention

The travel site automatically subscribes to any interventions for the current user and session by using the [Signals Browser Plugin](https://github.com/snowplow-incubator/signals-browser-plugin/) which is one method of subscribing to interventions that are pushed from the Signals API to the client.

Once the intervention is created, you can test it by navigating to the travel site and viewing more than 3 destination pages. When you view the 4th page, the agent should automatically expand (rather than requiring a click) and offer assistance to you.
