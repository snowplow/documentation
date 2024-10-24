---
title: "Creating a white-label build"
date: "2022-09-14"
sidebar_position: 4000
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Snowplow Tracker JavaScript Release"></Badges>
```


Every time the snowplow tracker loads on the page, a queue-like object `GlobalSnowplowNamespace` is initialised on the global window scope. This object is then used to queue commands before the tracker snippet (sp.js) has fully loaded.

In some cases, like two Snowplow instances on the same page from different sources or different tracker versions, there might be a need to separate this queue to avoid conflicts and tracking inconsistencies. To help you with this, we provide a custom build option for our JavaScript tracker that will produce loader tags (tag.js & tag.min.js) and tracker snippets (sp.js & sp.lite.js) utilising a custom namespace.

To create the _white-label_ build, as we call it, you need to follow the steps as shown below:

1. Clone the JavaScript repository `git clone git@github.com:snowplow/snowplow-javascript-tracker.git`
2. Go through the [Maintainer quick start](https://github.com/snowplow/snowplow-javascript-tracker#maintainer-quick-start) to setup the required tooling.
3. Change directory to the JavaScript tracker project `cd ./trackers/javascript-tracker`.
4. Run the custom white-label build command `rushx build --whitelabel=MyWhitelabel` replacing MyWhitelabel with the namespace you want. This will replace all references of `GlobalSnowplowNamespace` with `MyWhitelabel`.
5. If the build finished successfully, you can retrieve the updated loader files from the `tags` folder and the updated tracker files from the `dist` folder.

:::caution

Since the build depends on your local copy of the Snowplow JavaScript repository, make sure you keep up to date with the latest developments and updating your files and build accordingly.

:::