---
title: "Using the Snowplow Micro user interface"
sidebar_position: 2
sidebar_label: "Using the UI"
description: "How to view, filter and investigate events in the Micro UI."
---

To view the Micro UI, head to [http://localhost:9090/micro/ui](http://localhost:9090/micro/ui) in your web browser (assuming you followed the [basic usage](/docs/testing/snowplow-micro/basic-usage/index.md) instructions).

:::tip Sharing the UI with other people

Want to share this view with a colleague? See the section on [exposing Micro to the outside world](/docs/testing/snowplow-micro/remote-usage/index.md#exposing-micro-via-a-public-domain-name). For example, if you use `ngrok`, you will get a link like `https://1328-...-4103.ngrok-free.app/micro/ui` which you can send to anyone for them to look at the same events.

:::

Here’s an overview of the functionality:

```mdx-code-block
import TrackedReactFilePlayer from '@site/src/components/TrackedReactFilePlayer'
import videoUrl from '../images/ui-tour.mp4'
```

<TrackedReactFilePlayer label="Micro UI" controls url={videoUrl} width='100%' height='100%' />
