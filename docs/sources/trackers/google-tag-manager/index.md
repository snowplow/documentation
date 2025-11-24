---
title: "Google Tag Manager"
date: "2020-08-10"
sidebar_position: 135
---


```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

Using the Snowplow GTM custom templates you can deploy, implement, and configure the Snowplow [JavaScript tracker](/docs/sources/trackers/web-trackers/index.md) directly on the website using Google Tag Manager.

The main Tag template that you will need to use when setting up the JavaScript Tracker v4 in GTM is available in the [Tag Manager Template Gallery](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v4). To setup the Snowplow v4 Tag, you will also need the Snowplow v4 Settings Variable template. The templates you will need are:

1. [Snowplow v4](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v4):
  Load, configure, and deploy the Snowplow JavaScript tracker library. It supports the full functionality of the JavaScript SDK.
2. [Snowplow v4 Settings](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-variable-template-v4):
  A variable template which can be used to easily apply a set of tracker configuration parameters to tags created with the Snowplow v4 tag template.

For Ecommerce tracking, the [Snowplow Ecommerce Tag](https://github.com/snowplow/snowplow-gtm-tag-template-ecommerce-v3) is available on GitHub.
