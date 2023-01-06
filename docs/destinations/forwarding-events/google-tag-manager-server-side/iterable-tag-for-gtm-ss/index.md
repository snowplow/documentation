---
title: "Iterable Tag for GTM SS"
date: "2021-11-24"
sidebar_position: 500
---

The Iterable Tag for GTM SS allows events to be forwarded to Iterable. This Tag works best with events from the Snowplow Client, but can also construct Iterable events from other GTM SS Clients such as GAv4.

The tag is designed to work best with Self Describing Events, and atomic events, from a Snowplow Tracker, allowing for events to automatically be converted into an Iterable events, include Iterable Identity events. Additionally, any other client event properties can be included within the event properties or user properties of the Iterable event.

## Template Installation

There are two methods to install the Iterable Tag.

### Tag Manager Gallery

- From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
- Search for “Iterable” and select the official “By Snowplow” tag
- Click Add to Workspace
- Accept the permissions dialog by clicking “Add”

### Manual Installation

- Download [template.tpl](https://raw.githubusercontent.com/snowplow/snowplow-gtm-server-side-iterable-tag/main/template.tpl) - Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select “Save Link As…”
- Create a new Tag in the Templates section of a Google Tag Manager Server container
- Click the More Actions menu, in the top right hand corner, and select Import
- Import `template.tpl` downloaded in Step 1
- Click Save

## Iterable Tag Setup

With the template installed, you can now add the Iterable Tag to your GTM SS Container.

- From the Tag tab, select "New", then select the Iterable Tag as your Tag Configuration
- Select your desired Trigger for the events you wish to forward to Iterable
- Enter your Iterable API Key for a Standard Server Side integration. This can be generated from Iterable "Integrations -> API Keys" settings page
- Click Save
