---
title: "Snowplow Client for GTM SS"
date: "2021-11-24"
sidebar_position: 100
---

To receive events in your GTM SS container, the Snowplow Client must be installed. This works for both events direct from the tracker, or enriched events from the pipeline.

The Snowplow Client populates the common event data so many GTM SS tags will just work, however it also populates a set of additional properties to ensure the rich Snowplow event data is available to Tags which wish to take advantage of this, such as the Snowplow Authored Tags.

## Template Installation

There are two methods to install the Snowplow Client.

### Tag Manager Gallery

**Coming Soon.** The Gallery for Clients has not yet been made public.

### Manual Installation

- Download [template.tpl](https://raw.githubusercontent.com/snowplow/snowplow-gtm-server-side-client/main/template.tpl) - Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select "Save Link As..."
- Create a new Client in the Templates section of a Google Tag Manager Server container
- Click the More Actions menu, in the top right hand corner, and select Import
- Import `template.tpl` downloaded in Step 1
- Click Save

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/11/manualclientinstall.gif?w=1024)

## Snowplow Client Setup

With the template installed, you can now add the Snowplow Client to your GTM SS Container.

- From the Clients tab, select "New", then select the Snowplow Client as your Client Configuration
- Click Save

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/11/clientsetup.gif?w=1024)
