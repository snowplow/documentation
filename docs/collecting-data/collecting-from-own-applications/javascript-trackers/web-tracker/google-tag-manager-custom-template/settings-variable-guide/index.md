---
title: "Settings guide"
date: "2021-11-18"
sidebar_position: 300
---

The **Snowplow v3 Settings** custom variable template is meant to be used with the Snowplow v3 tag template.

With this template, you can compile a **tracker configuration object**, which you can then load into your Snowplow tags to avoid the need to manually enter the same tracker settings across all your tags.

## Install the template

To **install the template**, browse to **Templates** in the Google Tag Manager user interface.

Under **Variable Templates**, click **Search Gallery**, and type `Snowplow v3` into the gallery overlay search bar.

![search Snowplow v3 Settings in GTM gallery](images/search_snowplow_v3_settings.png)

Click the **Snowplow v3 Settings** template name, and then click **Add to Workspace** in the next screen. Review the permissions and click **Add** to finalize the import.

After importing the template, you can follow the normal process of creating a **new variable** in Google Tag Manager, and the **Snowplow v3 Settings** template will be listed among the **Custom** variable types you can choose from.

## Instructions

The fields in the template provide a UI for setting the tracker configuration parameters. You are thus encouraged to follow [this link](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md) to understand what each individual field does.

### Tracker Name

It is important to set the **tracker name**. The reason you might have more than one tracker name generated on the site is if you have different configuration objects or tracking endpoints to which you want to send commands.

When the tag runs, it first checks if a tag with this name has already been initialized. If it has, it then proceeds to send the command to this tracker name. If a tracker with this name has _not_ been initialized, a new tracker is initialized with the tracker configuration from this settings variable.

This means that a tracker configuration is applied **only once** to the tracker. Thus if you have more than one tag running on the site, each with the same tracker name but different tracker configurations, only the configuration of the tag that fires _first_ will be applied to the tracker.

### Collector Endpoint Hostname

This needs to be set to the hostname/domain (e.g. `sp.domain.com`) on which you’ve [configured](/docs/collecting-data/configuring-collector/index.md) your Snowplow Collector.

## Acknowledgements

Thanks to [Simo Ahava](https://www.simoahava.com/) for building the intial release of this template.
