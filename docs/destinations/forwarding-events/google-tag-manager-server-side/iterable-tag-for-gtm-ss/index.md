---
title: "Iterable Tag for GTM Server Side"
sidebar_label: "Iterable Tag for GTM SS"
date: "2021-11-24"
sidebar_position: 500
description: "Forward Snowplow events to Iterable from GTM Server Side using the Iterable Tag for cross-channel marketing automation and customer engagement."
keywords: ["Iterable Tag", "GTM SS Iterable", "marketing automation", "customer engagement"]
---

The Iterable Tag for GTM SS allows events to be forwarded to Iterable. This Tag works best with events from the Snowplow Client, but can also construct Iterable events from other GTM SS Clients such as GAv4.

The tag is designed to work best with Self Describing Events, and atomic events, from a Snowplow Tracker, allowing for events to automatically be converted into an Iterable events, include Iterable Identity events. Additionally, any other client event properties can be included within the event properties or user properties of the Iterable event.

## Template Installation

:::note

The server Docker image must be 2.0.0 or later.

:::

There are two methods to install the Iterable Tag.

### Tag Manager Gallery

1. From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
2. Search for “Iterable” and select the official “By Snowplow” tag
3. Click Add to Workspace
4. Accept the permissions dialog by clicking “Add”

### Manual Installation

1. Download [template.tpl](https://raw.githubusercontent.com/snowplow/snowplow-gtm-server-side-iterable-tag/main/template.tpl) - Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select “Save Link As…”
2. Create a new Tag in the Templates section of a Google Tag Manager Server container
3. Click the More Actions menu, in the top right hand corner, and select Import
4. Import `template.tpl` downloaded in Step 1
5. Click Save

## Iterable Tag Setup

With the template installed, you can now add the Iterable Tag to your GTM SS Container.

1. From the Tag tab, select "New", then select the Iterable Tag as your Tag Configuration
2. Select your desired Trigger for the events you wish to forward to Iterable
3. Enter your Iterable API Key for a Standard Server Side integration. This can be generated from Iterable "Integrations -> API Keys" settings page
4. Click Save
