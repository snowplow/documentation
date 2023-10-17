---
title: "JavaScript Trackers (web and Node.js)"
date: "2021-03-24"
sidebar_position: 100
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import {versions} from '@site/src/componentVersions';

<Badges badgeType="Actively Maintained"></Badges>
```

The Snowplow JavaScript Trackers support being used in a number of environments. There are three versions of the tracker.

### Web tracking
We have two flavours of web tracker: JavaScript and Browser.

- **JavaScript Tracker (v2 and v3)** for loading via tags, by adding code snippets to your website or Tag Manager solution.
- **Browser Tracker (v3)** for installation into web apps via npm. Popular when natively integrating tracking into React, Angular and Vue applications.

Find the documentation for both in the [Web trackers](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/index.md) section.

### Server-side tracking
Track events in server-side Node.js environments using the **Node.js Tracker (v3)**. Used via npm.

Find the documentation in the [Node.js tracker](docs/collecting-data/collecting-from-own-applications/javascript-trackers/node-js-tracker/index.md) section.

 ---

<p>All three trackers can be found on <a href="https://github.com/snowplow/snowplow-javascript-tracker">Github</a>. The current version is {versions.javaScriptTracker}.</p>

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
