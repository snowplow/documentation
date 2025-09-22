---
title: "Define interventions"
sidebar_position: 25
description: "Configure and deploy interventions to trigger real-time actions based on user attribute changes in Snowplow Signals."
---

[Interventions](/docs/signals/concepts/index.md#interventions) are automated triggers that enable real-time actions based on user behavior.

There are three methods for defining interventions in Signals:
* BDP Console UI
* [Signals Python SDK](/docs/signals/define-interventions/using-python-sdk/index.md)
* [Signals API](/docs/signals/connection/index.md#signals-api)

To create an intervention using the UI, go to **Signals** > **Interventions** in Snowplow Console and follow the instructions.

The first step is to specify:
* A unique name
* An optional description
* The email address of the primary owner or maintainer

<!-- TODO image create intervention -->

Next, configure when the intervention should trigger.

## Criteria

Criteria are the conditional rules that determine when an intervention should trigger.

Defining intervention criteria has three steps:
1. Select which attribute to evaluate
2. Choose which logical operator to use
3. Enter the value to trigger on

<!-- TODO image select attribute etc -->

When adding more than one criteria, you can require all or any of them to be met.

<!-- TODO image 2 criteria -->

This intervention would trigger when either TODO describe screenshot intervention.

## Attribute keys

Define the intervention target scope by selecting [attribute keys](/docs/signals/concepts/index.md#attribute-keys).

By default, the intervention will target the attribute keys of the attribute groups defined in the criteria. Specify attribute keys here if you want different targets.

For example, choose `domain_userid` to target specific individual users, or `domain_sessionid` to target specific sessions. You can select multiple attribute keys.

<!-- TODO image add attribute keys -->

## Publishing the intervention

Once you're happy with your intervention configuration, click **Create intervention** to save it. It will be saved as a draft, and not yet available to Signals.

<!-- TODO image details page, not yet published -->

Click the **Edit** button if you want to make changes to the intervention.

To send the intervention configuration to your Signals infrastructure, click the **Publish** button. This will allow Signals to start evaluating attribute values.

### Versioning

Interventions are versioned. This allows you to iterate on the definitions without breaking downstream processes. All interventions start as `v1`. If you make changes to the definition, the version will be automatically incremented.

Within criteria, the attributes are always evaluated based on the latest published version of the attribute group.

## Deleting an attribute group

To unpublish or delete an intervention, click the 3 dots button on the details page.

<!-- TODO image details page button -->

Unpublishing is version specific. You can republish it later if needed. Choose **Delete** to permanently delete all versions of the intervention.
