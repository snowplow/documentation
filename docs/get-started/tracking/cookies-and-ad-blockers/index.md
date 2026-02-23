---
title: "Strong cookies and ad-blockers"
sidebar_label: "Cookies and ad-blockers"
description: "Configure first-party cookies and ad-blocker resilient tracking with Cookie Extension service and custom collector domains."
keywords: ["first-party cookies", "ad-blockers", "Cookie Extension", "ITP", "tracking resilience"]
---

This page details a few recommendations to set up your Snowplow tracking.
Their goal is to make sure that:

1. Your Web app has strong cookies to support persisting the Snowplow user and session identifiers.
2. The Snowplow tracking is resilient to ad-blockers.

## 1. Strong cookies for user and session identifiers

**Strategy 1: First party cookies**

As browsers [cut down on third-party cookies](https://snowplow.io/blog/privacy-updates-ad-blockers-and-first-party-tracking/), they are becoming less and less useful for storing user and session identifiers.
The alternative is to use first-party cookies.
Although first-party cookies don't allow sharing user and session identifiers across domains (they do let you share them across sub-domains), there are other alternative solutions for [cross-domain tracking](/docs/sources/web-trackers/cross-domain-tracking/index.md) that can be used in conjunction with first-party cookies.

Using Snowplow, you can set up your collector to be on the same domain as the website, which is the requirement for the use of first-party cookies.
To learn how to set up the collector domain, [visit this page](/docs/sources/first-party-tracking/index.md).

**Strategy 2: Snowplow Cookie Lifetime Extension service for Safari ITP**

As of Safari 16.4 released in April 2023, Safari sets the [lifetime of server-set cookies](https://webkit.org/tracking-prevention/#cname-and-third-party-ip-address-cloaking-defense) to a maximum of 7 days under some circumstances even if they are first-party cookies.
This greatly limits the effectiveness of tracking a customer journey where users are not regularly returning to your website.
In particular, it affects the `network_userid` identifier in Snowplow events.

Snowplow provides the Cookie Lifetime Extension service solution that fully mitigates the impact of this change.
Visit the [documentation for the Cookie Lifetime Extension service](/docs/sources/web-trackers/cookies-and-local-storage/cookie-extension/index.md) to learn more.

## 2. Mitigating the impact of ad-blockers

**Strategy 1: Custom POST path on the collector**

The recommended method for sending events to the Snowplow collector is using POST requests.
These requests are by default made to the `/com.snowplowanalytics.snowplow/tp2` path on the collector.
As many ad blockers will block this path, it is recommended to change the path.

To change the path, you will need to take the following steps (in this order):

1. Update the [Collector configuration](/docs/pipeline/collector/index.md) to support the new path _before_ you send events to it with this setting.
2. Provide the new path in the [`customPostPath` configuration in the tracker](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-post-path).

**Strategy 2: Rename sp.js file**

In case you are using the Snowplow JavaScript tracker using the `sp.js` file that you include using an HTML tag, it is advisable to rename this file to reduce the chance of ad-blockers preventing the script from loading.
You may rename the file to a random 8 character string, see the [recommendations here](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/self-hosting-the-javascript-tracker-aws/index.md).

In case you have a JavaScript app (e.g., built using React, Angular, Vue.js), consider installing the tracker using the NPM package.
This approach is more resilient against ad-blockers and advisable for single page apps.
See the [installation instructions here](/docs/sources/web-trackers/tracker-setup/index.md).

**Strategy 3: Server-side tracking**

Finally, the most robust solution against the impact of ad-blockers and other browser privacy measures is the use of server-side tracking.
Through server-side tracking, you will track events directly from your server app (e.g., in Python, Node.js, Ruby).
Server-side tracking works within first party context allowing you to build on top of the first-party cookies for user identification.

Snowplow provides tracker SDKs for all commonly used programming languages used in server-side apps (see the [full list here](/docs/sources/index.md)).
To learn more about server-side tracking using Snowplow, [visit this blog post](https://snowplow.io/blog/server-side-tracking-vs-client-side-tracking/).
