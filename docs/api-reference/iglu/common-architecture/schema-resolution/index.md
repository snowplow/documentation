---
title: "Schema Resolution"
description: "Schema resolution mechanisms in Iglu for behavioral data validation and processing workflows."
schema: "TechArticle"
keywords: ["Schema Resolution", "Registry Resolution", "Schema Lookup", "Resolution Process", "Schema Discovery", "Registry Query"]
date: "2021-03-26"
sidebar_position: 400
---

This page describes the Schema resolution algorithm which is standard for all Iglu clients. Currently only [Iglu Scala client](https://github.com/snowplow/iglu-scala-client) fully follow this algorithm, while other clients may miss some parts, but we're working on making their behavior consistent.

## 1. Prerequisites

Before going further it is important to understand basic Iglu client configuration and essential concepts like Resolver, Registry (or Repository), Schema. Here is a quick overview of these concepts, if you're familiar with them you may want to skip this section.

Iglu clients are configured via JSON object described in dedicated Schema called [resolver-config](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.iglu/resolver-config/jsonschema). Here we'll be using JSON resolver configuration which is platform independent and most wide-spread.

### 1.1 Resolver

Resolver is an primary object of Iglu Client library, which contains all logic necessary to fetch requested Schema from appropriate registry (repository) and cache it properly. Resolver has two main properties: cache size (`cacheSize`) and list of registries (`repositories`).

### 1.2 Registries

**NOTE:** term _repository_ was deprecated. _Registry_ is default term to use when referring to Schema storage. So far, we've not renamed all occurrences, so for now they can be used interchangeable.

Each registry in resolver configuration has several values common for all types of registries, such as `name`, `vendorPrefixes` and `priority`. Also each registry has type, which is defined inside `connection` property. The only one important thing here about type of repository is that each type has its own priority hardcoded inside client library. Below we'll refer to this hard-coded priority by `classPriority` and to user-defined priority by `instancePriority` Usually, the "safer" registry - the higher `classPriority` it has, so local repositories are more preferable than remote.

### 1.3 Cache

All Iglu clients use internal cache to store registry responses. By virtue of it, it is absolutely safe to launch Hadoop/Spark jobs with Iglu client embedded as it will not generate enormous amount of IO calls.

#### 1.3.1 Cache algorithm

Cache stores not just plain Schemas, but information about responses from each registry. It allows us to make different decisions depending on what exactly went wrong with particular request. Since Schema was successfuly fetched it will be stored until moment it get evicted by [LRU cache](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_(LRU)) algorithm. This eviction it turn happens only if cache map reached its limit (defined in `cacheSize`) and particular Schema wasn't requested for longer time than all other.

#### 1.3.2 Cache TTL

Since version 0.5.0, Iglu Scala Client supports `cacheTtl` property. It is especially useful for real-time pipelines as they can store "failure" for very long time and TTL is a mechanism to ensure that day-long data won't go to bad stream. Note however that client also tries to re-resolve successfully fetched schemas, this allows operators to patch (re-upload) schemas without bringing pipeline down (although it is not recommended).

`cacheTtl` is available since [`1-0-2` version](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-2) of resolver config.

## 2. Lookup algorithm

Overall, Schema Resolution algorithm can be described by following flowchart:

![](images/schema-resolution-flowchart.png)

Few important things to note:

- If registry responded with "NotFound" error - "missing" value will be cached and this repository won't be queried again, until this "missing" value not evicted by LRU-algorithm
- If registry responded with error other than "NotFound", for example "TimeoutError", "NetworkError", "ServerFault" etc - "needToRetry" value will be cached and Resolver will give this registry 3 chances more. After three failed lookups - "missing" value will be cached
- These "missing" and "needToRetry" values in cache are per-registry, not per-schema, which means if `registryA` responded "NotFound" for Schema `iglu:com.acme/event/jsonschema/1-0-0` and `registryB` responded with TimeoutError - resolver will immediately abandon `registryA` and keep try to query `registryB` for 3 more times.

## 3. Registry priority

For each particular Schema lookup, registries will be prioritized. In other words they will be sorted according following input parameters (ordered by their significance):

- `vendorPrefix` - Resolver always will look first into those registries which `vendorPrefix`es matches `SchemaKey`'s vendor. It **does not** mean registries with unmatched `vendorPrefix` will be skipped, it means they will be queried last.
- `classPriority` - hardcoded in client library value for each type of registry. It means that whatever high priority (low integer value) was set up in configuration for a particular registry - it will be overridden by `classPriority`, so embedded repository will always be checked before HTTP (unless priority influenced by `vendorPrefix`)
- `instancePriority` - user-defined value. Influence only repositories within same `classPriority`.

One important thing to note is that both priorities (`classPriority` and `instancePriority`) order registries in ascending order. That means lower number means higher priority. Think of it as ascending list of number: `[1,2,3,4]` - smaller will be always first.
