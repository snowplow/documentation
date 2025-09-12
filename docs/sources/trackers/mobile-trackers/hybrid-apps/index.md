---
title: "Hybrid mobile and web apps"
description: "Implement mobile trackers in hybrid applications for unified behavioral analytics across platforms."
schema: "TechArticle"
keywords: ["Hybrid Mobile", "Mobile WebView", "Cross Platform", "Hybrid Analytics", "WebView Integration", "Mobile Hybrid"]
date: "2022-08-30"
sidebar_position: 70
---

# Hybrid mobile and web apps

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

This feature is available since v4. To use the Web plugin, you will need v6.1+ of the iOS or Android tracker.

:::

Hybrid apps are mobile apps that in addition to a native interface, provide part of the UI through an embedded WebView. Snowplow events are tracked from both the native code (e.g., written in Swift or Kotlin) as well as the WebView (in JavaScript). Our goal is to have both events tracked from the native code as well as the WebView share the same session and appear as tracked with the same tracker.

## Event forwarding

We recommend using the Web tracker (v4.3+) to forward all Web events to the mobile tracker.

1. Implement the Snowplow iOS or Android tracker.
2. Implement the [Snowplow Web/JavaScript tracker](/docs/sources/trackers/web-trackers/index.md) in the WebView in your app. Make sure to include the [WebView plugin](/docs/sources/trackers/web-trackers/tracking-events/webview/index.md).
3. Subscribe to WebView event messages.

    <Tabs groupId="platform" queryString>
    <TabItem value="ios" label="iOS" default>

    ```swift
    // Pass in a WKWebViewConfiguration
    Snowplow.subscribeToWebViewEvents(with: webView.configuration)
    ```

    </TabItem>
    <TabItem value="android" label="Android (Kotlin)">

    ```kotlin
    // Pass in a WebView object
    Snowplow.subscribeToWebViewEvents(webView);
    ```

    </TabItem>
    <TabItem value="android-java" label="Android (Java)">

    ```java
    // Pass in a WebView object
    Snowplow.subscribeToWebViewEvents(webView);
    ```

    </TabItem>
    </Tabs>

4. Track events as usual.

The Web tracker will automatically intercept all web events and forward them to the mobile tracker. The forwarded events will have the tracker version from Web, e.g. "js-4.1.0", but will otherwise be tracked like the mobile events. They may contain additional information not present in the native mobile events, such as a browser useragent string or URL, or Web context entities e.g. the [WebPage entity](/docs/sources/trackers/web-trackers/tracking-events/page-views/index.md#webpage-page-view-id-context-entity).

The forwarded events are filtered out of the Web tracker event queue so that they are not tracked twice.

The WebView plugin uses the [Snowplow WebView tracker](/docs/sources/trackers/webview-tracker/index.md) as a dependency.


## WebView Tracker

If you don't want to implement a Web tracker in your WebView, you can use the [Snowplow WebView tracker](/docs/sources/trackers/webview-tracker/index.md) directly. This could be suitable if you only want to track a small number of events from the WebView. We recommend event forwarding for most use cases.

1. Implement the Snowplow iOS or Android tracker.
2. Implement the [Snowplow WebView tracker](/docs/sources/trackers/webview-tracker/index.md) in the WebView in your app.
3. Subscribe to WebView event messages.

    <Tabs groupId="platform" queryString>
    <TabItem value="ios" label="iOS" default>

    ```swift
    // Pass in a WKWebViewConfiguration
    Snowplow.subscribeToWebViewEvents(with: webView.configuration)
    ```

    </TabItem>
    <TabItem value="android" label="Android (Kotlin)">

    ```kotlin
    // Pass in a WebView object
    Snowplow.subscribeToWebViewEvents(webView);
    ```

    </TabItem>
    <TabItem value="android-java" label="Android (Java)">

    ```java
    // Pass in a WebView object
    Snowplow.subscribeToWebViewEvents(webView);
    ```

    </TabItem>
    </Tabs>

4. Manually track [WebView events](/docs/sources/trackers/webview-tracker/index.md).

All event types can be tracked with WebView tracker v0.3.0+, but it requires more work than using the event forwarding.
