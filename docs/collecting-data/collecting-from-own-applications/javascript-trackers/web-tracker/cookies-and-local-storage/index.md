---
title: "Cookies and Local Storage"
sidebar_position: 3000
---

By default, the Snowplow JavaScript and Browser Tracker make use of Cookies and Local Storage. The behavior of each of these cookies and local storage keys are described here. The base name of each cookie can be configured by following these [instructions](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md).

# Cookies

Cookies are only stored if `stateStorageStrategy` is set to `cookie`, `cookieAndLocalStorage` (default) or if the deprecated tracker initialization argument `configUseCookies` is set to `true` (default). When using `cookieAndLocalStorage` this will prefer cookie storage for `_sp_id` and `_sp_ses`.

| Cookie Name | Expires                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _sp_id      | 2 years or `cookieLifetime` set on tracker initialization | Stores user information that is created when a user first visits a site and updated on subsequent visits. It is used to identify users and track the users activity across a domain. This cookie stores a unique identifier for each user, a unique identifier for the users current session, the number of visits a user has made to the site, the timestamp of the users first visit, the timestamp of their previous visit and the timestamp of their current visit, references to previous session and first event in the current session, and index of the last event in the session. |
| _sp_ses | 30 minutes or `sessionCookieTimeout` set on tracker initialization | Used to identify if the user is in an active session on a site or if this is a new session for a user (i.e. cookie doesn't exist or has expired).  
When using `anonymousTracking: { withSessionTracking: true }` (2.15.0+) this key will contain a _salt_ value which is used to stitch page views into a session. The value is never sent to the collector. |
| sp | 1 year or `collector.cookie.expiration` set in collector config | Stores a server-side collector generated unique identifier for a user that is sent with all subsequent tracking event events. Can be used as a first party cookie is the collector is on the same domain as the site. Can be disabled by setting `collector.cookie.enabled` to false (See [here](/docs/pipeline-components-and-applications/stream-collector/configure/index.md) for more information). |

`_sp_id` is stored in the format: `{domainUserId}.{createdTime}.{visitCount}.{nowTime}.{lastVisitTime}.{sessionId}.{previousSessionId}.{firstEventId}.{firstEventTsInMs}.{eventIndex}`. Please note that the last 4 parts of the cookie (`previousSessionId`, `firstEventId`, `firstEventTsInMs`, `eventIndex`) are only available since version 3.5 of the tracker.

# Local Storage

Local Storage will only be used if `stateStorageStrategy` is set to `localStorage`, `cookieAndLocalStorage` (default) or if the deprecated tracker initialization argument `configUseLocaStorage` is set to `true` (default). Both cookies listed above can be stored in local storage rather than as cookies by setting `stateStorageStrategy` to `localStorage`. Local storage can be disabled by setting `stateStorageStrategy` to `cookie` or `none`.

| Storage Key                                | Description                                                                                                                                                                                                                                                                        |
|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| snowplowOutQueue_{namespace}_post2         | Used to store a cache of unsent events. This is used to reduce the chance of events to be lost due to page navigation and events not being set to the collector before the navigation event occurs. Where GET requests are used, this key will end in `_get` rather than `_post2`. |
| snowplowOutQueue_{namespace}_post2.expires | Used to match the concept of cookie expiry within Local Storage. This ensures a consistent behavior between cookie and local storage. Where GET requests are used, this key will end in `_get` rather than `_post2`.                                                               |

# Mapping Values to Tracker Protocol

The values stored in the cookies listed above are mapped into the [tracker protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md) when events are sent to a Snowplow Collector.

The below table shows which parameters the cookie values map to:

| Request Parameter | Event Parameter   | Cookie Value        |
|-------------------|-------------------|---------------------|
| duid              | domain_userid     | _sp_id.domainUserId |
| nuid              | network_userid    | sp                  |
| vid               | domain_sessionidx | _sp_id.visitCount   |
| sid               | domain_sessionid  | _sp_id.sessionId    |

# Allowing users to Opt Out

The JavaScript tracker offers methods that allow the users to opt out of using cookies (and local storage in the case of _sp_id and _sp_ses).

- Anonymous tracking
- Respecting Do Not Track
- Set an opt out cookie

Read how to configure these [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md).

# Further Information

How the JavaScript tracker utilizes these cookies to store state as well as information on how to retrieve the values can be found below.
