---
title: "Track events from hybrid Flutter apps with WebViews"
sidebar_label: "Hybrid Apps (WebViews)"
description: "Enable event tracking from WebView content in Flutter apps using webview_flutter package. Forward Web tracker events to Flutter tracker or use WebView tracker directly to share sessions."
keywords: ["hybrid apps", "webview tracking", "flutter webview", "event forwarding", "webview_flutter"]
sidebar_position: 5000
---

:::info

This feature is available since v0.8 of the Flutter tracker and supports WebView implemented using the [`webview_flutter` package](https://pub.dev/packages/webview_flutter).

:::

Hybrid apps are mobile apps that in addition to a Flutter interface, provide part of the UI through an embedded Web view. Snowplow events are tracked from both the Flutter code as well as the Web view. Our goal is to have both events tracked from both places to share the same session and appear as tracked with the same tracker.

## Event forwarding

We recommend using the Web tracker (v4.3+) to forward all Web events to the Flutter tracker.

1. Implement the Flutter tracker.
2. Implement the [Snowplow Web/JavaScript tracker](/docs/sources/web-trackers/index.md) in the WebView in your app. Make sure to include the [WebView plugin](/docs/sources/web-trackers/tracking-events/webview/index.md).
3. Subscribe to WebView event messages. Here is a simplified example usage:

    ```dart
    import 'package:flutter/services.dart';
    import 'package:snowplow_tracker/snowplow_tracker.dart';

    class MainPage extends StatefulWidget {
        const MainPage({super.key, required this.tracker});

        // Snowplow tracker instance
        final SnowplowTracker tracker;

        @override
        State<MainPage> createState() => _MainPageState();
    }

    class _MainPageState extends State<MainPage> with WidgetsBindingObserver {
        late final WebViewController _webViewController;

        @override
        void initState() {
            _webViewController = WebViewController()
                ..setJavaScriptMode(JavaScriptMode.unrestricted)
                ..loadRequest(Uri.parse(const String.fromEnvironment('WEBVIEW_URL',
                    defaultValue: 'http://localhost:3000')));

            // register the webview controller with the tracker to set up JavaScript channel
            widget.tracker.registerWebViewJavaScriptChannel(
                webViewController: _webViewController);
        }

        @override
        Widget build(BuildContext context) {
            return SizedBox(
                height: 300,
                child: WebViewWidget(controller: _webViewController),
            );
        }
    }

    ```

4. Track events as usual.

The Web tracker will automatically intercept all web events and forward them to the Flutter tracker. The forwarded events will have the tracker version from Web, e.g. "js-4.1.0", but will otherwise be tracked like the mobile events. They may contain additional information not present in the Flutter mobile events, such as a browser useragent string or URL, or Web context entities e.g. the [WebPage entity](/docs/sources/web-trackers/tracking-events/page-views/index.md#page-view-id-and-web_page-entity).

The forwarded events are filtered out of the Web tracker event queue so that they are not tracked twice.

The WebView plugin uses the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) as a dependency.

## WebView Tracker

If you don't want to implement a Web tracker in your WebView, you can use the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) directly. This could be suitable if you only want to track a small number of events from the WebView. We recommend event forwarding for most use cases.

1. Implement the Flutter tracker.
2. Implement the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) in the WebView in your app.
3. Subscribe to WebView event messages. This step is the same as shown above.
4. Manually track [WebView events](/docs/sources/webview-tracker/index.md).

All event types can be tracked with WebView tracker v0.3.0+, but it requires more work than using the event forwarding.
