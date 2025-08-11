---
title: Set up tracking
position: 2
---

Depending on your front-end infrastructure and Snowplow setup, you can use either our JavaScript tracker for a `<script>` tag option or our Browser tracker for a more modern web development setup.

In both options, the API is similar with only minor differences in the setup and method calls.

## Package manager setup

### Step 1: Install browser-tracker package

Install the `@snowplow/browser-tracker` and `@snowplow/browser-plugin-enhanced-consent` via npm, yarn or any other package manager of your choice. Example using `npm`:

```bash
npm install @snowplow/browser-tracker @snowplow/browser-plugin-enhanced-consent
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

### Step 3: Configure the tracker to use the EnhancedConsentPlugin

For the tracker to use the consent preference collection methods from the `EnhancedConsentPlugin`, include it as part of the initialization of the tracker. By adding it on the `plugins` array, you gain access to the full functionality:

```javascript
import { newTracker } from "@snowplow/browser-tracker";
import { EnhancedConsentPlugin } from "@snowplow/browser-plugin-enhanced-consent";

export const tracker = newTracker("sp", "{{Url for Collector}}", {
  /* tracker options */
  plugins: [EnhancedConsentPlugin()],
});
```

## Script tag setup

### Step 1: Download sp.js

Add the `sp.js` file in your project and add it to a link-accessible server directory e.g. `public/`. The latest version can be found [here](https://github.com/snowplow/snowplow-javascript-tracker/releases).

### Step 2: Add the Snowplow JavaScript snippet

Add the below snippet to all of the pages you would like to use Snowplow tracking. **Make sure to update the {{Link to the sp.js file}} variable.**

Place the `<script>` tag into the `<head>` element of your pages:

```html
<script type="text/javascript" async=1 >
;(function (p, l, o, w, i, n, g) { if (!p[i]) { p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []; p.GlobalSnowplowNamespace.push(i); p[i] = function () { (p[i].q = p[i].q || []).push(arguments) }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1; n.src = w; g.parentNode.insertBefore(n, g) } }(window, document, "script", "{{Link to sp.js file}}", "snowplow"));
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

### Step 4: Configure the tracker to use the EnhancedConsentPlugin

To add the `EnhancedConsentPlugin` on the JavaScript tracker and enable the usage of the enhanced consent API, you should include it as shown below:

**NOTE: The script below should be executed before any enhanced consent API can be called successfully.**

```javascript
window.snowplow(
  "sp:addPlugin",
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-consent@3/dist/index.umd.min.js",
  ["snowplowEnhancedConsentTracking", "EnhancedConsentPlugin"]
);
```

Now the tracker has everything required to start collecting consent preference data from consent management platform interactions. In the next step we'll see how to use the API integrating with a real consent management platform.
