---
title: "Getting started with the Roku tracker"
sidebar_label: "Getting started"
date: "2021-11-16"
sidebar_position: 1000
description: "Install the Roku tracker using ropm or manual installation, initialize tracking, and track structured events in your BrightScript app."
keywords: ["roku tracker setup", "ropm installation", "brightscript initialization"]
---

Designing how and what to track in your app is an important decision. Check out our docs about tracking design [here](/docs/event-studio/index.md).

The following steps will guide you through setting up the Roku tracker in your project and tracking a simple event.

## Installation

There are two options to install the Roku tracker package to your project:

1. using Roku package manager (ropm),
2. by manually copying package files.

### Using Roku Package Manager (ropm)

[ropm](https://github.com/rokucommunity/ropm) is a package manager for the Roku platform. If you are using ropm in your project, you may install the Roku tracker using the following command:

```bash
ropm install snowplow@npm:@snowplow/roku-tracker
```

### Manual Installation

The Roku tracker may be installed by simply copying source files to your Roku project. You may download and unpack the `dist.zip` or `dist.tar.gz` package from the latest release build on Github. Copy the following folders and files to your Roku project:

1. Contents of `dist/source` into your `source` directory
2. Contents of `dist/components` into your `components` directory

## Implementation

It is recommended that you instantiate Snowplow and add it to the global scope. In this way, it will be accessible from anywhere within your SceneGraph application. You may create the instance in the `init` function of your main scene.

If you installed the package using ropm, mount the component as follows:

```brightscript
m.global.AddField("snowplow", "node", false)
m.global.snowplow = CreateObject("roSGNode", "snowplow_Snowplow")
```

If you installed the package manually, mount the component as follows:

```brightscript
m.global.AddField("snowplow", "node", false)
m.global.snowplow = CreateObject("roSGNode", "Snowplow")
```

## Initialization

Trackers are initialized by setting the `init` property with configuration of the tracker. This configuration takes the form of a `roAssociativeArray`. At its most basic, the configuration takes a Snowplow collector endpoint like so:

```brightscript
m.global.snowplow.init = {
    network: {
        collector: "http://..."
    }
}
```

To learn more about configuring how events are sent, check out [this page](/docs/sources/roku-tracker/configuration/index.md).

## Tracking events

To track an event, simply assign its properties as a `roAssociativeArray` to a field corresponding to the event type. For instance, to track a structured event, assign the `structured` property:

```brightscript
m.global.snowplow.structured = {
    se_ca: "category",
    se_ac: "action",
    se_la: "label",
    se_pr: "property",
    se_va: 10
}
```

Visit documentation about [tracking events](/docs/sources/roku-tracker/tracking-events/index.md) to learn about other supported event types. You may also want to read about [adding more data to tracked events](/docs/sources/roku-tracker/adding-data/index.md).

## Testing

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-tracking-with-micro/_index.md"

<TestingWithMicro/>
```

Check out the [example Roku channel](/docs/sources/roku-tracker/example-app/index.md) to see the tracker used with Snowplow Micro.
