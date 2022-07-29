---
title: "Glossary of Terms"
date: "2021-03-26"
sidebar_position: 40
---

#### Analytics

Once we have our data modeled in tidy users, sessions, content items tables, we are ready to perform analysis on them.

Most companies that use Snowplow will perform analytics using a number of different types of tools:

1. It is common to implement a Business Intelligence tool on top of Snowplow data to enable users (particularly non-technical users) to slice and dice (pivot) on the data. For many companies, the BI tool will be the primary way that most users interface with Snowplow data.
2. Often a data scientist or data science team will often crunch the underlying event-level data to perform more sophisticated analysis including building predictive models, perform marketing attribution etc. The data scientist(s) will use one or more specialist tools e.g. Python for Data Science or R.

_Read [more](http://snowplowanalytics.com/documentation/concepts/snowplow-data-pipeline/#data-analysis)_

#### Collector

A collector receives data in the form of `GET` or `POST` requests from the trackers, and write the data to either logs or streams (for further processing).

_Read [more](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setting-up-your-aws-environment/)_

#### Context

'Contexts' have been renamed to 'Entities'.

A context is the group of entities associated with or describing the setting in which an event has taken place. What makes contexts interesting is that they are common across multiple different event types. Thus, contexts provide a convenient way in Snowplow to schema common entities once, and then use those schemas across all the different events where those entities are relevant.

Across all our trackers, the approach is the same. Each context is a self-describing JSON. We create an array of all the different contexts that we wish to pass into Snowplow, and then we pass those contexts in generally as the final argument on any track method that we call to capture the event.

_Read [more](http://snowplowanalytics.com/documentation/concepts/contexts)_

#### Data collection

At data collection time, we aim to capture all the data required to accurately represent a particular event that has just occurred.

At this stage, the data that is collected should describe the events as they have happened, including as much rich information about:

1. The event itself
2. The individual/entity that performed the action - that individual or entity
3. Any "objects" of the action
4. The wider context that the event has occurred in

For each of the above we want to collect as much data describing the event and associated entities as possible.

_Read [more](/docs/migrated/collecting-data/)_

#### Data modeling

The data collection and enrichment process generates a data set that is an "event stream": a long list of packets of data, where each packet represents a single event.

Whilst it is possible to do analysis directly on this event stream, it is very common to:

1. Join the event-stream data set with other data sets (e.g. customer data, product data, media data, marketing data, financial data).
2. Aggregate the event-level data into smaller data sets that are easier and faster to run analyses against.
3. Apply "business logic" i.e. definitions to the data as part of that aggregation step.

What tables are produced, and the different fields available in each, varies widely between companies in different sectors, and surprisingly even varies within the same vertical. That is because part of putting together these aggregate tables involves implementing business-specific logic.

We call this process of aggregating a "data modeling". At the end of the data modeling process, a clean set of tables is available to make it easier to perform analysis on the data.

_Read [more](http://snowplowanalytics.com/documentation/concepts/snowplow-data-pipeline/#data-modeling)_

#### Entity

The legacy term for 'Entity' is 'Context'

An entity is the group of entities associated with or describing the setting in which an event has taken place. What makes entites interesting is that they are common across multiple different event types. Thus, entities provide a convenient way in Snowplow to schema common entities once, and then use those schemas across all the different events where those entities are relevant.

Across all our trackers, the approach is the same. Each entity is a self-describing JSON. We create an array of all the different entities that we wish to pass into Snowplow, and then we pass those entities in generally as the final argument on any track method that we call to capture the event.

__Read [more](http://snowplowanalytics.com/documentation/concepts/contexts)__

#### Event

An event is something that occurred in a particular point in time. Examples of events include:

- Load a web page
- Add an item to basket
- Enter a destination
- Check a balance
- Search for an item
- Share a video

Snowplow is an event analytics platform. Once you have setup one or more Snowplow trackers, every time an event occurs, Snowplow should spot the event, generate a packet of data to describe the event, and send that event into the Snowplow data pipeline.

__Read [more](http://snowplowanalytics.com/documentation/concepts/contexts)__

#### Event Dictionary

When we set up Snowplow, we need to make sure that we track all the events that are meaningful to our business, so that the data associated with those events is available in Snowplow for analysis.

When we come to analyse Snowplow data, we need to be able to look at the event data and understand, in an unambiguous way, what that data actually means i.e. what it represents.

An event dictionary is a crucial tool in both cases. It is a document that defines the universe of events that a company is interested in tracking.

_Read [more](http://snowplowanalytics.com/documentation/concepts/event-dictionaries-and-schemas)_

#### Enrichment

Data enrichment is sometimes referred to as "dimension widening". We are using 3rd party sources of data to enrich the data we originally collected about the event so that we have more context available for understanding that event, enabling us to perform richer analysis.

Snowplow supports the following enrichments out-of-the-box. We are working on making our enrichment framework pluggable, so that users and partners can extend the list of enrichments performed as part of the data processing pipeline:

1. IP -> Geographic location
2. Referrer query string -> source of traffic
3. User agent string -> classifying devices, operating systems and browsers

_Read [more](http://snowplowanalytics.com/documentation/concepts/snowplow-data-pipeline/#data-enrichment)_

#### Iglu

Iglu is a machine-readable, open-source _schema repository_ for JSON Schema from the team at Snowplow Analytics. A schema repository (sometimes called a registry) is like _npm_ or _Maven_ or _git_ but holds data schemas instead of software or code.

Snowplow uses Iglu to store all the schemas associated with the different events and contexts that are captured via Snowplow. When an event or context is sent into Snowplow, it is sent with a reference to the schema for the event or context, which points to the location of the schema for the event or context in Iglu.

_Read [more](/docs/migrated/pipeline-components-and-applications/iglu/)_

#### Pipeline

The Snowplow pipeline is built to enable a very clean separation of the following steps in the _data processing flow_:

1. [Data collection](/docs/migrated/collecting-data/)
2. [Data enrichment](/docs/migrated/enriching-your-data/)
3. [Data modelling](/docs/migrated/modeling-your-data/)
4. [Data analysis](/docs/migrated/tutorials/)

_Read [more](/docs/migrated/understanding-your-pipeline/)_

#### Schema DDL

Schema DDL is a set of generators for producing various DDL formats from JSON Schemas. It's tightly coupled with other tools from Snowplow Platform like Iglu and Self-describing JSON and used mostly in Schema Guru.

_Read [more](https://github.com/snowplow-incubator/schema-ddl)_

#### SchemaVer

SchemaVer is Snowplow Team own schema versioning notion. It is defined as follows: `MODEL-REVISION-ADDITION`

- `MODEL` when you make a breaking schema change which will prevent interaction with any historical data
- `REVISION` when you introduce a schema change which may prevent interaction with some historical data
- `ADDITION` when you make a schema change that is compatible with all historical data

_Read_ _[more](/docs/migrated/understanding-tracking-design/versioning-your-data-structures/)_

#### Self-Describing Event

Unsturctured event is a legacy term for Self-Describing Event

You may wish to track events on your website or application which are not directly supported by Snowplow and which structured event tracking does not adequately capture. Your event may have more than the five fields offered by `trackStructEvent`, or its fields may not fit into the _category-action-label-property-value_ model. The solution is Snowplow's custom unstructured events. Unstructured events use self-describing JSON which can have arbitrarily many fields.

For example, to track an unstructured event with Javascript tracker, you make use of the `trackSelfDescribingEvent` method with the pattern shown below:

```
snowplow_name_here('trackSelfDescribingEvent', <<SELF-DESCRIBING EVENT JSON>>);
```

_Read [more](http://snowplowanalytics.com/blog/2013/05/14/snowplow-unstructured-events-guide/)_

#### Self-describing JSON

Self-describing JSON is an individual JSON with its JSON Schema. It generally looks like the one below:

```
{
    "schema": "iglu:com.snowplowanalytics/ad_click/jsonschema/1-0-0",
    "data": {
        "bannerId": "4732ce23d345"
    }
}
```

It differs from [standard JSON](http://www.json.org/) due to the following important changes :

1. We have added a new top-level field, schema, which contains (in a space-efficient format) all the information required to uniquely identify the associated JSON Schema
2. We have moved the JSON’s original property inside a data field. This sandboxing will prevent any accidental collisions should the JSON already have a schema field

#### Shredding

The Snowplow Redshift Loader has a Shredding process (as part of Enrichment and Storage processes) which consists of two phases:

1. Extracting unstructured event JSONs and context JSONs from enriched event files into their own files
2. Loading those files into corresponding tables in Redshift

There are three great use cases to use the shredding functionality for:

1. Adding support into your Snowplow installation for _new Snowplow event types_ with no software upgrade required - simply add new tables to your Redshift database.
2. Defining your own _custom unstructured events types_, and processing these through the Snowplow pipeline into dedicated tables in Redshift. Retailers can define their own "product view" or "add to basket" events, for example. Media companies can define their own "video play" events.
3. Defining your own _custom context types_, and processing these through the Snowplow pipeline into dedicated tables in Redshift. You can define your own "user" type, for example, including whatever fields you capture and want to store related to a user.

_Read [more](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/rdb-shredder/)_

#### Snowplow

Snowplow is an enterprise-strength marketing and product analytics platform. It does three things:

- Identifies your users, and tracks the way they engage with your website or application
- Stores your users' behavioural data in a scalable "event data warehouse" you control: in Amazon S3 and (optionally) Amazon Redshift or Postgres
- Lets you leverage the biggest range of tools to analyze that data, including big data tools (e.g. Hive, Pig, Mahout) via EMR or more traditional tools e.g. Tableau, R, Looker, Chartio to analyze that behavioural data

_Read [more](http://snowplowanalytics.com/)_

#### Storage

The  enrichment process takes raw Snowplow collector logs, tidies them up, enriches them (e.g. by adding Geo-IP data, and performing referrer parsing) and then writes the output of that process back to S3 as a cleaned up set of Snowplow event files. The data in these files can be analysed directly by any big data tool that runs on EMR.

In addition, Snowplow data from those event files could be copied into Amazon Redshift, where it can be analysed using any tool that talks to PostgreSQL.

There are therefore a number of different potential storage modules that Snowplow users can store their data in.

_Read [more](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/)_

#### Structured event

We follow Google five-variable tracking event structure. When you track a structured event, you get five parameters:

- _Category_: The name for the group of objects you want to track.
- _Action_: A string that is used to define the user in action for the category of object.
- _Label_: An optional string which identifies the specific object being actioned.
- _Property_: An optional string describing the object or the action performed on it.
- _Value_: An optional numeric data to quantify or further describe the user action.

For example, when tracking a custom structured event the specification for the `trackStructEvent` method (Javascript tracker) would follow the pattern:

```
snowplow_name_here('trackStructEvent', 'category','action','label','property','value');
```

_Read_  _[more](/docs/migrated/understanding-your-pipeline/canonical-event/)_

#### Tracker

A tracker is client- or server-side libraries which track customer behaviour by sending Snowplow events to a Collector.

_Read [more](/docs/migrated/collecting-data/collecting-from-own-applications/)_

#### Unstructured event

Unsturctured event is a legacy term for Self-Describing Event

You may wish to track events on your website or application which are not directly supported by Snowplow and which structured event tracking does not adequately capture. Your event may have more than the five fields offered by `trackStructEvent`, or its fields may not fit into the _category-action-label-property-value_ model. The solution is Snowplow's custom unstructured events. Unstructured events use self-describing JSON which can have arbitrarily many fields.

For example, to track an unstructured event with Javascript tracker, you make use of the `trackSelfDescribingEvent` method with the pattern shown below:

```
snowplow_name_here('trackSelfDescribingEvent', <<SELF-DESCRIBING EVENT JSON>>);
```

_Read [more](http://snowplowanalytics.com/blog/2013/05/14/snowplow-unstructured-events-guide/)_

#### Webhook

Snowplow allows you to collect events via the adapters (webhooks) of supported third-party software.

Webhooks allow this third-party software to send their own internal event streams to Snowplow collectors for further processing. Webhooks are sometimes referred to as "streaming APIs" or "HTTP response APIs".

_Read [more](/docs/migrated/collecting-data/collecting-data-from-third-parties/)_
