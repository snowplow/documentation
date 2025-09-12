---
title: "Iglu Common Architecture"
description: "Iglu common architecture components for behavioral data schema registry and validation systems."
schema: "TechArticle"
keywords: ["Iglu Architecture", "Registry Architecture", "Schema Architecture", "System Architecture", "Component Architecture", "Design Principles"]
date: "2021-03-26"
sidebar_position: 0
---

Iglu is built on a set of technical design decisions which are documented in this section. It is this set of design decisions that allow Iglu clients and repositories to interoperate.

## Common architecture aspects

Please review the following design documents:

- [Self-describing JSON Schemas](/docs/api-reference/iglu/common-architecture/self-describing-json-schemas/index.md) - simple extensions to JSON Schema which **semantically identify** and version a given JSON Schema
- [Self-describing JSONs](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md) - a standardized JSON format which co-locates a reference to the instance's JSON Schema alongside the instance's data
- [SchemaVer](/docs/api-reference/iglu/common-architecture/schemaver/index.md) - how we semantically version schemas
- [Schema resolution](/docs/api-reference/iglu/common-architecture/schema-resolution/index.md) - our public algorithm for how we determine in which order we check Iglu repositories for a given schema
