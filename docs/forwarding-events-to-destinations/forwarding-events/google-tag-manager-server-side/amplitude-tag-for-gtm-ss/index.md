---
title: "Amplitude Tag for GTM SS"
date: "2021-11-24"
sidebar_position: 300
---

The [Amplitude Tag for GTM SS](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-server-side-amplitude-tag) allows events to be forwarded to Amplitude. This Tag works best with events from the Snowplow Client, but can also construct Amplitude events from other GTM SS Clients such as GAv4.

The tag is designed to work best with Self Describing Events, and atomic events, from a Snowplow Tracker, allowing for events to automatically merged into an Amplitude events properties. Additionally, any other client event properties can be included within the event properties or user properties of the Amplitude event.

## Template Installation

### Tag Manager Gallery

- From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
- Search for “Amplitude HTTP API V2” and select the official “By Snowplow” tag
- Click Add to Workspace
- Accept the permissions dialog by clicking “Add”

## Amplitude Tag Setup

With the template installed, you can now add the Amplitude Tag to your GTM SS Container.

- From the Tag tab, select "New", then select the Amplitude Tag as your Tag Configuration
- Select your desired Trigger for the events you wish to forward to Amplitude
- Enter your Amplitude API Key for a HTTP API integration. This can be retrieved from Amplitude Data Sources within your Amplitude project.
- Click Save
