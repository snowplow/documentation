---
title: Configure mobile trackers
position: 8
---

Having installed the tracker dependencies, the next step is to initialize the tracker instances in your app. Tracker instances are initialized given configuration that includes network settings, tracker feature settings, session settings, and more.

The following snippets show how to initialize tracker instances using the default settings. They call the `Snowplow.createTracker()` function and pass it two required pieces of information:

1. The tracker namespace which uniquely identifies the tracker within the app
2. Network configuration with the endpoint address of the Snowplow Collector (e.g. [Snowplow Micro](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-micro/) or [Snowplow Mini](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-mini/)) to send events to

## Initialize the tracker

### iOS

```swift
import SnowplowTracker

let networkConfig = NetworkConfiguration(endpoint: COLLECTOR_URL, method: .post)
let tracker = Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: []
);
```

### Android

```java
import com.snowplowanalytics.snowplow.Snowplow;
import com.snowplowanalytics.snowplow.network.HttpMethod;
import com.snowplowanalytics.snowplow.configuration.NetworkConfiguration;

NetworkConfiguration networkConfig = new NetworkConfiguration(COLLECTOR_URL, HttpMethod.POST);
TrackerController tracker = Snowplow.createTracker(context,
    "appTracker",
    networkConfig
);
```

### React Native

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
    {
        trackerConfig: {
            appId: 'appTracker',
        },
    },
);
```

You can learn more about installing and configuring the mobile trackers in [the mobile tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/introduction/).

## Track events in native code

The initialized tracker instances can be used to track events in your native code. We'll show an example of tracking self-describing events, which are based on "self-describing" JSONs with JSON schemas. A unique schema can be designed for each type of event that you want to track.

### iOS

```swift
let schema = "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1"
let data = ["targetUrl": "http://a-target-url.com"]
let event = SelfDescribing(schema: schema, payload: data)       
tracker.track(event)
```

### Android

```java
String schema = "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1";
Map data = new HashMap();
data.put("targetUrl", "http://a-target-url.com");
SelfDescribingJson sdj = new SelfDescribingJson(schema, data);
SelfDescribing event = new SelfDescribing(sdj);
tracker.track(event);
```

### React Native

```typescript
tracker.trackSelfDescribingEvent({
    schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
    data: {
        targetUrl: 'http://a-target-url.com',
    },
});
```

## Subscribe to events from the web view

In addition to tracking events from the native code, we also want to track events from the web view. To enable events from the WebView tracker to arrive at the Snowplow Collector, you must subscribe the native mobile trackers to listen for messages from the web view.

### iOS

You can call the `Snowplow.subscribeToWebViewEvents(webView)` function to subscribe to the messages. The `webView` object is an instance of `WKWebView`.

```swift
Snowplow.subscribeToWebViewEvents(webView)
```

### Android

You can call the `Snowplow.subscribeToWebViewEvents(webView)` function to subscribe to the messages. The `webView` object is an instance of `WebView`.

```java
Snowplow.subscribeToWebViewEvents(webView);
```

### React Native

The tracker supports web views created using the [React Native WebView package](https://www.npmjs.com/package/react-native-webview).

You can pass a callback created using `getWebViewCallback()` as a parameter in your `WebView` component:

```typescript
import { getWebViewCallback } from '@snowplow/react-native-tracker';

const YourWebViewComponent = () => {
    return <WebView
        onMessage={getWebViewCallback()}
        source={{uri: WEB_VIEW_URI}}
        ... />;
```

Please note that the events will only be tracked if you have initialized a tracker instance as described above. This subscription ensures that both native and web view events are unified under the same session and user context.
