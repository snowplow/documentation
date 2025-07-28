---
title: "Cross-domain tracking"
date: "2022-08-30"
sidebar_position: 2850
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Configure [cross-domain tracking](/docs/events/cross-navigation/index.md) using the `crossDomainLinker` and `useExtendedCrossDomainLinker` fields of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md).

:::tip

If you enable link decoration, aim to track at least one event on the starting page. The tracker writes the `domain_userid` to a cookie when it tracks an event. If the cookie doesn't exist when the user navigates to the cross-domain destination, the tracker will generate a new ID for them when they return, rather than keeping the old ID. This can make user stitching difficult.

:::

## Choose which links to decorate

Provide a callback for the `crossDomainLinker` option to configure which links to decorate. It should be a function taking one argument, the link element, that returns `true` if the tracker should decorate the link element and `false` otherwise.

We recommend specifying a subset of links to decorate. This means that you won't end up decorating links within the same domain, or "links" that are actually email addresses or telephone numbers, for example.

This function would only decorate those links whose destination is `http://acme.de/` or whose HTML ID is `crossDomainLink`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  }
});
```

  </TabItem>
</Tabs>

If you want to decorate every link to the domain `github.com`:

```javascript
{
  crossDomainLinker: function (linkElement) {
    return /^https:\/\/github\.com/.test(linkElement.href);
  }
}
```

### Check hostname

To only decorate links that are on a different domain to the current page, check the hostname.

```javascript
{
  crossDomainLinker: function (linkElement) {
    return linkElement.hostname !== location.hostname;
  }
}
```

If you have a shared configuration deployed across multiple sites, you may want to check both:

```javascript
{
  crossDomainLinker: function (linkElement) {
    var networkSites = [
      "mysite.com",
      "sistersite.com"
    ];
    return linkElement.hostname !== location.hostname && networkSites.indexOf(linkElement.hostname) > -1;
  }
}
```

Here, link decoration will only occur when links are to different sites within the list.

## Update event listeners

When the tracker loads it doesn't immediately decorate links. Instead, it adds event listeners to links which decorate them when a user clicks on them or navigates to them using the keyboard. This ensures that the timestamp added to the querystring is fresh.

If further links get added to the page after the tracker has loaded, you can use the tracker's `crossDomainLinker` method to add listeners again. Listeners won't be added to links which already have them so it's good practice to make sure you use the same linker function every call, as it won't be updated.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('crossDomainLinker', function (linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
crossDomainLinker(function (linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```

  </TabItem>
</Tabs>


## Configure extended format properties

To decorate links with extended `_sp` format properties, set `useExtendedCrossDomainLinker`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function(defineWhichLinksToDecorate) { },
  useExtendedCrossDomainLinker: true,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function(defineWhichLinksToDecorate) { },
  useExtendedCrossDomainLinker: true,
});
```

  </TabItem>
</Tabs>

This will add `sessionId` and `sourceId` to the querystring.

To include further properties:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function(defineWhichLinksToDecorate) { },
  useExtendedCrossDomainLinker: {
    userId: true;
    sessionId: true;
    sourceId: true;
    sourcePlatform: true;
    reason: true; // can also be a callback
  },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
  crossDomainLinker: function(defineWhichLinksToDecorate) { },
  useExtendedCrossDomainLinker: {
    userId: true;
    sessionId: true;
    sourceId: true;
    sourcePlatform: true;
    reason: true; // can also be a callback
  },
});
```

  </TabItem>
</Tabs>

Provide a callback to `reason` in the form `((evt: Event) => string)` to add custom information to the querystring. If set to `true`, the link text will be used.

## Shared page URLs and user IDs

If a user clicks a cross-site link, and the tracker decorates the URL with their `domain_userid`, and then they share that URL, other users will also have the parameters when they visit the shared page. This could cause problems if you are using `domain_userid` as a user identifier.

You can choose to hide the parameter after the first event, e.g. a page view, fires on the destination page. Because the pipeline populates dedicated event fields with the parameter, you won't need additional modeling to stitch the IDs. If the user copies the URL after the tracking code has fired, it may not include the `_sp` parameter and get copied to other users they share it with.

You can do this using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

The URL-updating code runs in a [callback](/docs/sources/trackers/web-trackers/tracking-events/index.md#getting-user-id-once-set) to ensure it doesn't run before the page view event can capture the original URL.

```javascript
snowplow('trackPageView'); // page URL is https://example.com/?example=123&_sp=6de9024e-17b9-4026-bd4d-efec50ae84cb.1680681134458
snowplow(function(){
  if (/[?&]_sp=/.test(window.location.href)) {
    history.replaceState(history.state, "", window.location.replace(/&?_sp=[^&]+/, "")); // page URL is now https://example.com/?example=123
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackPageView(); // page URL is https://example.com/?example=123&_sp=6de9024e-17b9-4026-bd4d-efec50ae84cb.1680681134458
if (/[?&]_sp=/.test(window.location.href)) {
  history.replaceState(history.state, "", window.location.replace(/&?_sp=[^&]+/, "")); // page URL is now https://example.com/?example=123
}
```

  </TabItem>
</Tabs>

This approach can work with other parameters, e.g. `utm_source`, but it's not recommended unless you are sure other systems have also already captured the parameter values.

Some systems may consider the URL update a single page application page change, and automatically fire additional page view events with this implementation. Test this technique to ensure compatibility with your existing vendors.
