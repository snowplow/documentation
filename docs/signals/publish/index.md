---
title: "Publish and manage Signals configuration"
sidebar_position: 60
sidebar_label: "Publish and manage"
description: "How attribute groups, interventions, services, and agentic contexts move from draft to published, how versions work, and what unpublishing and deleting do."
keywords: ["publish attribute groups", "publish interventions", "signals versioning", "unpublish", "signals lifecycle"]
date: "2026-11-06"
content_type: concept
pagination_next: signals/applications/services/index
---

Signals only acts on configuration that you've published. Until you publish an attribute group, Signals doesn't calculate its attributes, and until you publish an intervention, Signals doesn't check its criteria. This page explains the lifecycle that every Signals resource follows, how the resources depend on each other, and how to check a change after you publish it.

The steps are the same in Snowplow Console and the [Signals Python SDK](/docs/signals/connection/reference/index.md#python-sdk). In Console you use the **Publish**, **Edit**, **Unpublish**, and **Delete** actions on a resource's details page. With the SDK you call `publish()`, `unpublish()`, and `delete()`.

## Understand the publishing lifecycle

Attribute groups and interventions move through these stages:

1. **Draft**: in Console, a new resource is saved as a draft. You can edit it freely, and Signals ignores it.
2. **Test**: preview the result before it goes live. For attribute groups, [test the attribute definitions](/docs/signals/attributes/attribute-groups/index.md#test-attribute-definitions) against recent events in your warehouse. For interventions, run a [preview](/docs/signals/interventions/index.md#test-the-intervention).
3. **Publish**: send the configuration to your Signals infrastructure. Signals starts calculating attributes, syncing warehouse tables, or checking intervention criteria from this point. Stream attributes only include earlier events if you configured a [backfill](/docs/signals/attributes/attribute-groups/index.md#backfill-attributes).
4. **Update**: editing a published resource creates a new version and leaves the published version unchanged. In Console the version number increments automatically. With the SDK, increment `version` yourself.
5. **Unpublish**: stop one version without losing its definition. Calculated values stay in the Profiles Store, and you can publish the version again later.
6. **Delete**: permanently remove every version. Deleting an attribute group also removes its values from the Profiles Store. Unpublish an attribute group before you delete it.

## How each resource is published

Not every resource uses the full lifecycle. This table shows the differences.

| Resource | Drafts | Versioned | How it's published |
| --- | --- | --- | --- |
| [Attribute groups](/docs/signals/attributes/attribute-groups/index.md#publish-attribute-groups) | Yes | Yes | **Publish** in Console, or `publish()` |
| [Interventions](/docs/signals/interventions/index.md#publish-and-manage-the-intervention) | Yes | Yes | **Publish** in Console, or `publish()` |
| [Services](/docs/signals/applications/services/index.md) | No | No | Automatically, as soon as you create the service |
| [Agentic contexts](/docs/signals/agentic-contexts/index.md) | Yes | No | Publishing a draft replaces the single published agentic context with that name |
| [Direct interventions](/docs/signals/interventions/index.md#direct-interventions) | No | No | Sent as soon as you push them with the Python SDK or API |

## Dependencies between resources

Resources refer to each other, so a change to one can affect another:

* A service pins specific attribute group versions. To move an application to a new version of an attribute group, update the service definition. The application code doesn't change.
* Before you unpublish or delete an attribute group version that a service uses, update the service so it no longer refers to that version.
* Unpublishing or deleting an attribute group version that a published intervention uses also unpublishes the intervention.
* Intervention criteria always use the latest published version of the attribute group that contains each attribute. Publishing a new attribute group version that drops an attribute doesn't break the intervention: Signals keeps using the latest version that still has it.

## Use Signals with more than one pipeline

Each pipeline has its own Signals deployment. If you run separate pipelines, for example for development and production, each has its own attribute groups, services, and interventions. Signals doesn't copy or migrate configuration between deployments: to use the same configuration in another deployment, define and publish it there. Defining your configuration in code with the [Signals Python SDK](/docs/signals/connection/reference/index.md#python-sdk) lets you publish the same definitions to each deployment.

## Check a change after you publish

After you publish, confirm that Signals is doing what you expect:

* For a stream attribute group with backfill, the attribute group's details page in Console shows a **Backfill in progress** status bar until the historical values have synced
* [Retrieve the attributes](/docs/signals/applications/retrieve-attributes/index.md) for a known attribute key ID, such as your own `domain_sessionid`, and check the values
* For an intervention, [send a test intervention](/docs/signals/interventions/index.md#send-a-test-intervention) from Console to check that your subscribed application receives and handles it
