---
title: "Braze Tag for GTM SS"
date: "2022-01-17"
sidebar_position: 400
---

The Braze Tag for GTM SS allows events to be forwarded to [Braze](https://www.braze.com/). This Tag works best with the [Snowplow Client](/docs/migrated/forwarding-events-to-destinations/forwarding-events/google-tag-manager-server-side/snowplow-client-for-gtm-ss/), but can also work with other GTM SS Clients such as GAv4.

## Template installation

### Tag Manager Gallery

**Coming Soon** - This tag is pending approval to be included in the GTM Gallery.

### Manual Installation

- Download [the template file](https://github.com/snowplow/snowplow-gtm-server-side-braze-tag/blob/main/template.tpl) `template.tpl` – Ctrl+S (Win) or Cmd+S (Mac) to save the file, or right click the link on this page and select "Save Link As…"
- Create a new Tag in the Templates section of a Google Tag Manager Server container
- Click the More Actions menu, in the top right hand corner, and select Import
- Import `template.tpl` downloaded in Step 1
- Click Save

## Braze Tag Setup

With the template installed, you can now add the Braze Tag to your GTM SS Container.

- From the Tag tab, select “New”, then select the Braze Tag as your Tag Configuration
- Select your desired Trigger for the events you wish to forward to Braze.
- Enter the required parameters and then optionally
- [Configure the tag](/docs/migrated/forwarding-events-to-destinations/forwarding-events/google-tag-manager-server-side/braze-tag-for-gtm-ss/braze-tag-configuration/) to customize your Braze Tag.
- Click Save
