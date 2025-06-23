---
title: "Tracker Information"
date: "2021-04-07"
sidebar_position: 2000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

When initialising a tracker, you can use the returned `tracker` instance to access various properties from this tracker instance.

```javascript
// Configure a tracker instance named "sp"
const sp = newTracker('sp', '{{COLLECTOR_URL}', {
 appId: 'snowplowExampleApp'
});

// Access the tracker properties
const domainUserId = sp.getDomainUserId();
```

## Available methods on the Tracker

#### `getDomainUserId`

The `getDomainUserId` method returns the user ID stored in the first-party cookie:

```javascript
const domainUserId = sp.getDomainUserId();
console.log(domainUserId);
```

#### `getDomainUserInfo`

The `getDomainUserInfo` method returns all the information stored in first-party cookie in an array:

```javascript
const domainUserInfo = sp.getDomainUserInfo();
console.log(domainUserInfo);
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
const userId = sp.getUserId();
console.log(userId);
```

#### `getCookieName`

The `getCookieName` method returns the complete cookie name for the domain or session cookie:

```javascript
const cookieName = sp.getCookieName('id');
console.log(cookieName);
```

The argument corresponds to the basename of the cookie: 'id' for the domain cookie, 'ses' for the session cookie.

#### `getPageViewId`

The `getPageViewId` method returns the page view id:

```javascript
const pageViewId = sp.getPageViewId();
console.log(pageViewId);
```
