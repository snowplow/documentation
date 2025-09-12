---
title: "HTTP Request Tag for GTM SS"
description: "Configure HTTP request tags in Google Tag Manager Server-Side for behavioral event forwarding workflows."
schema: "TechArticle"
keywords: ["GTM HTTP Tag", "Server Side", "HTTP Request", "Tag Manager", "GTM Integration", "Server Side Tags"]
date: "2022-01-06"
sidebar_position: 700
---

The HTTP Request Tag for GTM SS allows events to be forwarded to any JSON HTTP endpoint. This Tag works best with events from the Snowplow Client, but can also work with other GTM SS Clients such as GAv4.

## Template installation

:::note

The server Docker image must be 2.0.0 or later.

:::

### Tag Manager Gallery

1. From the Templates tab in GTM Server Side, click “Search Gallery” in the Tag Templates section
2. Search for “HTTP Request” and select the official “By Snowplow” tag
3. Click "Add to Workspace"
4. Accept the permissions dialog by clicking “Add”

### Manual Installation

1. Download `template.tpl` – Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select "Save Link As…"
2. Create a new Tag in the Templates section of a Google Tag Manager Server container
3. Click the More Actions menu, in the top right hand corner, and select Import
4. Import `template.tpl` downloaded in Step 1
5. Click Save

## HTTP Request Tag Setup

With the template installed, you can now add the HTTP Request Tag to your GTM SS Container.

1. From the Tag tab, select “New”, then select the HTTP Request Tag as your Tag Configuration
2. Select your desired Trigger for the events you wish to forward to your custom destination.
3. Enter your destination URL
4. [Configure the tag](/docs/destinations/forwarding-events/google-tag-manager-server-side/http-request-tag-for-gtm-ss/http-request-tag-configuration/index.md) to construct the desired JSON request body
5. Click Save
