---
title: "Managing forwarders"
description: "How to edit, rename, delete, and clone Snowplow event forwarders"
sidebar_position: 12
---

This page explains how to edit, clone, and delete event forwarders.

## Edit a forwarder

To edit a forwarder:

1. Go to **Destinations** > **Destination list**.
2. Click **Details** under the destination you want to change to open the destination details page.
3. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Edit**. You will see the forwarder configuration page.
4. Modify the forwarder configuration as needed. When you're done, select **Deploy** to re-deploy the forwarder with the updated configuration. The forwarder instances will be re-deployed on a rolling basis over the next few minutes.

## Rename a forwarder

To rename a forwarder:

1. Go to **Destinations** > **Destination list**.
2. Click **Details** under the destination you want to change to open the destination details page.
3. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Rename**.
4. Enter a new forwarder name and select **Rename** to save.

## Clone a forwarder

When creating a new forwarder, you can import the configuration from an existing forwarder of the same type. This is especially helpful when migrating a forwarder setup from a development pipeline to production.

To clone a forwarder:

1. Go to **Destinations** > **Destination list**.
2. Navigate to the **Available** tab and select **Configure** on the destination card from the list of available integrations to start setting up the forwarder.
3. Give the forwarder a **name**, select the **pipeline** you want the forwarder to read events from, and choose a **connection**.
4. From the **Import configuration from** dropdown, choose an existing forwarder.
5. Click **Continue**. The filters, mappings, and custom functions will be pre-populated with those of the existing forwarder you imported from.

## Delete a forwarder

To permanently delete a forwarder:

1. Go to **Destinations** > **Destination list**.
2. Click **Details** under the destination you want to change to open the destination details page.
3. On the event forwarders overview table, click the three dots next to the forwarder you want to change and select **Delete**.
4. On the confirmation modal, select **Delete**. This will start the process of destroying the underlying forwarder infrastructure.
