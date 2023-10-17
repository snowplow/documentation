---
title: "Additional options"
sidebar_position: 3000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Toggling anonymous tracking

The JavaScript Tracker can be initialized with `anonymousTracking: true` or `anonymousTracking: { withSessionTracking: true }` or `anonymousTracking: { withServerAnonymisation: true }`. You can read more about the anonymous tracking features [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/#anonymous-tracking).

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

## Setting the user ID

The JavaScript Tracker automatically sets a `domain_userid` based on a first party cookie.

There are many situations, however, when you will want to identify a specific user using an ID generated by one of your business systems. To do this, you use one of the methods described in this section: `setUserId`, `setUserIdFromLocation`, `setUserIdFromReferrer`, and `setUserIdFromCookie`.

Typically, companies do this at points in the customer journey where users identify themselves e.g. if they log in.

:::note
This will only set the user ID on further events fired while the user is on this page; if you want events on another page to record this user ID too, you must call `setUserId` on the other page as well.
:::

### `setUserId`

`setUserId` is the simplest of the four methods. It sets the business user ID to a string of your choice:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserId', 'joe.blogs@email.com');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserId('joe.blogs@email.com');
```

  </TabItem>
</Tabs>

:::note
`setUserId` can also be called using the alias `identifyUser`.
:::

### `setUserIdFromLocation`

`setUserIdFromLocation` lets you set the user ID based on a querystring field of your choice. For example, if the URL is `http://www.mysite.com/home?id=user345`, then the following code would set the user ID to “user345”:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromLocation', 'id');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromLocation('id');
```

  </TabItem>
</Tabs>

### `setUserIdFromReferrer`

`setUserIdFromReferrer` functions in the same way as `setUserIdFromLocation`, except that it uses the referrer querystring rather than the querystring of the current page.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromReferrer', 'id');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromReferrer('id');
```

  </TabItem>
</Tabs>

### `setUserIdFromCookie`

Use `setUserIdFromCookie` to set the value of a cookie as the user ID. For example, if you have a cookie called “cookieid” whose value is “user123”, the following code would set the user ID to “user123”:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromCookie', 'cookieid');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromCookie('cookieid');
```

  </TabItem>
</Tabs>

## Setting a custom page URL and referrer URL

The Snowplow JavaScript Tracker automatically tracks the page URL and referrerURL on any event tracked. However, in certain situations, you may want to override the one or both of these URLs with a custom value. (For example, this might be desirable if your CMS spits out particularly ugly URLs that are hard to unpick at analysis time.)

To set a custom page URL, use the `setCustomUrl` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setCustomUrl', 'http://mysite.com/checkout-page');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setCustomUrl('http://mysite.com/checkout-page');
```

  </TabItem>
</Tabs>

To set a custom referrer, use the `setReferrerUrl` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setReferrerUrl', 'http://custom-referrer.com');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setReferrerUrl('http://custom-referrer.com');
```

  </TabItem>
</Tabs>

On a single-page app, the page URL might change without the page being reloaded. Whenever an event is fired, the Tracker checks whether the page URL has changed since the last event. If it has, the page URL is updated and the URL at the time of the last event is used as the referrer. If you use `setCustomUrl`, the page URL will no longer be updated in this way. If you use `setReferrerUrl`, the referrer URL will no longer be updated in this way.

If you want to ensure that the original referrer is preserved even though your page URL can change without the page being reloaded, use `setReferrerUrl` like this before sending any events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setReferrerUrl', document.referrer);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setReferrerUrl(document.referrer);
```
  </TabItem>
</Tabs>

