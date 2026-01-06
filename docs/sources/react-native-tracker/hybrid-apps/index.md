---
title: "React Native hybrid apps"
sidebar_label: "Hybrid apps"
date: "2022-08-30"
sidebar_position: 70
---

:::info

This feature is available since v1.3. To use the Web plugin, you will need v4.2+ of the React Native tracker.

:::

Hybrid apps are mobile apps that in addition to a React Native interface, provide part of the UI through an embedded Web view. Snowplow events are tracked from both the React Native code as well as the Web view. Our goal is to have both events tracked from both places to share the same session and appear as tracked with the same tracker.

## Event forwarding

We recommend using the Web tracker (v4.3+) to forward all Web events to the React Native tracker.

1. Implement the React Native tracker.
2. Implement the [Snowplow Web/JavaScript tracker](/docs/sources/web-trackers/index.md) in the WebView in your app. Make sure to include the [WebView plugin](/docs/sources/web-trackers/tracking-events/webview/index.md).
3. Subscribe to WebView event messages.

    ```typescript
    import { getWebViewCallback } from '@snowplow/react-native-tracker';

    const YourWebViewComponent = () => {
        return <WebView
            onMessage={getWebViewCallback()}
            source={{uri: WEB_VIEW_URI}}
            ... />;
    ```

4. Track events as usual.

The Web tracker will automatically intercept all web events and forward them to the React Native tracker. The forwarded events will have the tracker version from Web, e.g. "js-4.1.0", but will otherwise be tracked like the mobile events. They may contain additional information not present in the React Native mobile events, such as a browser useragent string or URL, or Web context entities e.g. the [WebPage entity](/docs/sources/web-trackers/tracking-events/page-views/index.md#webpage-page-view-id-context-entity).

The forwarded events are filtered out of the Web tracker event queue so that they are not tracked twice.

The WebView plugin uses the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) as a dependency.

## WebView Tracker

If you don't want to implement a Web tracker in your WebView, you can use the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) directly. This could be suitable if you only want to track a small number of events from the WebView. We recommend event forwarding for most use cases.

1. Implement the React Native tracker.
2. Implement the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) in the WebView in your app.
3. Subscribe to WebView event messages.

    ```typescript
    import { getWebViewCallback } from '@snowplow/react-native-tracker';

    const YourWebViewComponent = () => {
        return <WebView
            onMessage={getWebViewCallback()}
            source={{uri: WEB_VIEW_URI}}
            ... />;
    ```

4. Manually track [WebView events](/docs/sources/webview-tracker/index.md).

All event types can be tracked with WebView tracker v0.3.0+, but it requires more work than using the event forwarding.
