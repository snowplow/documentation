---
title: "Opt-outs and anonymous tracking"
date: "2022-08-30"
sidebar_position: 2860
---

# Opt-outs and anonymous tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow web tracker allows you to track events anonymously. It enables anonymizing various user and session identifiers to support user privacy in case consent for tracking the identifiers is not given. This means that no user identifiers are sent to the Snowplow event collector. By default, anonymous tracking is not enabled.

Anonymous tracking can be configured on initialization, but can be reset later. You may wish to toggle this functionality on or off during a page visit, for example when a user accepts a cookie banner you may not want to disable anonymous tracking, or when a user logs in to your site.

For information about tracking user consent interactions and GDPR basis for processing, check out [this page](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/consent-gdpr/index.md).

On web, the following user and session identifiers can be anonymized:

* Client-side user identifiers:
   * `userId` in the [Session](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/session/index.md) context entity.
   * `userId`, `domainUserId`, `networkUserId`, `ipAddress` if they are set.
* Client-side session identifiers: `sessionId` and `previousSessionId` in Session entity.
* Server-side user identifiers: `network_userid` and `user_ipaddress` event properties.

## Configuring anonymous tracking

There are several levels to the anonymisation depending on which of the three categories are affected. Set this using the [initialization configuration object](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md).

### 1. Full client-side anonymisation

```javascript
anonymousTracking: true,
stateStorageStrategy: 'cookieAndLocalStorage'
```

This mode will no longer track any user identifiers or session information. Similar in behavior to setting `stateStorageStrategy: 'none'`, as it will store no values in cookies or localStorage, however by using `anonymousTracking` you can toggle this behavior on and off (useful for allowing events to be sent without user identifiers until cookie banners have been accepted).

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled.

Anonymous tracking can be toggled on and off. 

### 2. Client-side anonymisation with session

```javascript
anonymousTracking: { withSessionTracking: true },
stateStorageStrategy: 'cookieAndLocalStorage'
```

This mode will continue to track session information in the client side but will track no user identifiers. To achieve this, the tracker will use Cookies or local storage. For session tracking, `stateStorageStrategy` must be either `cookieAndLocalStorage` (default), `localStorage` or `cookie`. If this feature is enabled and the storage strategy is not appropriate, then full anonymous tracking will occur.

The Snowplow JavaScript Tracker performs sessionization client side. This allows anonymous session tracking to be done using client side storage without sending any user identifier fields to the collector.

### 3. Full anonymisation/cookieless

```javascript
anonymousTracking: { withServerAnonymisation: true },
stateStorageStrategy: 'none',
eventMethod: 'post'
```

This mode will no longer track any user identifiers or session information, and will additionally prevent the Snowplow Collector from generating a `network_userid` cookie and capturing the users IP address. The same behavior described for above for Client side Anonymous tracking also applies.

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled. However for an experience that doesn't use any browser storage (cookieless), set `stateStorageStrategy` to `none`. This can be later toggled on, once a user accepts a cookie policy.

Server Anonymisation requires the Snowplow Stream Collector v2.1.0+. Using a lower version will cause events to fail to send until Server Anonymisation is disabled.

Server Anonymisation will not work when the tracker is initialized with `eventMethod: 'beacon'` as it requires additional custom headers which beacon does not support.

## Toggling anonymous tracking

You may wish to toggle this functionality on or off during a page visit, for example when a user accepts a cookie banner you may not want to disable anonymous tracking, or when a user logs in to your site.

### Enable anonymous tracking

:::note
Enabling Anonymous tracking will clear all current user, session and page data from events sent to the collector. Although not sent in requests to collector, existing user and session identifiers will not be removed from cookies or local storage. See below for information on how to clear user data.
:::

If you wish to enable Anonymous Tracking, you can call:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableAnonymousTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableAnonymousTracking } from '@snowplow/browser-tracker';

enableAnonymousTracking();
```

  </TabItem>
</Tabs>

which will enable client side anonymous tracking.

For full, cookieless, anonymization, including anonymizing data within the Snowplow Collector (cookies and ip address), then you can enable server anonymization too:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableAnonymousTracking', {
  options: { withServerAnonymisation: true }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableAnonymousTracking } from '@snowplow/browser-tracker';

enableAnonymousTracking({
  options: { withServerAnonymisation: true }
});
```

  </TabItem>
</Tabs>

Server Anonymization requires the Snowplow Stream Collector v2.1.0+. Using a lower version will cause events to fail to send until Server Anonymization is disabled.

If you want to enable anonymous tracking with session tracking, then you can use:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableAnonymousTracking', {
  options: { withSessionTracking: true }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableAnonymousTracking } from '@snowplow/browser-tracker';

enableAnonymousTracking({
  options: { withSessionTracking: true }
});
```

  </TabItem>
</Tabs>

From v3.1.0 it's also possible to change the `stateStorageStrategy` when enabling Anonymous Tracking, allowing you to switch off storage when turning anonymous tracking on:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableAnonymousTracking', { options: {}, stateStorageStrategy: 'none' }); // Available from v3.1.0
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableAnonymousTracking } from '@snowplow/browser-tracker';

enableAnonymousTracking({
  options: {},
  stateStorageStrategy: 'none' 
});
```

  </TabItem>
</Tabs>

### Disable anonymous tracking

To do this you can call the following methods:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('disableAnonymousTracking');
```

or, if you wish to also adjust the `stateStorageStrategy` when enabling:

```javascript
snowplow('disableAnonymousTracking', { 
  stateStorageStrategy: 'cookieAndLocalStorage' 
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { disableAnonymousTracking } from '@snowplow/browser-tracker';

disableAnonymousTracking();
```

or, if you wish to also adjust the `stateStorageStrategy` when enabling:

```javascript
import { disableAnonymousTracking } from '@snowplow/browser-tracker';

disableAnonymousTracking({ 
  stateStorageStrategy: 'cookieAndLocalStorage' 
});
```

  </TabItem>
</Tabs>

:::note
If configuring the tracker with `stateStorageStrategy: 'localStorage'` and anonymous tracking using `withSessionTracking: true`, then if you change to a `stateStorageStrategy` which prefer cookies such as `cookie` or `cookieAndLocalStorage` then the session identifiers will reset. To maintain session identifiers, ensure you use the same `stateStorageStrategy`.
:::

### Clear user data

If you wish to clear all the cookies and local storage values which contain user data when switching on anonymous tracking, or triggered by other actions on your site, you can call the following:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('clearUserData');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
clearUserData();
```

  </TabItem>
</Tabs>

From v3.1, this will also clear in memory session and user identifiers too. This ensures all possible identifiers are cleared and even if tracking is resumed you will see new session and user identifiers. If you'd like to preserve the in-memory session and user identifiers, for future events should you continue tracking after clearing the cookies, you can do so:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('clearUserData', { preserveSession: true, preserveUser: true });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
clearUserData({ preserveSession: true, preserveUser: true });
```

  </TabItem>
</Tabs>

## Respecting Do Not Track

Most browsers have a Do Not Track option which allows users to express a preference not to be tracked. You can respect that preference by setting the `respectDoNotTrack` field of the [initialization configuration object](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md) to `true`. This prevents cookies from being sent and events from being fired.

## Opt-out cookie

Similar in function to Do Not Track, it's possible to set an [opt-out cookie](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/#opt-out-cookie) to prevent all events being tracked.
