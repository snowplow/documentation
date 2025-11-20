---
title: "Migration guide for web trackers v3 to v4"
sidebar_label: "Migrating from v3 to v4"
sidebar_position: 1100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Version 4 is a major release with several breaking changes to defaults and behavior.
We have tried to keep the APIs compatible with v3 where possible to reduce code changes required.

:::note
These code snippets are for the Javascript (tag) tracker, but the same changes apply for the Browser (npm) tracker.
:::

## Behavior changes

### `cookieDomain` and `discoverRootDomain` handling

`discoverRootDomain` is a setting to enable automatic detection of the closest-to-root domain possible to set cookies on.
This is important to allow consistent Domain User ID and Domain Session ID values between pages on different subdomains of the same domain.
Without this setting, the root domain value needs to be set explicitly with the `cookieDomain` setting in order to be shared correctly between subdomains.
If neither are set, the cookie gets set against the current domain of the page and is not shared between any other subdomains.

In earlier versions, `discoverRootDomain` was disabled by default.
Enabling the setting caused the SDK to ignore any configured `cookieDomain` and prefer the `discoverRootDomain`-derived value instead.

In v4, `discoverRootDomain` is now enabled by default, but will defer to the value in `cookieDomain` if it is set.
This means previously correct configurations may now use the incorrect domain for updating cookies, and you may need to update your `newTracker` code to account for this change.

- If you previously had `discoverRootDomain: true`, you can now remove this setting and should remove any `cookieDomain` configuration.
- If you previously had `cookieDomain` configured and not `discoverRootDomain`, no change is required.
- If you previously had neither `cookieDomain` nor `discoverRootDomain` set, you will need to add `discoverRootDomain: false` to maintain the previous behavior.

<Tabs>
  <TabItem value="jsv3" label="JavaScript (v3)" default>

```javascript
// v3: ignored cookieDomain, always used discoverRootDomain
window.snowplow('newTracker', 'sp', {
  cookieDomain: 'example.com',
  discoverRootDomain: true,
});

// v3: explicit cookieDomain, discoverRootDomain disabled
window.snowplow('newTracker', 'sp', {
  cookieDomain: 'example.com',
  discoverRootDomain: false, // or not set
});

// v3: no domain config
window.snowplow('newTracker', 'sp', {});
```

  </TabItem>
  <TabItem value="jsv4" label="JavaScript (v4)">

```javascript
// v4: remove cookieDomain, use default discoverRootDomain
window.snowplow('newTracker', 'sp', {});

// v4: explicit cookieDomain, preferred over discoverRootDomain
window.snowplow('newTracker', 'sp', {
  cookieDomain: 'example.com',
});

// v4: for no domain, explicitly opt-out of discoverRootDomain
window.snowplow('newTracker', 'sp', {
  discoverRootDomain: false,
});
```

  </TabItem>
</Tabs>

### Async cookie access

Whereas in v3, the tracker updated user and session information in cookies during the track call (e.g., `trackPageView`), v4 makes this asynchronous.
The cookies are updated within 10ms of the track call and the read cookie values are cached for 50ms.
This strategy makes the track function take less time and avoid blocking the main thread of the app.

There is an option to keep the behavior from v3 and update cookies synchronously.
This can be useful for testing purposes to ensure that the cookies are written before the test continues.
It also has the benefit of making sure that the cookie is correctly set before session information is used in events.
The downside is that it is slower and blocks the main thread.


[Read more about the synchronous cookie write option.](/docs/sources/trackers/web-trackers/configuring-how-events-sent/index.md#synchronous-cookie-writes)

### Removed Beacon API, introduced `keepalive`

Version 4 removes the option to set `beacon` as the method for making requests to the Snowplow Collector.
This is due to the use of the fetch API instead of the XMLHttpRequest API for making HTTP requests.

As an alternative to the Beacon API, there is a new keepalive option available from the fetch API.
It indicates that the request should be allowed to outlive the webpage that initiated it.
It enables requests to the Snowplow Collector to complete even if the page is closed or navigated away from.

[Read more about the option here.](/docs/sources/trackers/web-trackers/configuring-how-events-sent/index.md#keepalive-option-for-collector-requests)

### `credentials` instead of `withCredentials`

Also related to the move to fetch instead of XMLHttpRequest, we have changed the `withCredentials` configuration option.
It is now called `credentials` and has values that reflect the option in the fetch API.

[Read more about the option here.](/docs/sources/trackers/web-trackers/configuring-how-events-sent/index.md#disabling-sending-credentials-with-requests).

### `os_timezone` detection

The JavaScript and Browser trackers will now attempt to populate the `os_timezone` field by querying the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API in supported browsers.

Previously, this value was populated by heuristics in the [Timezone](/docs/sources/trackers/web-trackers/tracking-events/timezone-geolocation/index.md) plugin.

The new method may produce different results and only supports more modern browsers.
The Timezone plugin is still supported, but no longer bundled in `sp.js` by default.
Using the plugin will override the new default value.

### Default for `encodeBase64`

The [`encodeBase64` setting](/docs/sources/trackers/web-trackers/configuring-how-events-sent/index.md#base64-encoding) controls whether self describing JSON data in entities and self describing events are encoded with URL-safe [base64 encoding](https://en.wikipedia.org/wiki/Base64) or as JSON strings.

When sending events via the `GET` method, this is recommended because the JSON string would require URL-encoding to safely transmit, which typically results in a larger payload than with the ~33% size overhead of base64-encoded JSON data, which is inherently URL-safe.

For `POST` requests however, the overhead of base64 encoding makes the payload size larger and makes debugging more difficult as the payload isn't human-readable, and has no safety benefits.

For example:

```javascript
/* Actual JSON, length = 211 */
{"schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0","data":[{"schema":"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0","data":{"id":"0edd614e-975d-4f3a-9cd9-af123ac35068"}}]}

/* URI-encoded JSON, length = 289 */
"%7B%22schema%22%3A%22iglu%3Acom.snowplowanalytics.snowplow%2Fcontexts%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%5B%7B%22schema%22%3A%22iglu%3Acom.snowplowanalytics.snowplow%2Fweb_page%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22id%22%3A%220edd614e-975d-4f3a-9cd9-af123ac35068%22%7D%7D%5D%7D"

/* Base64-encoded JSON, length = 282 */
"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiIwZWRkNjE0ZS05NzVkLTRmM2EtOWNkOS1hZjEyM2FjMzUwNjgifX1dfQ"

/* JSON-string-encoded JSON, length = 229 */
"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\",\"data\":[{\"schema\":\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\",\"data\":{\"id\":\"0edd614e-975d-4f3a-9cd9-af123ac35068\"}}]}"
```

In v3, `encodeBase64` defaulted to `true` if not explicitly configured.
In v4, if not configured explicitly, the setting will now default to `false` if the [`eventMethod`](/docs/sources/trackers/web-trackers/configuring-how-events-sent/index.md#network-protocol-and-method) is `post` (the default), but remains `true` if using the `get` method.

If your Collector is hosted behind a Web Application Firewall and custom entities/events include content that may be classified as risky (e.g. content containing HTML code) this may trigger false positives and cause the events to be rejected by the firewall; re-enabling base64 encoding should obfuscate the payload again and allow successful delivery.

Per the [tracker protocol](/docs/events/index.md), the payload fields used for base-64-encoded data differs from plain JSON-encoded data: when upgrading to v4, plugins or tests relying on payload data being in `cx` or `ue_px` may now require updating to check the non-base64-encoded equivalents in `co` and `ue_pr`. Tracker protocol-compliant processors such as the Enricher should already support both fields and require no changes.

### Dropped support for older browsers

The support for the following browsers versions has been dropped:

* Drop IE 11 and Safari 10 support.

## Plugin changes

Plugin APIs are forwards compatible with v3 plugins, so the plugins that are no longer maintained can still be used with v4 if required.
v4 plugins that don't use the new `filter` API are also backwards compatible with v3 if you only need some of the new functionality.

### Removed plugins

The following plugins are no longer maintained and are no longer available in v4.
The v3 plugins should still work with v4, but will no longer be officially supported.

- [Browser Features](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/plugins/index.md#browser-features-plugin-deprecated)
- [Classic Consent](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/consent-gdpr/original/index.md)
- [Classic Ecommerce](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/ecommerce/original/index.md)
- [Optimizely](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/optimizely/index.md#optimizely-classic)

### Bundled plugin changes

The list of plugins included in the default `sp.js` JavaScript Tracker bundle has changed.

The following plugins are no longer included by default:

- [Client Hints](/docs/sources/trackers/web-trackers/tracking-events/client-hints/index.md)
- [Classic Consent](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/consent-gdpr/original/index.md)
- [Classic Ecommerce](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/ecommerce/original/index.md)
- [Enhanced Ecommerce](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/enhanced/index.md)
- [Timezone Detection](/docs/sources/trackers/web-trackers/tracking-events/timezone-geolocation/index.md)
- [Optimizely](/docs/sources/trackers/web-trackers/previous-versions/web-trackers-v3/tracking-events/optimizely/index.md#optimizely-classic)
- [Optimizely X](/docs/sources/trackers/web-trackers/tracking-events/optimizely/index.md)
- [Performance Timing](/docs/sources/trackers/web-trackers/tracking-events/timings/index.md#performance-timing-plugin-original)

The following plugins are now included by default:

- [Button Click Tracking](/docs/sources/trackers/web-trackers/tracking-events/button-click/index.md)
- [Enhanced Consent](/docs/sources/trackers/web-trackers/tracking-events/consent-gdpr/index.md)
- [Snowplow Ecommerce](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/index.md)
- [Performance Navigation Timing](/docs/sources/trackers/web-trackers/tracking-events/timings/index.md)
- [Web Vitals](/docs/sources/trackers/web-trackers/tracking-events/web-vitals/index.md)

To keep using old plugins, they will have to be [explicitly installed](/docs/sources/trackers/web-trackers/plugins/configuring-tracker-plugins/javascript/index.md) using `addPlugins` or built into a custom bundle.

### Plugin behavior updates

#### Button click

- The plugin now uses `capture`-phase event listeners; button clicks that were previously untracked due to ancestor elements stopping event propagation are now more likely to track correctly
- Buttons within Custom Components and open-mode shadow trees should now be trackable but were previously ignored

#### Form tracking

- The plugin now uses document-level event listeners rather than per-element event listeners
- Because of the above, re-calling `enableFormTracking` is no longer required to detect forms dynamically added to the page
- The plugin now uses `capture`-phase event listeners; previously it relied on `target` or `bubble`-phase events
- Forms within Custom Components and open-mode shadow trees should now be trackable but were previously ignored; field focus must first occur before `change` and `submit` can be detected correctly
- Field transform functions can now return `null` values

#### GA cookies

- The [GA Cookies plugin](/docs/sources/trackers/web-trackers/tracking-events/ga-cookies/index.md) now tracks in GA4 mode rather than Universal Analytics mode. This involves a [different schema](http://iglucentral.com/?q=cookies); the newer GA4 schema (`com.google.ga4/cookies`) is now the default, rather than the classic/Universal Analytics schema (`com.google.analytics/cookies`).
- To restore the old behavior, specify configuration for the plugin to enable UA support and disable GA4 support.

#### HTML5 media

- Plugin now wraps the Snowplow Media plugin, uses v2 Media Tracking schemas
- The v3 `enableMediaTracking` method has been removed, in its place is `startHtml5MediaTracking`
- Media tracking can now be stopped with the `endHtml5Tracking` method

#### Link click

- The plugin now uses document-level event listeners rather than per-element event listeners
- Because of the above, `refreshLinkClickTracking` is no longer required, is deprecated, and has no effect; new links will be tracked automatically
- The plugin now uses `capture`-phase event listeners; previously it relied on `target` or `bubble`-phase events
- Links within Custom Components and open-mode shadow trees should now be trackable but were previously ignored
- The manual `trackLinkClick` method can now accept an element to build a payload from, rather than requiring the called to construct the event payload
- Link click tracking now also tracks links with empty `href` attributes and assigns `about:invalid` as the `targetUrl` to avoid the event failing schema validation. Such links will also be reported as warnings in the console.

#### YouTube media

- Plugin now wraps the Snowplow Media plugin, uses v2 Media Tracking schemas
- New `startYouTubeTracking` and `endYouTubeTracking` methods to align with existing v2 plugins
- `enableYouTubeTracking` now wraps `startYouTubeTracking` for v3 compatibility; a new `disableYouTubeTracking` method exists as an equivalent for `endYouTubeTracking`
- The new events use new schemas, continue using v3 to maintain consistent tracking
- The plugin should now work correctly alongside other users of the iFrame API
