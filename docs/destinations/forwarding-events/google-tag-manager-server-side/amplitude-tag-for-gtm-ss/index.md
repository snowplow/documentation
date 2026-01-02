---
title: "Amplitude Tag for GTM Server Side"
sidebar_label: "Amplitude Tag for GTM SS"
date: "2021-11-24"
sidebar_position: 300
description: "Forward Snowplow events to Amplitude from GTM Server Side using the Amplitude Tag with HTTP API v2 for product analytics and user tracking."
keywords: ["Amplitude Tag", "GTM SS Amplitude", "product analytics", "HTTP API v2"]
---

The [Amplitude Tag for GTM SS](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-server-side-amplitude-tag) allows events to be forwarded to Amplitude. This Tag works best with events from the Snowplow Client, but can also construct Amplitude events from other GTM SS Clients such as GAv4.

The tag is designed to work best with Self Describing Events, and atomic events, from a Snowplow Tracker, allowing for events to automatically merged into an Amplitude events properties. Additionally, any other client event properties can be included within the event properties or user properties of the Amplitude event.

## Template Installation

:::note

The server Docker image must be 2.0.0 or later.

:::

### Tag Manager Gallery

1. From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
2. Search for “Amplitude HTTP API V2” and select the official “By Snowplow” tag
3. Click Add to Workspace
4. Accept the permissions dialog by clicking “Add”

## Amplitude Tag Setup

With the template installed, you can now add the Amplitude Tag to your GTM SS Container.

1. From the Tag tab, select "New", then select the Amplitude Tag as your Tag Configuration
2. Select your desired Trigger for the events you wish to forward to Amplitude
3. Enter your Amplitude API Key for a HTTP API integration. This can be retrieved from Amplitude Data Sources within your Amplitude project.
4. Click Save
