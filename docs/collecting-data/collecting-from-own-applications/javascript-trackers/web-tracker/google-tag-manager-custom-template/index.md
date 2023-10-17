---
title: "Using Google Tag Manager"
date: "2020-08-10"
sidebar_position: 3100
---


```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

Using the Snowplow GTM custom templates you can now deploy, implement, and configure the Snowplow JavaScript tracker directly on the website using Google Tag Manager, via a Custom Template. This is available in the [Tag Manager Template Gallery](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v3).

There are two templates that you will need to use when setting up the Template for JavaScript Tracker v3.

1. [Snowplow v3 Settings](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-variable-template-v3):
  A variable template which can be used to easily apply a set of tracker configuration parameters to tags created with the Snowplow v3 tag template.
2. [Snowplow v3](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v3):
  Load, configure, and deploy the Snowplow JavaScript tracker library. It supports the full functionality of the JavaScript SDK.
