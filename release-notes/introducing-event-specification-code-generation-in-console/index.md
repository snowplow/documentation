---
title: "Introducing event specification code generation in Console"
description: "We have introduced tracking code generation directly in the Snowplow Console for event specifications."
date: "2025-11-25"
update_type:
  - "Product news"
components:
  - "Event Studio"
  - "Console"
---
We have introduced tracking code generation directly in the Snowplow Console for event specifications. This feature allows you to quickly generate implementation-ready JavaScript tracking code from your event specs, accelerating the path from tracking design to implementation.

## What's new

The Console now includes a code generation feature for event specifications that creates JavaScript tracking code with proper structure and inline guidance. When you access an event specification in the Console, you can generate code that includes:

* Pre-configured `trackSelfDescribingEvent` calls with the correct schema references
* Template structures for your event and entity properties
* Pre-filled enum values
* Placeholder comments to guide implementation

This code generation is currently available for the JavaScript Browser Tracker and JavaScript Web Tracker.

## Key benefits

**Faster implementation**: Generate implementation-ready code directly from your event specifications without manual setup or boilerplate writing.

**Reduced errors**: The generated code includes the correct schema references, property structures, and data types defined in your event specification.

**Streamlined workflow**: Product managers and analysts can design tracking specifications, while developers can immediately access the code needed for implementation, all within the same tool.

## Getting started

To generate tracking code from an event specification:

1. Navigate to your event specification in the Snowplow Console
2. Select the code generation option
3. Choose JavaScript as your target language
4. Copy the generated code into your implementation
5. Fill in the placeholder values with your application's data

For detailed guidance on creating event specifications, see the [event specifications documentation](/docs/event-studio/implement-tracking/generate-tracking-code/).
