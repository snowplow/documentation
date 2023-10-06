---
title: "Migrating from v2 to v3"
date: "2021-03-24"
sidebar_position: 1200
---

A number of features which have been deprecated for a number of v2.x releases have been removed in v3 and a new API for `track` methods has been introduced which is a major breaking change.

:::note
These code snippets are for the Javascript (tag) tracker, but the same changes apply for the Browser (npm) tracker.
:::

## New CDN Locations

The JavaScript Tracker is now available in new locations on third party CDN providers. CDN providers are useful for getting tracking up and running quickly, particularly when testing a new release. We still strongly recommend renaming `sp.js` and hosting the file yourself but if you'd like to access the tracker from a CDN, then is available on [jsDelivr](https://www.jsdelivr.com/package/npm/@snowplow/javascript-tracker?path=dist) and [unpkg](https://unpkg.com/browse/@snowplow/javascript-tracker@latest/dist/).

## New tracking API (BREAKING CHANGE)

The track methods now accept an Object which contains the event data, instead of the parameter list in v2. As an example, here is what a Page View event used to look like:

```javascript
window.snowplow('trackPageView', 'My Title', [ // Set page title; add page context
  {
    schema: "iglu:org.schema/WebPage/jsonschema/1-0-0",
    data: {
      keywords: ['tester']
    }
  }
]);
```

Starting in v3, this looks like:

```javascript
window.snowplow('trackPageView', {
  title: 'My Title',
  context: [
    {
      schema: 'iglu:org.schema/WebPage/jsonschema/1-0-0',
      data: {
        keywords: ['tester'],
      },
    },
  ],
});
```

This improves the readability of the tracking code, removing the need for comments that are often used to describe what each property represents. It also allows the tracking functions to be easily extended in the future.

All functions that previously accepted multiple arguments now accept an Object instead. Functions which have a single parameter, such as the setters, have remained as they are as they will never have multiple parameters. For example:

```javascript
window.snowplow('setUserId', 'alex-d-123');
```

You can find the complete list of all the functions and the new named arguments in the [v3 documentation](../javascript-tracker-v3/).

## Renamed Properties (BREAKING CHANGE)

All references to `whitelist` and `blacklist` have been removed in Link Click tracking and Form tracking. They have been replaced with `allowlist` and `denylist`.

For example, in v2 you would specify:

```javascript
window.snowplow('enableLinkClickTracking', 
  { blacklist: ['exclude'] },
  true,
  true,
});
```

In v3 this is now:

```javascript
window.snowplow('enableLinkClickTracking', {
  options: { denylist: ['exclude'] },
  pseudoClicks: true,
  trackContent: true,
});
```

## Removed Tracking

Three sets of properties will no longer be collected in the default configuration. Although in the case of two of them, they can still be loaded as additional plugins (See "Whats New?").

`Parrable` opt-out cookie tracking is no longer available. This specific Parrable cookie is no longer part of Parrable.

Tracking Browser features, from the `navigator.mimeTypes` is no longer included as this is a [deprecated API](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/mimeTypes). If you still wish to track this, you can load this as a plugin.

Optimizely Classic tracking is no longer included by default. Optimizely now defaults all installations and has migrated the majority of installations to Optimizely X, which is still included by default. Optimizely Classic tracking can be loaded as a plugin.

## Removed Configuration Options

This isn't a breaking change as the tracker will ignore unrecognised properties during initialisation but you may want to take this opportunity to remove them. The properties below were all part of the configuration Object passed to a `newTracker` call.

`pageUnloadTimer` has been removed. The tracker no longer attempts to block when unloading the page. Instead it will send events on `visibilityChange` to `hidden` and make one final attempt to flush any unsent events in `beforeUnload`.

`forceSecureTracker` and `forceUnsecureTracker` have been removed. You can now force the protocol of the collector endpoint when initialising the tracker, or leave it off and the tracker will use the same as the current site. e.g. `window.snowplow('newTracker', 'sp', 'collector.mywebsite.com', {})` will use the same protocol whereas `window.snowplow('newTracker', 'sp', 'https://collector.mywebsite.com', {})` will force the events to be sent over HTTPS.

`useLocalStorage` and `useCookies` have been removed in favour of `stateStorageStrategy` which can be one of four values: `'cookieAndLocalStorage'` (default), `'cookie'`, `'localStorage'` or `'none'`.

`contexts.parrable` is no longer available. The Parrable feature this tracked is no longer part of Parrable.

`post` has been removed. Set `eventMethod` instead, the available options are: `'post'` (default), `beacon` or `get`.

`skippedBrowserFeatures` is removed as `sp.js` will no longer collect `mimeTypes` browser features without the use of an additional Plugin (See Plugins for more information).

## Removed Functions

Some deprecated functions have also been removed. This shouldn't cause any errors if you do call them, although you will see warnings in your developer tools console.

The following have been removed:

`trackUnstructEvent` has been removed in favour of `trackSelfDescribingEvent`. They behave in exactly the same way, `trackUnstructEvent` was an alias for `trackSelfDescribingEvent`.

`window._snaq` has been removed. All calls to the tracker should be made via `window.snowplow` now (or your own global if you have configured the Tag parameters).

Legacy `window.Snowplow` (note the capital S) and the containing functions (`getTrackerCf`, `getTrackerUrl` and `getAsyncTracker`) have been removed.

`setCountPreRendered` and the prerendered visibility checks, as this is [a deprecated API](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState#browser_compatibility).

User Fingerprinting was removed in v2.13 but now the remaining method stubs `enableUserFingerprint` and `getUserFingerprint` have been completely removed.

The following functions are removed and should be set during Tracker initialisatoin:  
`setAppId`, `setCookieNamePrefix`, `setCookieDomain`, `setSessionCookieTimeout`, `setUserFingerprintSeed`, `respectDoNotTrack`, `setPlatform`, `encodeBase64` and `setCollectorCf`.

## Whats New?

There are also a number of new features which you might want to now start to take advantage of. Additionally the full `sp.js` in 3.0.0 is smaller than 2.17.3 and `sp.lite.js` is even smaller! Read on...

#### Plugins

You can now load Plugins which extend the JavaScript Tracker with new Contexts and new API functions. As an example, you might want to continue tracking the `mimeTypes` which have been dropped by default in v3. To do that you would write the following:

```javascript
window.snowplow('newTracker', 'sp', {});
window.snowplow('addPlugin', 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-browser-features@3.0.0/dist/index.umd.min.js', ['snowplowBrowserFeatures', 'BrowserFeaturesPlugin']);
window.snowplow('trackPageView');
```

This will queue all track events until the plugin is loaded, or 5000 milliseconds, whichever is sooner. Just we recommend with `sp.js` we suggest you rename and host the plugin JavaScript files yourself.

#### sp.lite.js

We also now publish a much smaller version of the JavaScript Tracker, called `sp.lite.js`. You can find it on the CDNs and in the GitHub Releases just like the regular `sp.js`. This has a limited featureset but is roughly half the size of `sp.js`.

Included in `sp.lite.js` is: Page View, Self Describing and Structured Event tracking as well as Activity Tracking and Anonymous Tracking. All other features can be loaded as separate plugins. So if you wanted sp.lite.js with Form tracking, you could do this:

```html
<script type="text/javascript" async=1> 
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.0.0-beta.4/dist/sp.lite.js","snowplow")); 

window.snowplow('newTracker', 'sp', {});
window.snowplow('addPlugin', 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@3.0.0/dist/index.umd.min.js', ['snowplowFormTracking', 'FormTrackingPlugin']);
window.snowplow('enableFormTracking');
</script>
```

#### Build your own sp.js

It's now easier than ever to build your own `sp.js` to include _just_ the features you want!

To do this, you'll need to install [git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) 10, 12 or 14 (at the time of writing) then open a Terminal or Command Prompt and run the following:

```bash
$ git clone https://github.com/snowplow/snowplow-javascript-tracker.git
$ npm install -g @microsoft/rush 
$ rush update
```

Then open the file `/trackers/javascript-tracker/tracker.config.ts` in your favourite text editor and flip the `true` values to `false` for features which you don't require.

Then run:

```bash
$ rush build
```

Once complete (it might take a minute or two), you'll find your brand new `sp.js` at:  
`/trackers/javascript-tracker/dist/sp.js` along with a new sourcemap `sp.js.map` which we suggest hosting together for a better developer experience.
