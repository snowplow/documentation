---
title: "Iglu Core"
date: "2021-03-26"
sidebar_position: 120
---

Iglu is designed not to be dependent on any particular programming language or platform. However, there is a growing set of applications beside clients and registries using different concepts originated from Iglu. To have consistent data structures and behavior among different applications, we're developing Iglu core libraries for different languages.

## Basic data structures

All languages have their own unique features and a particular Iglu Core implementation may or may not use these features. One common rule for all Iglu core implementations is to minimize dependencies; ideally Iglu core should have no external dependencies. Another rule is to implement the required basic data structures (in form of classes, structs, ADTs or any other appropriate form) and functions.

### SchemaKey

This data structure contains information about Self-describing data, such as a Snowplow unstructured event or context.

It also should have be able to be created from most common representations of a schema key; Iglu URI (string with form of `iglu:com.acme/someschema/format/1-0-0`) and Iglu path (same, but without `iglu:` protocol part). The structure should also have functions to return these values. This structure may include validation of the schema key. 

A method for creating a `SchemaKey` from a [Self-describing JSON Schemas](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/index.md) is optional if there's no default JSON library in the language.

More information can be found in [Self-describing JSON Schemas](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/index.md) and [Self-describing JSONs](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-jsons/index.md) docs pages.

### SchemaMap

This data structure is almost identical entity to `SchemaKey`, in that they both contain the same information: vendor, name, format and version. But unlike `SchemaKey` it is used to represent only Schemas instead of data. In schemas the same information usually has different representation and a version is always _full_ opposed as opposed to data's possibly _partial_.

### SchemaVer

This is a part of `SchemaKey` and `SchemaMap` with information about semantic Schema version, based on the triplet of MODEL, REVISION, ADDITION.

Like `SchemaKey` it should contain `parse` functions with validation,  as well as an `asString` method.

It can either _full_ (e.g. `1-2-0`) or _partial_ (e.g. `1-?-?`) suited for schema inference.

More information can be found in the dedicated docs page: [SchemaVer](/docs/pipeline-components-and-applications/iglu/common-architecture/schemaver/index.md).

### SchemaCriterion

The last core data structure is `SchemaCriterion` which is a default way to filter Self-describing entities. Basically it represent a `SchemaKey` divided into six parts, where the last three (MODEL, REVISION, ADDITION) _can_ be unfilled, thus one can match all entities regardless of parts which remain unfilled.

`SchemaCriterion` also must contain regular expression validation, `parse`, and `asString` (unfilled parts replaced with asterisks) functions. One other required function is `matches` which accepts `SchemaCriterion` and a `SchemaKey`, returning a boolean value indicating if the key was matched. Bear in mind that criterions matching versions like `.../*-1-*` or `.../*-*-0` are absolutely valid, they're useful if want to match all initial Schemas.

## Implementations

Currently we only have [Scala Iglu Core](https://github.com/snowplow/iglu/wiki/Scala-Iglu-Core) which can be considered as a reference implementation. Among the above described data structures it includes type classes and container classes to improve type-safety. These type classes and containers are completely optional in other implementations.
