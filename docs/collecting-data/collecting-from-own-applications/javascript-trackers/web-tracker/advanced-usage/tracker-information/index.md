---
title: "Tracker information"
date: "2021-04-07"
sidebar_position: 2000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```
Some tracker and cookie properties can be retrieved for use in your code.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

If you call `snowplow` with a function as the argument, the function will be executed when sp.js loads:

```javascript
snowplow(function () {
  console.log("sp.js has loaded");
});
```

Or equivalently:

```javascript
snowplow(function (x) {
  console.log(x);
}, "sp.js has loaded");
```

The callback you provide is executed as a method on the internal `trackerDictionary` object. This means that you can access the `trackerDictionary` using `this`.

```javascript
// Configure a tracker instance named "sp"
snowplow('newTracker', 'sp', '{{COLLECTOR_URL}', {
 appId: 'snowplowExampleApp'
});

// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserId = sp.getDomainUserId();
 console.log(domainUserId);
})
```

The callback function should not be a method:

```javascript
// TypeError: Illegal invocation
snowplow(console.log, "sp.js has loaded");
```

This will not work because the value of `this` in the `console.log` function will be the `trackerDictionary` rather than `console`.

You can get around this problem using `Function.prototoype.bind` as follows:

```javascript
snowplow(console.log.bind(console), "sp.js has loaded");
```

For more on execution context in JavaScript, see the [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

When initialising a tracker, you can use the returned `tracker` instance to access various properties from this tracker instance.

```javascript
// Configure a tracker instance named "sp"
const sp = newTracker('sp', '{{COLLECTOR_URL}', {
 appId: 'snowplowExampleApp'
});

// Access the tracker properties
const domainUserId = sp.getDomainUserId();
```

  </TabItem>
</Tabs>

## Available methods

#### `getDomainUserId`

The `getDomainUserId` method returns the user ID stored in the first-party cookie:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserId = sp.getDomainUserId();
 console.log(domainUserId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const domainUserId = sp.getDomainUserId();
console.log(domainUserId);
```

  </TabItem>
</Tabs>

#### `getDomainUserInfo`

The `getDomainUserInfo` method returns all the information stored in first-party cookie in an array:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserInfo = sp.getDomainUserInfo();
 console.log(domainUserInfo);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const domainUserInfo = sp.getDomainUserInfo();
console.log(domainUserInfo);
```

  </TabItem>
</Tabs>

The `domainUserInfo` variable will contain an array with 11 elements:

1. A string set to `'1'` if this is the user's first session and `'0'` otherwise
2. The domain user ID
3. The timestamp at which the cookie was created
4. The number of times the user has visited the site
5. The timestamp for the current visit
6. The timestamp of the last visit
7. The session id
8. ID of the previous session (since version 3.5)
9. ID of the first event in the current session (since version 3.5)
10. Device created timestamp of the first event in the current session (since version 3.5)
11. Index of the last event in the session (used to inspect order of events) (since version 3.5)

#### `getUserId`

The `getUserId` method returns the user ID which you configured using `setUserId()`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var userId = sp.getUserId();
 console.log(userId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const userId = sp.getUserId();
console.log(userId);
```

  </TabItem>
</Tabs>

#### `getCookieName`

The `getCookieName` method returns the complete cookie name for the domain or session cookie:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var cookieName = sp.getCookieName('id');
 console.log(cookieName);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const cookieName = sp.getCookieName('id');
console.log(cookieName);
```

  </TabItem>
</Tabs>

The argument corresponds to the basename of the cookie: 'id' for the domain cookie, 'ses' for the session cookie.

#### `getPageViewId`

The `getPageViewId` method returns the page view id:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var pageViewId = sp.getPageViewId();
 console.log(pageViewId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const pageViewId = sp.getPageViewId();
console.log(pageViewId);
```

  </TabItem>
</Tabs>
