---
title: "Google Tag Manager"
date: "2020-08-10"
sidebar_position: 3100
---


```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

Using the Snowplow GTM custom templates you can now deploy, implement, and configure the Snowplow JavaScript tracker directly on the website using Google Tag Manager.

The main Tag template that you will need to use when setting up the JavaScript Tracker v3 in GTM is available in the [Tag Manager Template Gallery](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v3). To setup the Snowplow v3 Tag, you will also need the Snowplow v3 Settings Variable template. The templates you will need are:


1. [Snowplow v3 Settings](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-variable-template-v3):
  A variable template which can be used to easily apply a set of tracker configuration parameters to tags created with the Snowplow v3 tag template.
2. [Snowplow v3](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-v3):
  Load, configure, and deploy the Snowplow JavaScript tracker library. It supports the full functionality of the JavaScript SDK.
