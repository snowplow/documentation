---
title: "Quick start guide"
date: "2020-01-30"
sidebar_position: 0
---

Getting started with sending events using the JavaScript tracker is very similar to other web analytics vendors like Google Analytics, Adobe Analytics, etc.

The process involves the following high level steps:

- Download the latest version of the Snowplow JavaScript tracker file, `sp.js`, which can be found [here](https://github.com/snowplow/snowplow-javascript-tracker/releases).
- If you are already hosting static files somewhere on your own domain, it should just be a matter of downloading and adding the `sp.js` file. Otherwise you can follow our [guides for self hosting](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/self-hosting-the-javascript-tracker/), use another method of your choice, or leverage a [Third Party CDN](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/third-party-cdn-hosting/) (useful for evaluation or testing).
- Once you have a JS tracker available, you can add the tag snippet to your site. There are also alternative options described below for adding the tracker to your website.
  - If manually inserting the tag into your website or tag management solution: Snowplow BDP users can generate a tag snippet in the Snowplow BDP Console [here](https://console.snowplowanalytics.com/tag-generator). Other users can use and edit the standard tag [here](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/loading/).

```
 ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow")); 
```

- Once you’ve generated your tag add it to all the pages you’d like to track:
  - Place the tag directly into your codebase. Typically this will be placed into the `<head>` element of your page or in a similar, suitable, location if using a Single Page Application framework.
    - The JavaScript Tracker supports both synchronous and asynchronous tags. We recommend the asynchronous tags in nearly all instances, as these do not slow down page load times.
  - Load the tag using a Tag Management solution such as Google Tag Manager, usually triggered on page load.

- Configure an instance of the tracker by calling `newTracker` with your desired properties.

```
window.snowplow('newTracker', 'sp1', '{{collector_url}}', { 
  appId: 'my-app-id'
})
```

- Then you can use the track methods to send some events. You can send a Page View event to all initialised trackers with just:

```
window.snowplow('trackPageView');
```

- You can read more about the other tracking functions which are available in the JavaScript Tracker in the [v3 reference](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/) and [v2 reference](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/) documentation.

#### Alternative Options

Rather than adding the tag snippet directly, you may wish to use an alternative option for loading the JavaScript Tracker.

- Users of Google Tag Manager can use the [Snowplow Analytics Custom Template](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/google-tag-manager-custom-template/).

- Use the Snowplow Plugin in the [analytics npm package](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/snowplow-plugin-for-analytics-npm-package/) (JavaScript Tracker v2 only, v3 support soon).
