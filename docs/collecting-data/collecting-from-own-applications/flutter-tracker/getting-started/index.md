---
title: "Getting started"
date: "2022-01-31"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Designing how and what to track in your app is an important decision. Check out our docs about tracking design [here](/docs/understanding-tracking-design/introduction-to-tracking-design/index.md).

The following steps will guide you through setting up the Flutter tracker in your project and tracking a simple event.

## Installation

Add the Snowplow tracker as a dependency to your Flutter application:

```bash
flutter pub add snowplow_tracker
```

This will add a line with the dependency to your pubspec.yaml:

<CodeBlock language="yaml">{
`dependencies:
    snowplow_tracker: ^${versions.flutterTracker}
`}</CodeBlock>


Import the package into your Dart code:

```dart
import 'package:snowplow_tracker/snowplow_tracker.dart'
```

### Installation on Web

If using the tracker within a Flutter app for Web, you will also need to import the Snowplow JavaScript Tracker in your `index.html` file. Please load the JS tracker with the Snowplow tag as [described here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/installing-the-tracker/index.md). Do not change the global function name `snowplow` that is used to access the tracker – the Flutter APIs assume that it remains the default as shown in documentation.

Make sure to use JavaScript tracker version `3.5` or newer. You may also refer to the [example project](https://github.com/snowplow-incubator/snowplow-flutter-tracker/tree/main/example) in the Flutter tracker repository to see this in action.

## Initialization

Instantiate a tracker using the `Snowplow.createTracker` function. At its most basic, the function takes two required arguments: `namespace` and `endpoint`. Tracker namespace identifies the tracker instance, you may create multiple trackers with different namespaces. The endpoint is the URI of the Snowplow collector to send the events to. This tracker creation is asynchronous and uses the `await` keyword; therefore it must occur inside a function labelled `async`. You could create the tracker in the `main()` of your main widget. 

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'ns1',
    endpoint: 'http://...'
);

// Creating a tracker in the main() function
// It is passed to the other widgets as necessary
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SnowplowTracker tracker = await Snowplow.createTracker(
      namespace: "namespace", 
      endpoint: "http://0.0.0.0:9090");

  runApp(MyApp(tracker: tracker));
}
```

There are additional optional arguments to configure the tracker. To learn more about configuring how events are sent, check out [this page](/docs/collecting-data/collecting-from-own-applications/flutter-tracker/initialization-and-configuration/index.md).

## Tracking events

To track events, simply instantiate their respective types (e.g., `ScreenView`, `SelfDescribing`, `Structured`) and pass them to the `tracker.track` or `Snowplow.track` methods.

```dart
tracker.track(ScreenView(
    id: '2c295365-eae9-4243-a3ee-5c4b7baccc8f',
    name: 'home',
    type: 'full',
    transitionType: 'none'));
```

Visit documentation about [tracking events](/docs/collecting-data/collecting-from-own-applications/flutter-tracker/tracking-events/index.md) to learn about other supported event types. You may also want to read about [adding more data to tracked events](/docs/collecting-data/collecting-from-own-applications/flutter-tracker/adding-data/index.md).

## Testing

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-tracking-with-micro/_index.md"

<TestingWithMicro/>
```
