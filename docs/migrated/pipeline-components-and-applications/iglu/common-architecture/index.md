---
title: "Iglu Common Architecture"
date: "2021-03-26"
sidebar_position: 0
---

Iglu is built on a set of technical design decisions which are documented in this section. It is this set of design decisions that allow Iglu clients and repositories to interoperate.

## [](https://github.com/snowplow/iglu/wiki/Common-architecture#common-architecture-aspects)Common architecture aspects

Please review the following design documents:

- [Self-describing JSON Schemas](/docs/migrated/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/) - simple extensions to JSON Schema which **semantically identify** and version a given JSON Schema
- [Self-describing JSONs](/docs/migrated/pipeline-components-and-applications/iglu/common-architecture/self-describing-jsons/) - a standardized JSON format which co-locates a reference to the instance's JSON Schema alongside the instance's data
- [SchemaVer](/docs/migrated/pipeline-components-and-applications/iglu/common-architecture/schemaver/) - how we semantically version schemas
- [Schema resolution](/docs/migrated/pipeline-components-and-applications/iglu/common-architecture/schema-resolution/) - our public algorithm for how we determine in which order we check Iglu repositories for a given schema
