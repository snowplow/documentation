---
title: "Plan source applications"
date: "2020-02-15"
sidebar_position: 20
sidebar_label: "Plan source applications"
description: "Decide which source applications to register in Event Studio, which application IDs and application entities each one has, and how they connect to tracking plans and event specifications."
keywords: ["source applications", "app id", "application entities", "global context", "data sources"]
content_type: concept
---

A source application is an independently deployable application that sends events, such as a web application, an Android application, or an iOS application.

:::tip[Treat each deployable application as a source application]
Thinking of a source application as an independently deployable application system covers most cases. It lets you manage changes to the available application entities, and keep them as close as possible to the current data state.
:::

For example, Snowplow has several applications designed for distinct purposes. Each is a separate source of behavioral data, so each is a source application:

* The Snowplow website that corresponds to the application served under `www.snowplow.io`
* The Console application that is served under `console.snowplowanalytics.com`
* The documentation website serving as the information hub for all things related to the product, served under `docs.snowplow.io`

Source applications connect application IDs and [application entities](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md) to [tracking plans](/docs/event-studio/tracking-plans/index.md).

## Application IDs

Each source application should have a unique application ID to distinguish it in analysis. For each of these applications you would set up a unique application ID using the [`app_id`](/docs/events/ootb-data/app-information/index.md#application-atomic-event-properties) field to distinguish them later on in analysis.

:::tip[Use one application ID per environment]
Snowplow often sees, and recommends as a best practice, setting up a unique application ID for each deployment environment you are using. For example, `${appId}-qa` for staging and `${appId}-dev` for development environments.
:::

## Application entities

Application entities, also referred to as [global context](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md), are a set of entities that can be sent with every event recorded in the application. Using source applications you can document which application entities are expected. This is useful for tracking implementation, data discovery, and preventing information duplication in tracking plans.

:::info[Conditional application entities]
Since application entities can also be set conditionally, you can mark any of them as optional with a note to better understand the condition or any extra information required. The method for conditionally adding an application entity is through [rulesets](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#rulesets), [filter functions](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#filter-functions) and [context generators](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#context-generators).
:::

## How source applications connect to tracking plans

A tracking plan references one or more source applications. You connect them when you [create or edit a tracking plan](/docs/event-studio/tracking-plans/create-and-manage/index.md). When you connect a source application to a tracking plan, every event specification in the plan:

* Inherits the expected application IDs from the source application, so you can be sure that an event specification is fired in all the environments it needs to
* References the application entity data structures that are expected with each event, which prevents duplicate information and shows which entities are available in addition to the event specification's own entities

Source applications don't affect which events match an event specification. [Event specification inference](/docs/event-studio/tracking-plans/event-specification-inference/index.md) doesn't match on `appId`, source applications, environment, or any other source attribute.

The **Tracking summary** tab of each event specification lists the application IDs that sent events for it. A yellow warning status means that an application ID sent events, but doesn't belong to any source application of that version of the specification. This usually means that an application tracks the event without being listed in the specification: add its source application to the specification, or remove the tracking from that application. See [Track specification versions and application IDs](/docs/event-studio/tracking-plans/data-quality/index.md#track-specification-versions-and-application-ids).

To register a source application in Console, see [Create a source application in Console](/docs/event-studio/source-applications/create/index.md). To generate tracker code from a source application, see [Initialize the tracker from a source application](/docs/event-studio/hand-off-to-implementation/index.md#initialize-the-tracker-from-a-source-application).
