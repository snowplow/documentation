---
title: "Android - Google Play Data Safety"
date: "2021-11-24"
sidebar_position: 500
---

Google Play is launching a new Data safety section to help app developers showcase their app’s overall safety. The section, to be displayed on each app’s store listing page, will summarize the app’s privacy and security practices, as well as explain the data the app may collect and share from users (and why).

To comply with this new requirement, app developers will need to complete a [new Data safety form in Play Console](https://youtu.be/pNAS_0IcHtM) that asks them to disclose how any first-party and third-party code (such as third-party libraries or SDKs) in their apps collect and share such data.

Google Play team published several resources to help app developers navigate this new requirement:

- A [Help Center article](https://notifications.google.com/g/p/AD-FnEzpM5OIRR9qJ0cLnuIwMUN4WlfZCYSLvasCsNu4xihuMgCDuPxTmZbi2LfHb_mZOcWdLEIs2EZ-oPJRd30cgIbtR-PNHP0lGpUFlgjixAf_eW-8JfoVcgh5lkaOEzwq4xPJjGCz1h90GXY) with policy guidance for app developers.
- An [Android Developers guide](https://notifications.google.com/g/p/AD-FnEyRmAjHbFOlf4uK4pt5SWZ45hcuBi-at_hyCBVLgiNCd3UjAGFtKrKmxsPKIDTyHYFGf4QLjU4sY46_Rp-XBZHy6LnInPiV9ZW7hB8MSWsNOXz_P9u4LV0T5JfG0mGWHw) to help app developers review how their app collects, protects and shares data.
- A [Play Academy course](https://notifications.google.com/g/p/AD-FnEwkvMQvGbxZvh5t6QOkS6Onk77dUNH4xO2t9EnJVQIZDqnP6Hq7Va337l4fGm6NPcap_GSXBSfmAkWgR-xdHNNWwI9TX9D1agSbiTVg87aVsI_m2-rOnqWf8bBom8poRMlEQGg3IujfPRctUuJEp2lvSqL6re2NCMbbVEBJlPvQqXtEjQwHpxXpGE71TEuAwIW5fHTXJz4VlbQo-GQhcx29Q4g3YxXGDScUgg) that explains how various example apps should fill out the form.

In particular, [in this table](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en#in_play_console) are the data that the developers need to disclose in the Data safety form.

## Key dates to be aware of

- **Starting October 18:** App developers will start to see the Data safety section form in Play Console and are asked to start to complete and submit for review.
- **February 2022:** Users will start to see the Data safety section on app Store listing for apps with completed and approved form submissions.
- **April 2022:** New app submissions and app updates will be rejected in Play Console if there are unresolved issues with the app developer’s form
- **After April 2022:** Play may take further enforcement actions against non-compliant apps according to Play’s developer policy, including removal from the store.

## Guidance for Snowplow Android Tracker users

To assist developers in helping build user data and security transparency, the guidance below can be used to publish SDK guidance for developers incorporating our Snowplow Android Tracker into their apps.

The developer will be asked to provide information for various [data types](https://support.google.com/googleplay/android-developer/answer/10787469#zippy=%2Cdata-types).

The Android Snowplow Tracker can be fully configured by the developer in order to track only the data that really matters. Much of the functionality of the tracker and the automatically tracked events are optional and they can be specifically configured at compile-time and at runtime. All the data tracked by the tracker is under the developers control and is only sent to a pipeline provided by the customer. Snowplow can’t access any of the data tracked by the tracker.

Below the details of the data trackable with the Snowplow Android Tracker:

<table><tbody><tr><td>Category</td><td>Data type</td><td>Description</td><td>Snowplow Android TrackerFeature</td></tr><tr><td>Location</td><td>Approximate location</td><td>User or device physical location to an area greater than or equal to 3 square kilometers, such as the city a user is in, or location provided by Android’s ACCESS_COARSE_LOCATION permission.</td><td>✅ Geolocation context(optional and <strong>disabled</strong> by default in TrackerConfiguration geoLocationContext)</td></tr><tr><td></td><td>Precise location</td><td>User or device physical location within an area less than 3 square kilometers, such as location provided by Android’s ACCESS_FINE_LOCATION permission.</td><td></td></tr><tr><td>App activity</td><td>Page views and taps in app</td><td>Information about how a user interacts with your app. For example, the number of page views or the screen coordinates of taps.</td><td>✅ ScreenView automatic tracking(optional but enabled by default in TrackerConfiguration screenViewAutotracking)</td></tr><tr><td></td><td>In-app search history</td><td>Information about what a user has searched for in your app.</td><td>❌</td></tr><tr><td></td><td>Installed apps</td><td>Information about the apps installed on a user's device.</td><td>❌</td></tr><tr><td></td><td>Other user-generated content</td><td>Any other user-generated content not listed here, or in any other section. For example, user bios or notes.</td><td>❌</td></tr><tr><td></td><td>Other actions</td><td>Any other user activity or actions in-app not listed here such as gameplay and likes.</td><td>✅ Session automatic tracking(optional but enabled by default in TrackerConfiguration sessionContext)<br/>✅ Background-Foreground transition tracking(optional but enabled by default in TrackerConfiguration lifecycleAutotracking)</td></tr><tr><td>Web browsing</td><td>Web browsing history</td><td>Information about the websites a user has visited.</td><td>❌</td></tr><tr><td>App info and performance</td><td>Crash logs</td><td>Crash log data from your app. For example, the number of times your app has crashed, stack traces, or other information directly related to a crash.</td><td>✅ Crash reporting automatic tracking(optional but enabled by default in TrackerConfiguration exceptionAutotracking)</td></tr><tr><td></td><td>Diagnostics</td><td>Information about the performance of your app. For example battery life, loading time, latency, framerate, or any technical diagnostics.</td><td>✅ Platform context&nbsp;(optional but enabled by default in TrackerConfiguration platformContext)</td></tr><tr><td></td><td>Other app performance data</td><td>Any other app performance data not listed here.</td><td>❌</td></tr><tr><td>Device or other identifiers</td><td>Device or other identifiers</td><td>Identifiers that relate to an individual device, browser or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier.</td><td>✅ Advertising identifier (AAID, also called IDFA) (optional but it requires TrackerConfiguration platformContext which is enabled by default, a dependency with com.google.android.gms:play-services-ads and a <a href="https://ads-developers.googleblog.com/2018/10/announcing-v1700-of-android-google.html">tag</a> on androidManifest.xml)</td></tr></tbody></table>

Note: The IP address of the device can be tracked by the collector. The Snowplow Android Tracker can’t disable the collector IP tracking from the client app.
