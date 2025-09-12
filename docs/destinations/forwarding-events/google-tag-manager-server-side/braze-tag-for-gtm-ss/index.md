---
title: "Braze Tag for GTM SS"
description: "Forward behavioral events to Braze using Google Tag Manager Server-Side for personalized customer experiences."
schema: "TechArticle"
keywords: ["Braze GTM Tag", "Braze Integration", "Marketing Tag", "Customer Engagement", "GTM Braze", "Marketing Automation"]
date: "2022-01-17"
sidebar_position: 400
---

The Braze Tag for GTM SS allows events to be forwarded to [Braze](https://www.braze.com/). This Tag works best with the [Snowplow Client](/docs/destinations/forwarding-events/google-tag-manager-server-side/snowplow-client-for-gtm-ss/index.md), but can also work with other GTM SS Clients such as GAv4.

## Template installation

:::note

The server Docker image must be 2.0.0 or later.

:::

### Tag Manager Gallery

1. From the Templates tab in GTM Server Side, click "Search Gallery" in the Tag Templates section
2. Search for "Braze" and select the official "By Snowplow" tag
3. Click Add to Workspace
4. Accept the permissions dialog by clicking "Add"

### Manual Installation

1. Download [the template file](https://github.com/snowplow/snowplow-gtm-server-side-braze-tag/blob/main/template.tpl) `template.tpl` – Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select "Save Link As…"
2. Create a new Tag in the Templates section of a Google Tag Manager Server container
3. Click the More Actions menu, in the top right hand corner, and select Import
4. Import `template.tpl` downloaded in Step 1
5. Click Save

## Braze Tag Setup

With the template installed, you can now add the Braze Tag to your GTM SS Container.

1. From the Tag tab, select “New”, then select the Braze Tag as your Tag Configuration
2. Select your desired Trigger for the events you wish to forward to Braze.
3. Enter the required parameters and then optionally
4. [Configure the tag](/docs/destinations/forwarding-events/google-tag-manager-server-side/braze-tag-for-gtm-ss/braze-tag-configuration/index.md) to customize your Braze Tag.
5. Click Save
