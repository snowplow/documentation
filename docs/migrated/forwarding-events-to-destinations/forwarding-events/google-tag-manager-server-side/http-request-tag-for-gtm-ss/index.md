---
title: "HTTP Request Tag for GTM SS"
date: "2022-01-06"
sidebar_position: 700
---

The HTTP Request Tag for GTM SS allows events to be forwarded to any JSON HTTP endpoint. This Tag works best with events from the Snowplow Client, but can also work with other GTM SS Clients such as GAv4.

## Template installation

### Tag Manager Gallery

- From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
- Search for “HTTP Request” and select the official “By Snowplow” tag
- Click "Add to Workspace"
- Accept the permissions dialog by clicking “Add”

### Manual Installation

- Download `template.tpl` – Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select "Save Link As…"
- Create a new Tag in the Templates section of a Google Tag Manager Server container
- Click the More Actions menu, in the top right hand corner, and select Import
- Import `template.tpl` downloaded in Step 1
- Click Save

## HTTP Request Tag Setup

With the template installed, you can now add the HTTP Request Tag to your GTM SS Container.

- From the Tag tab, select “New”, then select the HTTP Request Tag as your Tag Configuration
- Select your desired Trigger for the events you wish to forward to your custom destination.
- Enter your destination URL
- [Configure the tag](/docs/migrated/forwarding-events-to-destinations/forwarding-events/google-tag-manager-server-side/http-request-tag-for-gtm-ss/http-request-tag-configuration/) to construct the desired JSON request body
- Click Save
