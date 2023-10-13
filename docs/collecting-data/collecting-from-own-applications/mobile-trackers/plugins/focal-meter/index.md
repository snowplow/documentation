---
title: "Sending user identifier to Kantar Focal Meter"
date: "2023-01-04"
sidebar_position: 20
---

# Sending user identifier to Kantar Focal Meter

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The mobile trackers provide integration with [Focal Meter by Kantar](https://www.virtualmeter.co.uk/focalmeter).
Focal Meter is a box that connects directly to the broadband router and collects viewing information for the devices on your network.

This integration enables measuring the audience of content through the Focal Meter router meter.
The tracker has the ability to send the user identifier (`userId` present in the session context) to a [Kantar Focal Meter](https://www.virtualmeter.co.uk/focalmeter) endpoint.

To enable this feature, you can pass the `FocalMeterConfiguration` configuration with the URL of the Kantar endpoint.
For example:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let focalMeterConfig = FocalMeterConfiguration(kantarEndpoint: "https://thekantarendpoint.com")
let tracker = Snowplow.createTracker(namespace: namespace, network: networkConfig, configurations: [focalMeterConfig])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val focalMeterConfig = FocalMeterConfiguration("https://thekantarendpoint.com")
val tracker = Snowplow.createTracker(applicationContext, namespace, networkConfiguration, focalMeterConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
FocalMeterConfiguration focalMeterConfig = new FocalMeterConfiguration("https://thekantarendpoint.com");
Snowplow.createTracker(applicationContext, namespace, networkConfiguration, focalMeterConfig);
```

  </TabItem>
</Tabs>

Once configured, the tracker will make a request to the endpoint whenever the user identifier changes or each time the app starts.

:::note
Session context needs to be enabled (default) in order for the integration to work.
:::

:::note
The feature is available from version 5.6.0 of the iOS and Android trackers.
:::

## Processing the user ID sent in requests to Kantar

By default, the plugin sends the user ID as a GET parameter in requests to Kantar without modifying it.
In case you want to apply some transformation on the value, such as hashing, you can provide the `processUserId` callback when instantiating the plugin:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let focalMeterConfig = FocalMeterConfiguration(kantarEndpoint: "https://thekantarendpoint.com") { userId in
  return hash(userId) // apply custom hashing function
}
let tracker = Snowplow.createTracker(namespace: namespace, network: networkConfig, configurations: [focalMeterConfig])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val focalMeterConfig = FocalMeterConfiguration("https://thekantarendpoint.com") { userId ->
  hash(userId) // apply custom hashing function
}
val tracker = Snowplow.createTracker(applicationContext, namespace, networkConfiguration, focalMeterConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
FocalMeterConfiguration focalMeterConfig = new FocalMeterConfiguration(
  "https://thekantarendpoint.com",
  userId -> hash(userId) // apply custom hashing function
);
Snowplow.createTracker(applicationContext, namespace, networkConfiguration, focalMeterConfig);
```

  </TabItem>
</Tabs>
