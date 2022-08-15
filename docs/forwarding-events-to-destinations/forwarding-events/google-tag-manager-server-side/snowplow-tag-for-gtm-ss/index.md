---
title: "Snowplow Tag for GTM SS"
date: "2021-11-24"
sidebar_position: 200
---

The [Snowplow Tag for GTM SS](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-server-side-tag) is most useful if using GTM SS as a Server Side Tag Manager for Snowplow JavaScript Tracker events, as you will want to ensure you forward these events to your Snowplow Collector. The Snowplow Tag will automatically forward any events the Snowplow Client receives once it has been configured with your Collector URL.

The Snowplow Tag can also construct Snowplow events from other GTM SS Clients such as GAv4.

## Template Installation

### Tag Manager Gallery

- From the Templates tab in GTM SS, click "Search Gallery" in the Tag Templates section
- Search for "Snowplow" and select the official "By Snowplow" tag
- Click Add to Workspace
- Accept the permissions dialog by clicking "Add"

## Snowplow Tag Setup

With the template installed, you can now add the Snowplow Tag to your GTM SS Container.

- From the Tag tab, select "New", then select the Snowplow Tag as your Tag Configuration
- Select your desired Trigger - If using the Snowplow JavaScript Tracker and Snowplow Client, you want to select "All Events"
- Enter your Snowplow Collector Endpoint, and confirm the Cookie Name matches that of your Collector
- Click Save

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/11/tagsetup.gif?w=1024)
