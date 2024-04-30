---
title: "Iglu schema registry"
sidebar_position: 90
---

## Overview

**Iglu** is a machine-readable, open-source schema registry for [JSON schema](http://json-schema.org/) and Thrift schema from the team at [Snowplow Analytics](http://snowplowanalytics.com/). A schema registry is like _npm_ or _Maven_ or _git_ but holds data schemas instead of software or code.

Iglu consists of three key technical aspects:

1. A [common architecture](/docs/pipeline-components-and-applications/iglu/common-architecture/index.md) that informs all aspects of Iglu
2. [Iglu registries](/docs/pipeline-components-and-applications/iglu/iglu-repositories/index.md) that can host a set of [self-describing JSON schemas](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/index.md)
3. [Iglu clients](/docs/pipeline-components-and-applications/iglu/iglu-clients/index.md) that can resolve schemas from one or more Iglu registries

## Iglu explained

**Iglu** is built on a set of technical design decisions. It is this set of design decisions that allow Iglu clients and registries to interoperate. Please review the following design documents:

- [**Self-describing JSON schema**](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/index.md) - simple extensions to JSON schema which semantically identify and version a given JSON schema
- [**Self-describing JSON**](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-jsons/index.md) - a standardized JSON format which co-locates a reference to the instance's JSON schema alongside the instance's data
- [**SchemaVer**](/docs/pipeline-components-and-applications/iglu/common-architecture/schemaver/index.md) - how we semantically version schemas - _Schema resolution_ - our public algorithm for how we determine in which order we check Iglu registries for a given schema

**Iglu clients** are used for interacting with Iglu server repos and for resolving schemas in embedded and remote Iglu schema registries.

In the below diagram we show an Iglu client resolving a schema from Iglu Central, one embedded registry and a further two remote HTTP registries:

![Iglu client](images/iglu-clients.png)

An **Iglu registry** acts as a store of data schemas. Hosting JSON schemas in an Iglu registry allows you to use those schemas in Iglu-capable systems such as Snowplow.

So far we support two types of Iglu registry:

- **Remote registries** - essentially websites containing schemas which an Iglu client can query over HTTP
- **Embedded registries** - which are embedded in a piece of software (typically alongside an Iglu client)

In the below diagram we show an Iglu client resolving a schema from Iglu Central, one embedded registry and a further two remote HTTP registries:

![Iglu repositories](images/iglu-repos.png)

**Iglu Central** ([http://iglucentral.com](http://iglucentral.com/)) is a public registry of JSON schemas hosted by [Snowplow Analytics](http://snowplowanalytics.com/).

Under the covers, Iglu Central is built and run as a **static Iglu registry**, hosted on Amazon S3.

> A **static repo** is simply an Iglu registry server structured as a static website.

![Iglu Central](images/iglu-central.png)

The **deployment process** for Iglu Central is documented on [this wiki](/docs/pipeline-components-and-applications/iglu/iglu-central-setup/index.md) in case a user wants to setup a public mirror or private instance of Iglu Central.
