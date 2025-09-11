---
title: "Iglu Core"
description: "Iglu Core libraries for behavioral data schema validation and self-describing JSON processing."
schema: "TechArticle"
keywords: ["Iglu Core", "Core Components", "Registry Core", "Core Architecture", "Iglu Foundation", "Core System"]
date: "2021-03-26"
sidebar_position: 120
---

Iglu is designed to be not dependent on any particular programming language or platform. But there's growing set of applications beside clients and registries using different concepts originated from Iglu. To have consistent data structures and behavior among different applications, we're developing Iglu core libraries for different languages.

## Basic data structures

All languages have their own unique features and particular Iglu Core implementation may or may not use these features. One common rule for all Iglu core implementations is to minimize dependencies. Ideally Iglu core should have no external dependencies. Another rule is to implement the required basic data structures (in form of classes, structs, ADTs or any other appropriate form) and functions.

### SchemaKey

This data structure contains information about Self-describing datum, such as Snowplow unstructured event or context.

It also should have related `parse` functions, which can parse `SchemaKey` from most common representation - Iglu URI (string with form of `iglu:com.acme/someschema/format/1-0-0`) and Iglu path (same, but without `iglu:` protocol part). Reverse `asString` function required as well.

This also can include appropriate regular expressions to extract and validate schema key. Function for parsing `SchemaKey` from JSON Schemas is optional if there's no default JSON library like in JavaScript, but can be included within some interface.

More information can be found in [Self-describing JSON Schemas](/docs/api-reference/iglu/common-architecture/self-describing-json-schemas/index.md) and [Self-describing JSONs](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md) wiki pages.

### SchemaMap

This is almost isomorphic entity to `SchemaKey`, which also contains same information: vendor, name, format and version. But unlike `SchemaKey` it supposed to be attached only to Schemas instead of datums. In schemas same information usually has different representation and also version is always _full_ opposed to datum's possibly _partial_.

### SchemaVer

This is a part of `SchemaKey` and `SchemaMap` with information about semantic Schema version, basically triplet of MODEL, REVISION, ADDITION.

Like, `SchemaKey` it should contain `parse` function with regular expressions as well as `asString` method.

It can either _full_ (e.g. `1-2-0`) or _partial_ (e.g. `1-?-?`) suited for schema inference.

More information can be found in dedicated wiki page: [SchemaVer](/docs/api-reference/iglu/common-architecture/schemaver/index.md).

### SchemaCriterion

Last core data structure is `SchemaCriterion` which is a default way to filter Self-describing entities. Basically it represent `SchemaKey` divided into six parts, where last three (MODEL, REVISION, ADDITION) _can_ be unfilled, thus one can match all entities regardless parts which remain unfilled.

`SchemaCriterion` also must contain regular expression, `parse` and `asString` (unfilled parts replaced with asterisks) functions. One other required function is `matches` which accepts `SchemaCriterion` and `SchemaKey` and returning boolean value indicating if key was matched. Bear in mind that criterions matching versions like `.../*-1-*` or `.../*-*-0` are absolutely valid, they're useful if want to match all initial Schemas.

## Implementations

Currently we have only [Scala Iglu Core](https://github.com/snowplow/iglu/wiki/Scala-Iglu-Core) which can be considered as reference implementation. Among described above data structures it includes type classes and container classes to improve type-safety. These type classes and containers are completely optional in other implementations.
