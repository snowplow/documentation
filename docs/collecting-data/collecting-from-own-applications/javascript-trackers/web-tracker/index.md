---
title: "Web trackers"
date: "2021-03-24"
sidebar_position: 100
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

Snowplow provides two web trackers to use depending how you wish to add analytics to your webapp.

The **JavaScript Tracker** is loaded via tag: add code snippets to your website or Tag Manager solution. Some plugins are included in the standard tag, but we also provide customization options.

The **Browser Tracker** is available via `npm` (`@snowplow/browser-tracker`) and can be directly bundled into your application. It supports core tracking methods out of the box and can be extended through plugins (`@snowplow/browser-plugin-*`). This tracker is often used when natively integrating tracking into React, Angular and Vue applications.

As the API is similar, we have combined the documentation for both trackers. We've marked the sections which are only relevant to one tracker or another.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
