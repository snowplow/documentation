---
title: Ecommerce Template
sidebar_position: 600
---

The Ecommerce Template is a separate Tag Template that can be added to your GTM workspace to track ecommerce events. This was done to keep the main Snowplow Tag Template a bit lighter, and for ease of tag management.

This template implements the [Snowplow Ecommerce plugin](/docs/sources/google-tag-manager/ecommerce-tag-template/index.md) for the Snowplow JavaScript tracker and can be used alongside either [v3](/docs/sources/google-tag-manager/previous-versions/index.md) or [v4](/docs/sources/google-tag-manager/index.md) of the Snowplow tag.



## Template Installation

### Tag Manager Template Gallery

Search for "Snowplow Ecommerce v3" in the [Tag Manager Template Gallery](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-tag-template-ecommerce-v3) and click `Add to Workspace`.

### Manual Installation

1. Download [template.tpl](https://github.com/snowplow/snowplow-gtm-tag-template-ecommerce-v3)
2. Create a new Tag template in the Templates section of your GTM container
3. Click the More Actions menu and select Import
4. Import the `template.tpl` file downloaded in Step 1
5. Click Save

## Tag Setup

With the template installed, you can now add the Snowplow Ecommerce Tag to your GTM Container.

1. From the Tag tab, select `New`, then select the Snowplow Ecommerce Tag as your tag type
2. Select your desired Trigger for the ecommerce events you want to track
3. [Configure the Tag](/docs/sources/google-tag-manager/ecommerce-tag-template/configuration/index.md)
4. Click Save
