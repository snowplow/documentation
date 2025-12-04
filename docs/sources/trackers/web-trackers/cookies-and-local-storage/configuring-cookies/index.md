---
title: "Configuring cookie and storage settings for the web trackers"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow allows for a highly configurable cookie set up. This allows for you to create optimal first party tracking in a privacy-first world, including [anonymous](/docs/sources/trackers/web-trackers/anonymous-tracking/index.md) and cookieless tracking.

## Flow charts

In the PDF below you'll find a flow chart to help you with your cookie configuration, guiding you through the configuration options for both your [Snowplow Collector](/docs/api-reference/stream-collector/index.md) and the [Snowplow JavaScript Tracker](/docs/sources/trackers/web-trackers/index.md).

- [Cookie configuration for Snowplow CDI](pathname:///assets/config-calculator-snowplow-bdp.pdf)
- [Cookie configuration for Snowplow Self-Hosted](pathname:///assets/config-calculator-snowplow-ce.pdf)

## Cookie name

Set the cookie name for the tracker instance using the `cookieName` field of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md). The default is “_sp_“. Snowplow uses two cookies, a domain cookie and a session cookie. In the default case, their names are “_sp_id” and “_sp_ses” respectively. If you are upgrading from an earlier version of Snowplow, you should use the default cookie name so that the cookies set by the earlier version are still remembered. Otherwise you should provide a new name to prevent clashes with other Snowplow users on the same page.

Once set, you can retrieve a cookie name thanks to the `getCookieName(basename)` method where basename is `id` or `ses` for the domain and session cookie respectively. As an example, you can retrieve the complete name of the domain cookie with `getCookieName('id')`.

## Cookie domain

If your website spans multiple subdomains e.g.

- `www.mysite.com`
- `blog.mysite.com`
- `application.mysite.com`

You will want to track user behavior across all those subdomains, rather than within each individually. As a result, it is important that the domain for your first party cookies is set to ‘.mysite.com’ rather than ‘www.mysite.com’. By doing so, any values that are stored on the cookie on one of subdomain will be accessible on all the others.

Although it's possible to set this manually, we recommend that you enable automatic discovery and setting of the root domain, using the optional `discoverRootDomain` field of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md).
If it is set to `true` (the default), the tracker automatically discovers and sets the `configCookieDomain` value to the root domain.

:::note
If you have been setting this manually please note that the automatic detection does not prepend a ‘.’ to the domain. For example a root domain of “.mydomain.com” would become “mydomain.com”. This is because the library we use for setting cookies doesn’t care about the difference.

**This will then result in a different domain hash, so we recommend that if you have been setting this manually with a leading ‘.’ to continue to do so manually.**
:::

To set the domain manually, use the `cookieDomain` field of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md).
This will override the `discoverRootDomain` setting.

:::warning
In earlier versions, `discoverRootDomain` was disabled by default, and enabling it would cause it to ignore the `cookieDomain` setting, if set.

In v4 this is reversed: `discoverRootDomain` is now enabled by default, but will be ignored if `cookieDomain` is set.
When migrating from older versions, you may need to remove your `cookieDomain` configuration to maintain the earlier behavior.

If you want the earlier default behavior where no domain at all is used, leave `cookieDomain` unset and explicitly set `discoverRootDomain` to `false`.
:::

:::warning
Changing the cookie domain will reset all existing cookies. As a result, it might be a major one-time disruption to data analytics because all visitors to the website will receive a new `domain_userid`.
:::

## Cookie lifetime and duration

Whenever a tracker is initialized on your domain, it will set domain-specific visitor’s cookies. By default, these cookies will be active for 2 years. You can change this duration using the `cookieLifetime` [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md) parameter or `setVisitorCookieTimeout` method.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'cf', '{{COLLECTOR_URL}}', {
  cookieLifetime: 86400 * 31,
});
```

or

```javascript
snowplow('setVisitorCookieTimeout', 86400 * 30);  // 30 days
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('cf', '{{COLLECTOR_URL}}', {
  cookieLifetime: 86400 * 31,
});
```

or

```javascript
setVisitorCookieTimeout(86400 * 30);  // 30 days
```

  </TabItem>
</Tabs>

If `cookieLifetime` is set to `0`, the cookie will expire at the end of the session (when the browser closes). If set to `-1`, the first-party cookies will be disabled.

Whenever an event fires, the Tracker creates a session cookie. If the cookie didn’t previously exist, the Tracker interprets this as the start of a new session.

By default the session cookie expires after 30 minutes. This means that a user leaving the site and returning in under 30 minutes does not change the session. You can override this default by setting `sessionCookieTimeout` to a duration (in seconds) in the configuration object. For example,

```javascript
{
  ...
  sessionCookieTimeout: 3600
  ...
}
```

would set the session cookie lifespan to an hour.

## Cookie samesite and secure attributes

Set the cookie samesite attribute for the tracker instance using the `cookieSameSite` field of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md). The default is `None` for backward compatibility reasons, however `Lax` is likely a better option for most use cases given the reasons below. Valid values are "`Strict`", "`Lax`", "`None`" or `null`. `null` will not set the SameSite attribute.

It is recommended to set either "`None`" or "`Lax`". You must use "`None`" if using the tracker in a third party iframe. "`Lax`" is good in all other cases and must be used if not setting Secure to true.

:::note Safari 12 issue with SameSite cookies
It's been noted that Safari 12 doesn't persist cookies with `SameSite: None` as expected which can lead to rotation of the `domain_userid` from users using this browser. You should switch to `cookieSameSite: 'Lax'` in your tracker configuration to solve this, unless you are tracking inside a third party iframe.
:::

Set the cookie secure attribute for the tracker instance using the `cookieSecure` field of the configuration object. The default is "`true`". Valid values are "`true`" or "`false`".

It is recommended to set this to "`true`". This must be set to "`false`" if using the tracker on non-secure HTTP.

## Storage strategy

Three strategies are made available to store the Tracker’s state: cookies, local storage or no storage at all. You can set the strategy with the help of the `stateStorageStrategy` parameter in the configuration object to `“cookieAndLocalStorage”` (the default), `“cookie”`, `“localStorage”` or `“none”` respectively.

When choosing local storage, the Tracker will additionally store events in local storage before sending them so that they can be recovered if the user leaves the page before they are sent.

## Local storage queue size

Because most browsers limit local storage to around 5mb per site, you may want to limit the number of events the tracker will queue in local storage if they fail to send. The default is a max queue size of 1000, but you may wish to reduce this if your web application also makes use local storage. To do so, you should set the optional `maxLocalStorageQueueSize` field of the [configuration object](/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/index.md) is set to your desired value (e.g. 500).
