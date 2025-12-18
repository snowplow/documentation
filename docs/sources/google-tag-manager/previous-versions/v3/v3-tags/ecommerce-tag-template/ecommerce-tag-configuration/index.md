---
title: "Ecommerce Tag Configuration"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Use the native Snowplow Ecommerce API or [transitional GA4/UA ecommerce adapter APIs](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) for existing dataLayer implementations using those formats. To get full value from the [Snowplow Ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) we recommend using the native API when possible.

![](images/01_ecommerce_api.png)

## Tracking Parameters

<Tabs groupId="ecommerceAPI" queryString>
  <TabItem value="sp" label="Snowplow Ecommerce" default>

![](images/02_sp_tracking_parameters.png)

#### Snowplow Ecommerce Function

In this section you can select the [Snowplow Ecommerce function](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) to use.

#### Snowplow Ecommerce Argument

In this textbox you can specify the argument to the ecommerce function. This can be a Variable that evaluates to a corresponding object.

#### Additional Tracking Parameters

**Add Custom Context Entities**

Use this table to attach [custom context entities](/docs/sources/web-trackers/tracking-events/index.md#custom-context) to the Snowplow event. Each row can be set to a Google Tag Manager variable that returns an array of custom contexts to add to the event hit.

**Set Custom Timestamp**

Set this to a UNIX timestamp in case you want to [override the default timestamp](/docs/sources/web-trackers/tracking-events/index.md#setting-the-true-timestamp) used by Snowplow.

  </TabItem>
  <TabItem value="ga4" label="GA4 Ecommerce">

![](images/02_ga4_tracking_parameters.png)

#### GA4 Ecommerce Function

In this section you can select the [Google Analytics 4 Ecommerce function](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) to use.

#### GA4 Ecommerce Arguments

**DataLayer ecommerce**

Here you can specify the dataLayer ecommerce variable to use, i.e. a variable that returns the `ecommerce` object itself.

**Options object**

Here you can specify a variable returning an object holding additional information for the ecommerce event (e.g. including `currency`, `finalCartValue`, `step`, etc).

  </TabItem>
  <TabItem value="ua" label="Universal Analytics Enhanced Ecommerce">

![](images/02_ua_tracking_parameters.png)

#### Universal Analytics Enhanced Ecommerce Function

In this section you can select the [Universal Analytics Enhanced Ecommerce function](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) to use.

#### Universal Analytics Enhanced Ecommerce Arguments

**DataLayer ecommerce**

Here you can specify the dataLayer ecommerce variable to use.

**Options object**

Here you can specify a variable returning an object holding additional information for the ecommerce event (e.g.including currency, finalCartValue, step etc).

  </TabItem>
</Tabs>

## Snowplow Tracker and Ecommerce Plugin Settings

![](images/04_tracker_plugin_settings.png)

### Tracker Settings

The Snowplow v3 Ecommerce tag template **requires** a Snowplow v3 Settings Variable to be setup. In this section you can select the Google Tag Manager variable of type [Snowplow v3 Settings](/docs/sources/google-tag-manager/previous-versions/v3/v3-settings-variable/index.md) to use.

### Plugin Settings

In this section you can select how the plugin will be added. The available options are:

- **jsDelivr**: To get the plugin URL from jsDelivr CDN. Choosing this option allows you to specify the plugin version to be used.
- **unpkg**: To get the plugin URL from unpkg CDN. Choosing this option allows you to specify the plugin version to be used.
- **Self-hosted**: To get the plugin library from a specified URL. This option requires a [Permission](https://developers.google.com/tag-platform/tag-manager/templates/permissions) change to allow injecting the plugin script from the specified URL.
- **Do not add**: To not add the plugin (e.g. when using a [Custom Bundle](/docs/sources/web-trackers/plugins/configuring-tracker-plugins/index.md) with the plugin already included)
