---
title: "Tracker Callbacks"
date: "2021-03-26"
sidebar_position: 2000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

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

## Methods which can be used from within a callback

#### `getDomainUserId`

The `getDomainUserId` method returns the user ID stored in the first-party cookie:

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserId = sp.getDomainUserId();
 console.log(domainUserId);
})
```

#### `getDomainUserInfo`

The `getDomainUserInfo` method returns all the information stored in first-party cookie in an array:

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserInfo = sp.getDomainUserInfo();
 console.log(domainUserInfo);
})
```

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

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var userId = sp.getUserId();
 console.log(userId);
})
```

#### `getCookieName`

The `getCookieName` method returns the complete cookie name for the domain or session cookie:

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var cookieName = sp.getCookieName('id');
 console.log(cookieName);
})
```

The argument corresponds to the basename of the cookie: 'id' for the domain cookie, 'ses' for the session cookie.

#### `getPageViewId`

The `getPageViewId` method returns the page view id:

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var pageViewId = sp.getPageViewId();
 console.log(pageViewId);
})
```
