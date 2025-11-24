---
title: "Tracking consent and GDPR with the native mobile trackers"
sidebar_label: "Consent"
sidebar_position: 61
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

You can add an [entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/gdpr/jsonschema/1-0-0) detailing the GDPR basis for processing to every event tracked. To configure this, provide a `GdprConfiguration` object when setting up a new tracker.

The only required argument is the `Basis` enum, which contains the six GDPR options. A document describing the legal basis for processing can also be provided (as a string), along with the document version and ID.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let gdprConfig = GDPRConfiguration(
  basis: .consent, // basis for processing
  documentId: "id", // document ID
  documentVersion: "1.0", // document version
  documentDescription: "Legal justification" // document
)

let networkConfig = NetworkConfiguration(
  endpoint: "https://collector-url.com",
  method: .post
)

Snowplow.createTracker(
  namespace: "namespace",
  network: networkConfig,
  configurations: [gdprConfig]
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val gdprConfiguration = GdprConfiguration(
    Basis.CONSENT, // basis for processing
    "someId", // document ID
    "0.1.0", // document version
    "Legal justification" // document
)

val networkConfiguration = NetworkConfiguration("https://collector-url.com")

createTracker(
    applicationContext,
    "namespace",
    networkConfiguration,
    gdprConfiguration
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
GdprConfiguration gdprConfiguration = new GdprConfiguration(
        Basis.CONSENT, // basis for processing
        "someId", // document ID
        "0.1.0", // document version
        "Legal justification" // document
);

NetworkConfiguration networkConfiguration = new NetworkConfiguration("https://collector-url.com");

Snowplow.createTracker(
        getApplicationContext(),
        "namespace",
        networkConfiguration,
        gdprConfiguration
);
```

  </TabItem>
</Tabs>
