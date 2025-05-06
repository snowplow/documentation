---
title: "Cross-domain tracking"
date: "2022-08-30"
sidebar_position: 2850
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The JavaScript tracker can add an additional parameter named `_sp` to the querystring of outbound links. This process is called "link decoration".

Configure cross-domain tracking using the `useExtendedCrossDomainLinker` or `crossDomainLinker` fields of the [configuration object](/docs/sources/trackers/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md). Choose between extended or short format for the `_sp` querystring parameter:

* Short format: choose which links to decorate with the core parameters only
* Extended format: the querystring can include more parameters, but the tracker will decorate all cross-domain links

If you set both configuration options, the tracker will use the extended format.

You can include the following properties in the `_sp` querystring:

| Property        | Description                                    | Extended | Short |
| --------------- | ---------------------------------------------- | -------- | ----- |
| `domainUserId`  | Current tracker-generated UUID user identifier | ✅        | ✅     |
| `timestamp`     | Current epoch timestamp, ms precision          | ✅        | ✅     |
| `sessionId`     | Current session UUID identifier                | ✅        |       |
| `subjectUserId` | Custom business user identifier                | ✅        |       |
| `sourceId`      | Application identifier                         | ✅        |       |
| `platform`      | Platform of the current device                 | ✅        |       |
| `reason`        | Link text or extra information                 | ✅        |       |

For example,

```
appSchema://path/to/page?_sp=domainUserId.timestamp.sessionId.subjectUserId.sourceId.platform.reason
```

Link decoration makes these values visible in the `url` field of events sent by the JavaScript tracker on the destination page. The enrichment process will use them to populate the `refr_domain_userid` and `refr_dvce_tstamp` fields for all events fired on the destination page, where the URL includes the `_sp` parameter.

The querystring is added only to the events on the destination page: it doesn't persist throughout the user's session.

:::tip

If you enable link decoration, aim for at least one event to be tracked on the page. The tracker writes the `domain_userid` to a cookie when it tracks an event. If the cookie doesn't exist when the user leaves the page, the tracker will generate a new ID for them when they return, rather than keeping the old ID. This can make user stitching difficult.

:::

## Extended format

The extended `_sp` value always includes `domainUserId` and `timestamp`. The other properties are configurable using the `ExtendedCrossDomainLinkerAttributes` object.

By default, `reason` will be the link text from a cross-domain link.

To decorate links with the full extended format:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
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
  useExtendedCrossDomainLinker: true,
});
```

  </TabItem>
</Tabs>

To include specific properties:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'namespace', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax',
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

Provide a callback to `reason` in the form `((evt: Event) => string)` to add custom information to the querystring.


## Short format

Provide a callback for the `crossDomainLinker` option to configure which links to decorate with the short `_sp` format. It should be a function taking one argument, the link element, that returns `true` if the tracker should decorate the link element and `false` otherwise.

### Decorate some links

For example, this function would only decorate those links whose destination is `http://acme.de/` or whose HTML ID is `crossDomainLink`:

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

You can also call the `crossDomainLinker` function directly:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('crossDomainLinker', function(linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
crossDomainLinker(function(linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```

  </TabItem>
</Tabs>


### Decorate all links

To decorate every link, regardless of its destination:

```javascript
{
  crossDomainLinker: function (linkElement) {
    return true;
  }
}
```

This will decorate "links" that are actually just JavaScript actions (with an `href` of `"javascript:void(0)"`), or links to email addresses or telephone numbers (`mailto:` or `tel:` schemes). To exclude these links, check them explicitly:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('crossDomainLinker', function(linkElement) {
  return linkElement.href.indexOf('javascript:') < 0;
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
crossDomainLinker(function(linkElement) {
  return linkElement.href.indexOf('javascript:') < 0;
});
```

  </TabItem>
</Tabs>

Alternatively, only count links that parse as web URLs by checking the link's [`hostname`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hostname). This should automatically exclude links that don't lead simply to other web pages.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('crossDomainLinker', function(linkElement) {
  return linkElement.hostname !== "";
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
crossDomainLinker(function(linkElement) {
  return linkElement.hostname !== "";
});
```

  </TabItem>
</Tabs>


### Opt-in and opt-out

Some of the examples will also decorate any links to the same site the user is currently on.

We recommend explicitly allowing the list of domains you want to decorate. Only decorate links that are on a different domain to the current page.

```javascript
{
  crossDomainLinker: function (linkElement) {
    return linkElement.hostname !== location.hostname;
  }
}
```

If you have a shared configuration deployed across multiple sites, you may want to combine the approaches:

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

Link decoration will only occur when links are to different sites within the list.

### Update event listeners

When the tracker loads it doesn't immediately decorate links. Instead, it adds event listeners to links which decorate them when a user clicks on them or navigates to them using the keyboard. This ensures that the timestamp added to the querystring is fresh.

If further links get added to the page after the tracker has loaded, you can use the tracker's `crossDomainLinker` method to add listeners again. Listeners won't be added to links which already have them.

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

## User IDs and shared pages

If a user clicks a cross-site link, and the tracker decorates the URL with their `domain_userid`, and then they share that URL, other users will also have the parameters when they visit the shared page. This could cause problems if you are using `domain_userid` as a user identifier.

You can choose to hide the parameter after the first event, e.g. page view, fires on the destination page. Because enrichment populates dedicated fields with the parameter, you won't need additional modeling to stitch the IDs. If the user copies the URL after the tracking code has fired, it may not include the `_sp` parameter and get copied to other users they share it with.

You can do this using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

The URL-updating code runs in a [callback](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#getting-user-id-once-set) to ensure it doesn't run before the page view event can capture the original URL.

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
