---
title: "What is deployed on GCP?"
date: "2021-09-23"
sidebar_position: 300
---

**Let’s take a look at what's deployed on GCP upon running the quick start example script.**

Note: you can very easily edit the script by removing certain modules, giving you the flexibility to design the topology of your pipeline according to your needs.

![](images/image-4.png)

#### **Collector load balancer**

This is an application load balancer for your inbound HTTP/S traffic. Traffic is routed from the load balancer to the collector. 

_For further details on the resources, default and required input variables, and outputs see the [terraform-google-lb](https://registry.terraform.io/modules/snowplow-devops/lb/google/latest) terraform module._

#### **Stream Collector**

This is a Snowplow event collector that receives raw Snowplow events over HTTP, serializes them to a [Thrift](http://thrift.apache.org/) record format, and then writes them to pubsub. More details can be found [here](/docs/pipeline-components-and-applications/stream-collector/index.md).

__For further details on the resources, default and required input variables, and outputs see the [collector-pubsub-ce](https://registry.terraform.io/modules/snowplow-devops/collector-pubsub-ce/google/latest) terraform module.__

#### **Stream Enrich**

This is a Snowplow app written in scala which: 

- Reads raw Snowplow events off a Pubsub topic populated by the Scala Stream Collector
- Validates each raw event
- Enriches each event (e.g. infers the location of the user from his/her IP address)
- Writes the enriched Snowplow event to the enriched topic

It is designed to be used downstream of the [Scala Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md). More details can be found [here](/docs/pipeline-components-and-applications/enrichment-components/stream-enrich/index.md). 

__For further details on the resources, default and required input variables, and outputs see the [enrich-pubsub-ce](https://registry.terraform.io/modules/snowplow-devops/enrich-pubsub-ce/google/latest) terraform module.__

#### **Pubsub topics**

Your pubsub topics are a key component of ensuring a non-lossy pipeline, providing crucial back-up, as well as serving as a mechanism to drive real time use cases from the enriched stream. 

__For further details on the resources, default and required input variables, and outputs see the [pubsub-topic](https://registry.terraform.io/modules/snowplow-devops/pubsub-topic/google/latest) terraform module.__

**Raw stream**

Collector payloads are written to this raw pubsub topic, before being picked up by the Enrich application. 

**Enriched topic**

Events that have been validated and enriched by the Enrich application are written to this enriched stream.

**Bad 1 topic**

This bad topic is for events that the collector or enrich fail to process. An event can fail at the collector point due to, for instance, it being too large for the stream creating a size violation bad row, or it can fail during enrichment due to a schema violation or enrichment failure.  More details can be found [here](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md). 

#### **Iglu** 

[Iglu](/docs/pipeline-components-and-applications/iglu/index.md) allows you to publish, test and serve schemas via an easy-to-use RESTful interface. It is split into a few services.

**Iglu load balancer**

This load balances the inbound traffic and routes traffic to the Iglu Server. 

__For further details on the resources, default and required input variables, and outputs see the [google-lb](https://registry.terraform.io/modules/snowplow-devops/collector-pubsub-ce/google/latest) terraform module.__

**Iglu Server**

The [Iglu Server](https://github.com/snowplow-incubator/iglu-server/) serves requests for Iglu schemas stored in your schema registry. 

__For further details on the resources, default and required input variables, and outputs see the [iglu-server-ce](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ce/google/latest) terraform module.__

**Iglu cloudSQL**

This is the Iglu Server database where the Iglu schemas themselves are stored. 

__For further details on the resources, default and required input variables, and outputs see the [cloud-sql](https://registry.terraform.io/modules/snowplow-devops/cloud-sql/google/latest) terraform module.__

#### **Postgres loader**

The Snowplow application responsible for reading the enriched and bad data and [loading to Postgres.](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md)

____For further details on the resources, default and required input variables, and outputs see the [postgres-loader-pubsub-ce](https://registry.terraform.io/modules/snowplow-devops/postgres-loader-pubsub-ce/google/latest) terraform module.____

##### Have any questions? Reach out to us on [discourse](https://discourse.snowplowanalytics.com/)!

##### Or start [tracking events from your own application](/docs/open-source-quick-start/further-exploration/start-tracking-events-and-further-enrich-your-data/index.md) >>

* * *

Do you have any feedback for us?

We are really interested in understanding how you are finding the Quick Start and what we can do to better support you in getting started with our open source. If you have a moment, [let us know via this short survey](https://forms.gle/rKEqpFxwTfLjhQzR6).
