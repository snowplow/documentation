---
position: 3
title: "Examine your Android screen view events with Snowplow Micro"
sidebar_label: "Examine the events"
---

After implementing tracking, you'll want to verify and analyze the events being sent. You can use a Snowplow Micro pipeline for testing and development. Here's how to examine the events:

1. Set up a Snowplow Micro pipeline and configure your tracker to send events to its endpoint, by updating the string in the `Analytics` object.
2. Run the app and move between screens.
3. Access the Micro pipeline's UI at `localhost:9090/micro/ui` to view incoming events.
4. Each event will contain several context entities by default, providing data about the:
    - Session
    - App
    - Device
    - Current screen view
    - Whether the app was visible when the event was tracked (foreground or background)
5. For screen view events, you'll see:
    - Screen name
    - Previous screen name
    - Screen view ID
    - Previous screen view ID
6. The tracker also automatically generates screen end events, which include a screen summary entity with engagement data:
    - Time spent on the screen
    - Foreground vs background time

For more detailed information about all available Android events and their structures, refer to the comprehensive documentation provided by Snowplow Analytics.

This concludes the basic tutorial for getting started with Snowplow Analytics' Android tracker. In future tutorials, we'll explore how to track custom events and utilize more advanced features of the tracker.
