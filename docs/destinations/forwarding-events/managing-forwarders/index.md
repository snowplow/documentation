---
title: "Managing forwarders"
description: "How to edit, rename, delete, and clone Snowplow event forwarders"
sidebar_position: 12
---

This page explains how to edit, clone, and delete event forwarders. To start, go to **Destinations** > **Destination list** in [Snowplow Console](https://console.snowplowanalytics.com).

## Edit a forwarder

To edit a forwarder:

1. Click **Details** under the destination you want to change to open the destination details page.
2. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Edit**. You will see the forwarder configuration page.
3. Modify the forwarder configuration as needed. When you're done, select **Deploy** to re-deploy the forwarder with the updated configuration. The forwarder instances will be re-deployed on a rolling basis over the next few minutes.

## Rename a forwarder

To rename a forwarder:

1. Click **Details** under the destination you want to change to open the destination details page.
2. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Rename**.
3. Enter a new forwarder name and select **Rename** to save.

## Clone a forwarder

When creating a new forwarder, you can import the configuration from an existing forwarder of the same type. This is especially helpful when migrating a forwarder setup from a development pipeline to production.

To clone a forwarder:

1. Navigate to the **Available** tab and select **Configure** on the destination card from the list of available integrations to start setting up the forwarder.
2. Give the forwarder a **name**, select the **pipeline** you want the forwarder to read events from, and choose a **connection**.
3. From the **Import configuration from** dropdown, choose an existing forwarder.
4. Click **Continue**. The filters, mappings, and custom functions will be pre-populated with those of the existing forwarder you imported from.

## Delete a forwarder

To permanently delete a forwarder:

1. Click **Details** under the destination you want to change to open the destination details page.
2. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Delete**.
3. On the confirmation modal, select **Delete**. This will start the process of destroying the underlying forwarder infrastructure.
