---
title: "Manage enrichments in Console"
sidebar_position: 30
sidebar_label: "Managing enrichments"
description: "Enable, configure, and deploy enrichments for your pipelines using Snowplow Console UI."
keywords: ["manage enrichments", "enable enrichments", "enrichment configuration"]
---

Snowplow Console enables you to manage enrichments that run on each of your pipelines and sandboxes.

## Recommended workflow

You can enable and edit enrichments on any pipeline, but we recommend the following workflow to test the configuration before deploying it:

- Navigate to a sandbox (Snowplow Mini)
- Enable and configure the Enrichment as required
- Send some events to your Snowplow Mini endpoint and validate the fields appear as expected in the event payload
- Deploy the configuration to your pipeline(s)

Alternatively, you can use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to test your changes locally.

:::warning

Invalid enrichment changes can halt data processing in the pipeline. For example, an enrichment might be pointing to a non-existend database file, or the JavaScript code in the JavaScript enrichment might have typos. This is why we recommend testing in a low-risk enrivonment first.

:::

## Configuring an enrichment

Navigate to the pipeline or sandbox where you would like to change the enrichment. Open the **Enrichments** tab. You will see a listing of all enrichments and their current status (enabled or disabled).

Click on the enrichment you want to change. You will see the current configuration if the enrichment is enabled, and the default one if it's disabled. For each enrichment, the reference on the configuration format is linked in the top navigation bar.

* To enable or edit the enrichment, click on **Edit configuration**. Adjust the configuration and click **Publish** to deploy the changes. If the enrichment was disabled, it will be enabled at this point.
* To disable the enrichment, click on the **⋮** menu and select **Disable**.

## Deploying an enrichment from a sandbox to a pipeline

If you followed the recommended workflow to test an enrichment in a sandbox enrironment (Snowplow Mini), you will need to copy the same configuration into a pipeline.

To do that, navigate to the sandbox, select the **Enrichments** tab and click on the enrichment in question. Then click **Deploy**, select the desired pipeline and click **Deploy configuration**.
