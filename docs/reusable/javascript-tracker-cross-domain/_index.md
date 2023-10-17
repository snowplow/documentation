The JavaScript Tracker can add an additional parameter named “_sp” to the querystring of outbound links.
This process is called “link decoration”.
The `_sp` value includes the domain user ID for the current page and the time at which the link was clicked (according to the device's clock).
This makes these values visible in the “url” field of events sent by an instance of the JavaScript Tracker on the destination page.
The enrichment process will use these values to populate the `refr_domain_userid` and `refr_dvce_tstamp` fields for all events fired on the destination page where the URL includes the `_sp` parameter.

You can configure which links get decorated this way using the `crossDomainLinker` field of the configuration object.
The value should be a function taking one argument (the link element) and return `true` if the link element should be decorated and `false` otherwise.
For example, this function would only decorate those links whose destination is “[http://acme.de](http://acme.de/)” or whose HTML id is “crossDomainLink”:

```javascript
{
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  }
}
```

If you want to decorate every link to the domain github.com:

```javascript
{
  crossDomainLinker: function (linkElement) {
    return /^https:\/\/github\.com/.test(linkElement.href);
  }
}
```

If you want to decorate every link, regardless of its destination:

```javascript
{
  crossDomainLinker: function (linkElement) {
    return true;
  }
}
```

Note that the above will decorate “links” which are actually just JavaScript actions (with an `href` of `"javascript:void(0)"`), or links to email addresses or telephone numbers ([`mailto:`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address) or [`tel:`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_telephone_numbers) schemes).
To exclude these links, check them explicitly:

<>{ props.lang === "browser" && <>

```javascript
crossDomainLinker(function(linkElement) {
  return linkElement.href.indexOf('javascript:') < 0;
});
```
</>
}</>
<>{ props.lang === "javascript" && <>

```javascript
snowplow('crossDomainLinker', function(linkElement) {
  return linkElement.href.indexOf('javascript:') < 0;
});
```
</>
}</>

Alternatively, only count links that parse as web URLs by checking the link's [`hostname`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/hostname).
This should automatically exclude links that don't lead simply to other web pages.

<>{ props.lang === "browser" && <>

```javascript
crossDomainLinker(function(linkElement) {
  return linkElement.hostname !== "";
});
```
</>
}</>
<>{ props.lang === "javascript" && <>

```javascript
snowplow('crossDomainLinker', function(linkElement) {
  return linkElement.hostname !== "";
});
```
</>
}</>

:::note Opt-in vs opt-out

Some of the above examples will also decorate any links to the same site the user is currently on.
For most users we recommend explicitly allowing the list of domains you want to decorate, as well as ensuring that you only decorate links that are on a different domain to the current page.

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

This allows the same list of sites to be shared between each configuration, but link decoration will only occur when links are to different sites within the list.

:::

Note that when the tracker loads, it does not immediately decorate links.
Instead, it adds event listeners to links which decorate them as soon as a user clicks on them or navigates to them using the keyboard.
This ensures that the timestamp added to the querystring is fresh.

If further links get added to the page after the tracker has loaded, you can use the tracker’s `crossDomainLinker` method to add listeners again. (Listeners won’t be added to links which already have them.)

<>{ props.lang === "browser" && <>

```javascript
crossDomainLinker(function (linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```
</>
}</>
<>{ props.lang === "javascript" && <>

```javascript
snowplow('crossDomainLinker', function (linkElement) {
  return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
});
```
</>
}</>

:::caution Warning

If you enable link decoration, you should also make sure that at least one event is fired on the page.
Firing an event causes the tracker to write the `domain_userid` to a cookie.
If the cookie doesn’t exist when the user leaves the page, the tracker will generate a new ID for them when they return, rather than keeping the old ID.

:::

:::tip Reduce Shared Link Decoration URLs

If a user clicks a cross-site link and the URL is decorated with their `domain_userid`, and then they share that URL, other users will also have the parameters when they visit the shared page.

Because enrichment populates dedicated fields with the parameter, and it doesn't get persisted through the user's session (it is essentially only on the landing page), you can choose to hide the parameter after the first event (e.g. Page view) is fired on the destination page without needing additional modeling to stitch the IDs.
This means after the next page is tracked, if the user copies the URL after the tracking code has fired, it may not include the `_sp` parameter and get copied to other users they share it with.

You can do this using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).

<>{ props.lang === "browser" && <>

```javascript
trackPageView(); // page URL is https://example.com/?example=123&_sp=6de9024e-17b9-4026-bd4d-efec50ae84cb.1680681134458
if (/[?&]_sp=/.test(window.location.href)) {
  history.replaceState(history.state, "", window.location.replace(/&?_sp=[^&]+/, "")); // page URL is now https://example.com/?example=123
}
```
</>
}</>
<>{ props.lang === "javascript" && <>

The URL updating code runs in a [Tracker Callback](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/advanced-usage/tracker-information/index.md) to ensure it does not run before the page view event has a chance to capture the original URL.
```javascript
snowplow('trackPageView'); // page URL is https://example.com/?example=123&_sp=6de9024e-17b9-4026-bd4d-efec50ae84cb.1680681134458
snowplow(function(){
  if (/[?&]_sp=/.test(window.location.href)) {
    history.replaceState(history.state, "", window.location.replace(/&?_sp=[^&]+/, "")); // page URL is now https://example.com/?example=123
  }
});
```
</>
}</>

This approach can work with other parameters (e.g. `utm_source`) but it is not recommended unless you are sure other systems have also already captured the parameter values for their own systems.
Some systems may consider the URL update a single page application page change, and automatically fire additional page view events with this implementation, we suggest careful testing of this technique to ensure compatibility with your existing vendors.

:::
