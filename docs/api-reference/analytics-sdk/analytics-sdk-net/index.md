---
title: "Analytics SDK - .NET"
description: ".NET Analytics SDK for processing Snowplow enriched events in Azure Data Lake Analytics, Azure Functions, AWS Lambda, and .NET-compatible frameworks."
date: "2020-11-03"
sidebar_position: 500
---

## 1. Overview

The [Snowplow Analytics SDK for .NET](https://github.com/snowplow/snowplow-dotnet-analytics-sdk) lets you work with [Snowplow enriched events](/docs/fundamentals/canonical-event/index.md) in your .NET event processing, data modeling and machine-learning jobs. You can use this SDK with [Azure Data Lake Analytics](https://azure.microsoft.com/en-gb/services/data-lake-analytics/), [Azure Functions](https://azure.microsoft.com/en-gb/services/functions/), [AWS Lambda](https://aws.amazon.com/lambda/), [Microsoft Orleans](https://dotnet.github.io/orleans/) and other .NET-compatible data processing frameworks.

The .NET Analytics SDK makes it significantly easier to build applications that consume Snowplow enriched data directly from Event Hubs or Azure Blob Storage.

## 2. Compatibility

Snowplow .NET Analytics SDK targets [.NET Standard 1.3](https://github.com/dotnet/standard/blob/master/docs/versions.md).

## 3. Setup

To add the .NET Analytics as a dependency to your project, install it in the Visual Studio Package Manager Console using [NuGet](https://www.nuget.org/):

```powershell
Install-Package Snowplow.Analytics
```

## 4. Event Transformer

### 4.1 Overview

The Snowplow enriched event is a relatively complex TSV string containing self-describing JSONs. Rather than work with this structure directly, Snowplow analytics SDKs ship with _event transformers_, which translate the Snowplow enriched event format into something more convenient for engineers and analysts.

As the Snowplow enriched event format evolves towards a cleaner [Apache Avro](https://avro.apache.org/)\-based structure, we will be updating this Analytics SDK to maintain compatibility across different enriched event versions.

Working with the Snowplow .NET Analytics SDK therefore has two major advantages over working with Snowplow enriched events directly:

1. The SDK reduces your development time by providing analyst- and developer-friendly transformations of the Snowplow enriched event format
2. The SDK futureproofs your code against new releases of Snowplow which update our enriched event format

Currently the Analytics SDK for .NET ships with one event transformer: the JSON Event Transformer.

### 4.2 The JSON Event Transformer

The JSON Event Transformer takes a Snowplow enriched event and converts it into a JSON ready for further processing. This transformer was adapted from the code used to load Snowplow events into Elasticsearch in the Kinesis real-time pipeline.

The JSON Event Transformer converts a Snowplow enriched event into a single JSON like so:

```json
{ 
  "app_id":"demo",
  "platform":"web",
  "etl_tstamp":"2015-12-01T08:32:35.048Z",
  "collector_tstamp":"2015-12-01T04:00:54.000Z",
  "dvce_tstamp":"2015-12-01T03:57:08.986Z",
  "event":"page_view",
  "event_id":"f4b8dd3c-85ef-4c42-9207-11ef61b2a46e",
  "txn_id":null,
  "name_tracker":"co",
  "v_tracker":"js-2.5.0",
  "v_collector":"clj-1.0.0-tom-0.2.0",...
```

The most complex piece of processing is the handling of the self-describing JSONs found in the enriched event's `unstruct_event`, `contexts` and `derived_contexts` fields. All self-describing JSONs found in the event are flattened into top-level plain (i.e. not self-describing) objects within the enriched event JSON.

For example, if an enriched event contained a `com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1`, then the final JSON would contain:

```json
{ 
  "app_id":"demo",
  "platform":"web",
  "etl_tstamp":"2015-12-01T08:32:35.048Z",
  "unstruct_event_com_snowplowanalytics_snowplow_link_click_1": {
    "targetUrl":"http://www.example.com",
    "elementClasses":["foreground"],
    "elementId":"exampleLink"
  },...
```

### 4.3 Examples

You can convert an enriched event TSV string to a JSON like this:

```csharp
using Snowplow.Analytics.Json;
using Snowplow.Analytics.Exceptions;

try
{
    EventTransformer.Transform(enrichedEventTsv);
}
catch (SnowplowEventTransformationException sete)
{
    sete.ErrorMessages.ForEach((message) => Console.WriteLine(message));
}
```

If there are any problems in the input TSV (such as unparseable JSON fields or numeric fields), the `transform` method will throw a `SnowplowEventTransformationException`. This exception contains a list of error messages - one for every problematic field in the input.
