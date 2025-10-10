---
title: Personalizing when an agent appears using Interventions (Optional)
position: 7
---

In the previous section we used Signals to personalize the responses an agent gave to a user based on their behavior on the site. In this optional section we will look at how we can use [Interventions](https://docs.snowplow.io/docs/signals/concepts/#interventions) to control when an agent appears to the user based on their behavior.

Previously the a user would have to click on the chat icon to start a conversation with the agent. Using Interventions we can automatically trigger the agent to appear when a user has exhibited certain behaviors on the site and predict what the user may need assistance with at the right time.

## How it will work

We will create a new Intervention in Signals that will trigger the agent to appear when a user has viewed more than 3 destination pages in a single session. This is a simplistic example but it demonstrates how we can use Interventions to control when an agent appears based on user behavior.

When the user views their 4th destination page the agent will automatically appear and offer assistance.

## Creating the intervention

To create the intervention open up the Jupyter notebook and run the final cell (Interventions) which will create an intervention based on the dest_page_view_count attribute.

## Testing the intervention

The travel site automatically subscribes to any interventions for the current user and session by using the [Signals Browser Plugin](https://github.com/snowplow-incubator/signals-browser-plugin/) which is one method of subscribing to interventions that are pushed from the Signals API to the client.

Once the intervention is created, you can test it by navigating to the travel site and viewing more than 3 destination pages. When you view the 4th page, the agent should automatically expand (rather than requiring a click) and offer assistance to you.
