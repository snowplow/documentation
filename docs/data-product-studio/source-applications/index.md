---
title: "Organize data sources with Source Applications"
sidebar_position: 2
sidebar_label: "Source applications"
---

For data collection, you will often have different sources of information that correspond to applications designed for a particular purpose. These are what we will refer to as Source Applications.

:::tip
A guideline, which will address your needs most of the time, is to think of a Source Application as an independently deployable application system.
For example:
- An Android mobile application.
- An iOS mobile application.
- A web application.

This will let you best manage changes you make to the available Application Contexts etc. and make sure it reflects as closely as possible the current data state.
:::

To illustrate, let's consider Snowplow. We can identify several applications designed for distinct purposes, each serving as a separate data source for behavioral data, or in other words, a Source Application:

- The Snowplow website that corresponds to the application served under www.snowplow.io
- The Console application that is served under console.snowplowanalytics.com.
- The documentation website serving as our information hub, for all things related to our product, served under docs.snowplow.io.

Source Applications are a foundational component that enables you to establish the overarching relationships that connect application IDs and [Application Entites](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md) and [Data Products](/docs/data-product-studio/data-products/index.md).

## Application IDs

For each of these applications you would set up a unique application ID using the [app_id](/docs/events/ootb-data/app-information/index.md#atomic-event-properties) field to distinguish them later on in analysis.

:::tip
We often see, and recommend as a best practice, setting up a unique application ID for each deployment environment you are using. For example `${appId}-qa` for staging, `${appId}-dev` for development environments.
:::

## Application Context

Application Context, also referred to as [Global Context](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md), is a set of entities that can be sent with every event recorded in the application. Using Source Applications you can document which Application Contexts are expected. This is really useful for tracking implementation, data discovery and preventing information duplication in Data Products.

:::info
Since Application Entities can also be set conditionally, you can mark any of them as optional with a note to better understand the condition or any extra information required. The method for conditionally adding an Application Context is through [rulesets](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md#rulesets), [filter functions](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md#filter-functions) and [context generators](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md#context-generators).
:::
