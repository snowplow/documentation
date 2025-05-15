---
title: "Getting cookie information"
sidebar_position: 500
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Domain user information

You can use the following function to extract the Domain User Information from the ID cookie:

```javascript
/*
* Function to extract the Snowplow Domain User Information from the first-party cookie set by the Snowplow JavaScript Tracker
*
* @param string cookieName (optional) The value used for "cookieName" in the tracker constructor argmap
* (leave blank if you did not set a custom cookie name)
*
* @return string or bool The ID string if the cookie exists or false if the cookie has not been set yet
*/
function getSnowplowDuid(cookieName) {
  var cookieName = cookieName || '_sp_';
  var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);?');
  var match = document.cookie.match(matcher);
  var split = match[1].split('.');
  if (match && match[1]) {
    return {
      'domain_userid': split[0],
      'domain_sessionidx': split[2],
      'domain_sessionid': split[5]
    }
  } else {
    return false;
  }
}
```

If you set a custom `cookieName` field in the argmap, pass that name into the function; otherwise call the function without arguments. Note that if the function is called before the cookie exists (i.e. when the user is visiting the page for the first time and sp.js has not yet loaded) if will return `false`.


## Retrieving cookie properties from the tracker

It's possible to retrieve cookie properties for use in your code (as well as the [page view UUID](/docs/sources/trackers/web-trackers/tracking-events/page-views/index.md) and [user ID](/docs/sources/trackers/web-trackers/tracking-events/index.md#getting-user-id-once-set)) using a tracker callback. This is an advanced usage of the tracker.

```mdx-code-block
import RetrieveValuesJs from "@site/docs/reusable/javascript-tracker-retrieve-values/_javascript.md"
import RetrieveValuesBrowser from "@site/docs/reusable/javascript-tracker-retrieve-values/_browser.md"
```

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

<RetrieveValuesJs />

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

<RetrieveValuesBrowser />

  </TabItem>
</Tabs>

### `getDomainUserId`

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

### `getDomainUserInfo`

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

### `getCookieName`

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
