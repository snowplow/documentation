---
title: Set up tracking
position: 2
---

Depending on your application infrastructure and Snowplow setup, you can use either our JavaScript tracker for a `<script>` tag option or our Browser tracker for a more modern web development setup.

In both options, the API is similar with only minor differences in the setup and method calls.

## Package manager setup

### Step 1: Install browser-tracker package

Install the `@snowplow/browser-tracker` and `@snowplow/browser-plugin-web-vitals` via npm, yarn or any other package manager of your choice. Example using `npm`:

```bash
npm install @snowplow/browser-tracker @snowplow/browser-plugin-web-vitals
```

### Step 2: Create the tracker

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

### Step 3: Configure the tracker to use the WebVitalsPlugin

To allow the tracker to collect web performance data from the `WebVitalsPlugin`, you need to include during the initialization of the tracker. By adding it on the `plugins` array, you gain access to the full functionality:

```javascript
import { newTracker } from "@snowplow/browser-tracker";
import { WebVitalsPlugin } from "@snowplow/browser-plugin-web-vitals";

export const tracker = newTracker("sp", "{{Url for Collector}}", {
  /* tracker options */
  plugins: [WebVitalsPlugin()],
});
```

The `WebVitalsPlugin` can accept some additional options which are described in detail on the plugin [documentation page](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/web-vitals/).

Now the tracker has everything required to start collecting web performance data.

## Script tag setup

### Step 1: Download sp.js

Add the `sp.js` file in your project and add it to a link-accessible server directory e.g. `public/`. The latest version can be found [here](https://github.com/snowplow/snowplow-javascript-tracker/releases).

### Step 2: Add the Snowplow JavaScript snippet

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

### Step 3: Configure the global tracker instance

You can now create the `newTracker`, with the following arguments. This creates an instance of a basic tracker without any additional context.

- Tracker Name: `'sp'`
- Collector Url: `'{{Url for Collector}}'`

```javascript
window.snowplow("newTracker", "sp", "{{Url for Collector}}", {
  /* tracker options */
});
```

In addition to the basic tracker, you can add any number of options for using Snowplow's more advanced features. [See more on our documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/).

### Step 4: Configure the tracker to use the WebVitalsPlugin

To add the `WebVitalsPlugin` on the JavaScript tracker and enable web performance data collection, you should include it as shown below:

```javascript
window.snowplow(
  "addPlugin:sp",
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-web-vitals@3/dist/index.umd.min.js",
  ["snowplowWebVitals", "WebVitalsPlugin"]
);
```

The `WebVitalsPlugin` can accept some additional options which are described in detail on the plugin [documentation page](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/web-vitals/).

Now the tracker has everything required to start collecting web performance data.

## The web_vitals event

After adding the web-vitals plugin to your setup, the tracker will send a `web_vitals` event every time a user navigates away from one of your pages. This event will include as accurate information about web vital metrics as possible.

Currently the event will collect the following key metrics:

- Cumulative layout shift (CLS)
- First input delay (FID)
- Largest contentful paint (LCP)
- First contentful paint (FCP)
- Interaction to next paint (INP)
- Time to first byte (TTFB)

For more information you can browse the relevant [Iglu schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/web_vitals/jsonschema/).

:::note
Currently the web performance data collection methods and metrics are more fit towards multi-page applications. For single-page applications (SPAs), the required measurements will need to be refined in a different way.
:::
