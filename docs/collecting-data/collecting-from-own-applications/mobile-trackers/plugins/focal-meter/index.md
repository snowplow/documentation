---
title: "Sending user identifier to Kantar FocalMeter"
date: "2023-01-04"
sidebar_position: 20
---

# Sending user identifier to Kantar FocalMeter

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The tracker has the ability to send the user identifier (`userId` present in the session context) to a [Kantar FocalMeter](https://www.virtualmeter.co.uk/focalmeter) endpoint.
This integration enables measuring the audience of content through the FocalMeter router meter.

To enable this feature, you can pass the `FocalMeterConfiguration` configuration with the URL of the Kantar endpoint.
For example:

```swift
let focalMeterConfig = FocalMeterConfiguration(kantarEndpoint: "https://thekantarendpoint.com")
let tracker = Snowplow.createTracker(namespace: namespace, network: networkConfig, configurations: [focalMeterConfig])
```

Once configured, the tracker will make a request to the endpoint whenever the user identifier changes or each time the app starts.

:::note
Session context needs to be enabled (default) in order for the integration to work.
:::
