---
title: "Hosting the JavaScript Tracker"
date: "2021-03-24"
sidebar_position: 2900
---

We recommend self-hosting the Snowplow JavaScript tracker, `sp.js`, as it has some definite advantages over using a third-party-hosted JavaScript:

1. Hosting your own JavaScript allows you to use your own JavaScript minification and asset pipelining approach (e.g. bundling all JavaScripts into one minified JavaScript)
2. As [Douglas Crockford](https://github.com/douglascrockford) put it about third-party JavaScripts: _“it is extremely unwise to load code from servers you do not control.”_
3. Renaming `sp.js` will ensure that Snowplow continues to function in the presence of ad/content blockers, which typically block `sp.js` (see e.g. [EasyPrivacy](https://easylist-downloads.adblockplus.org/easyprivacy.txt))

Below are guides for hosting the minified `sp.js` asset on Amazon Web Services and Google Cloud Platform. This is our recommended strategy for self hosting however there are other options available to self hosting `sp.js`, you may choose to bundle it into your application directly or host with a different provider as two examples.

The latest minified version of the Snowplow JavaScript Tracker, called `sp.js`, is available from the [JavaScript Tracker GitHub releases](https://github.com/snowplow/snowplow-javascript-tracker/releases).
If you don't need all the functionality included in `sp.js`, there is also a `sp.lite.js` bundle for v3 that includes [fewer plugins](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/index.md).
For more custom requirements, you can [build your own v3 bundle](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/configuring-tracker-plugins/javascript/index.md) using your own selection of plugins, which is only an option if you are self-hosting.
