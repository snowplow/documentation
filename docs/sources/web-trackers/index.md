---
title: "Web tracker SDKs"
sidebar_label: "Web trackers"
description: "Track user behavior on websites using the JavaScript tracker or Browser tracker with flexible plugins and tracking methods."
keywords: ["javascript tracker", "browser tracker", "web tracking", "npm package"]
date: "2021-03-24"
sidebar_position: 100
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import {versions} from '@site/src/componentVersions';

<Badges badgeType="Actively Maintained"></Badges>
```

Snowplow provides two web trackers to use depending how you wish to add analytics to your webapp.

The **JavaScript tracker** is loaded via tag: add code snippets to your website or Tag Manager solution. Some plugins are included in the standard tag, but we also provide customization options.

The **Browser tracker** is available via `npm` (`@snowplow/browser-tracker`) and can be directly bundled into your application. It supports core tracking methods out of the box and can be extended through plugins (`@snowplow/browser-plugin-*`). This tracker is often used when natively integrating tracking into React, Angular and Vue applications.

As the API is similar, we have combined the documentation for both trackers. We've marked the sections which are only relevant to one tracker or another.

The JavaScript and Browser tracker, along with the [Node.js](/docs/sources/node-js-tracker/index.md) tracker, are part of [one monorepo](https://github.com/snowplow/snowplow-javascript-tracker). <p>The current version is {versions.javaScriptTracker}.</p>
