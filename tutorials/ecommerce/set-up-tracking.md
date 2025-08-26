---
title: Set up tracker SDKs
position: 2
---

This tutorial covers tracking initialization for both web and mobile platforms. Choose the approach that matches your platform.

## Web tracking setup

Depending on your store's front-end infrastructure and Snowplow setup, you can use either our JavaScript tracker for a `<script>` tag option or our Browser tracker for a more modern web development setup.

### Package manager setup

#### Install browser-tracker package

Install the `@snowplow/browser-tracker` and `@snowplow/browser-plugin-snowplow-ecommerce` via npm, yarn or any other package manager of your choice. Example using `npm`:

```bash
npm install @snowplow/browser-tracker @snowplow/browser-plugin-snowplow-ecommerce
```

#### Create the tracker

In your `src` folder, create a file called `tracker.js`. Inside it create the `tracker` object using the snippet below to use it anywhere in the application:

- Tracker Name: `'sp'`
- Collector Url: `'{{Url for Collector}}'`

```javascript
import { newTracker } from "@snowplow/browser-tracker";

export const tracker = newTracker("sp", "{{Url for Collector}}", {
  /* tracker options */
});
```

In addition to the basic tracker, you can add any number of options for using Snowplow's more advanced features. [See more on our documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracker-setup/initialization-options/).

#### Configure the tracker to use the SnowplowEcommercePlugin

To allow the tracker to use ecommerce methods from the `SnowplowEcommercePlugin`, you need to include during the initialization of the tracker. By adding it on the `plugins` array, you gain access to the full functionality:

```javascript
import { newTracker } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin } from "@snowplow/browser-plugin-snowplow-ecommerce";

export const tracker = newTracker("sp", "{{Url for Collector}}", {
  /* tracker options */
  plugins: [SnowplowEcommercePlugin()],
});
```

Now the tracker has everything required to start collecting ecommerce action data.

### Script tag setup

#### Download sp.js

Add the `sp.js` file in your project and add it to a link-accessible server directory e.g. `public/`. The latest version can be found [here](https://github.com/snowplow/snowplow-javascript-tracker/releases).

#### Add the Snowplow JavaScript snippet

Add the below snippet to all of the pages you would like to use Snowplow tracking. **Make sure to update the {{Link to the sp.js file}} variable.**

Place the `<script>` tag into the `<head>` element of your pages:

```html
<script type="text/javascript">
  (function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
      p.GlobalSnowplowNamespace.push(i);
      p[i] = function () {
        (p[i].q = p[i].q || []).push(arguments);
      };
      p[i].q = p[i].q || [];
      n = l.createElement(o);
      g = l.getElementsByTagName(o)[0];
      n.async = 1;
      n.src = w;
      g.parentNode.insertBefore(n, g);
    }
  })(window, document, "script", "{{Link to sp.js file}}", "snowplow");
</script>
```

#### Configure the global tracker instance

You can now create the `newTracker`, with the following arguments. This creates an instance of a basic tracker without any additional context.

- Tracker Name: `'sp'`
- Collector Url: `'{{Url for Collector}}'`

```javascript
window.snowplow("newTracker", "sp", "{{Url for Collector}}", {
  /* tracker options */
});
```

In addition to the basic tracker, you can add any number of options for using Snowplow's more advanced features. [See more on our documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/).

#### Configure the tracker to use the SnowplowEcommercePlugin

To add the `SnowplowEcommercePlugin` on the JavaScript tracker and enable the usage of the ecommerce API, you should include it as shown below:

**NOTE: The script below should be executed before any ecommerce API can be called successfully.**

```javascript
window.snowplow(
  "addPlugin:sp",
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@3/dist/index.umd.min.js",
  ["snowplowEcommerceAccelerator", "SnowplowEcommercePlugin"]
);
```

Now the tracker has everything required to start collecting ecommerce action data.

## Mobile tracking setup

Setting up Snowplow ecommerce tracking starts with installing and setting up the tracker as for any Snowplow implementation. Read more [here](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up/).

### iOS setup

#### Install tracker dependency

To install Snowplow Tracker with SPM:

1. In Xcode, select File > Swift Packages > Add Package Dependency.
2. Add the url where to download the library: https://github.com/snowplow/snowplow-ios-tracker

#### Create the tracker

In your app, create the tracker.

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.

2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:

   ```swift
   let tracker = Snowplow.createTracker(
    namespace: "appTracker",
    endpoint: "https://snowplow-collector-url.com"
   )
   ```

   The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

3. It creates a tracker instance which can be used to track events like this:

   ```swift
   let event = PromotionViewEvent(promotion: PromotionEntity(id: "IP1234"))

   tracker?.track(event)
   ```

   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker`:

   ```swift
   Snowplow.defaultTracker()?.track(event)
   ```

### Android setup

#### Install tracker dependency

The Android Tracker SDK can be installed using Gradle.

Add into your `build.gradle` file:

```gradle
dependencies {
  ...
  // Snowplow Android Tracker
  implementation 'com.snowplowanalytics:snowplow-android-tracker:5.+'
  // In case 'lifecycleAutotracking' is enabled
  implementation 'androidx.lifecycle-extensions:2.2.+'
  ...
}
```

#### Create the tracker

In your app, create the tracker.

1. In your `Application` subclass, set up the SDK as follows:

   ```kotlin
   val tracker = Snowplow.createTracker(
     applicationContext, // Android context (LocalContext.current in Compose apps)
     "appTracker", // namespace
     "https://snowplow-collector-url.com" // Event collector URL
   )
   ```

   The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

2. It creates a tracker instance which can be used to track events like this:

   ```kotlin
   val event = PromotionViewEvent(PromotionEntity(id = "IP1234"))

   tracker.track(event)
   ```

   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker`:

   ```kotlin
   Snowplow.defaultTracker?.track(event)
   ```

The tracking APIs for mobile are very similar to web, with platform-specific syntax differences. The following sections will focus primarily on web examples, with mobile equivalents noted where they differ significantly.
