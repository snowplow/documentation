---
title: "Extending"
description: "Extend failed event recovery capabilities with custom logic for specific behavioral data quality requirements."
schema: "TechArticle"
keywords: ["Recovery Extension", "Custom Recovery", "Extended Recovery", "Advanced Recovery", "Recovery Enhancement", "Custom Logic"]
date: "2020-04-13"
sidebar_position: 70
---

There are several extension points for this application:

- Steps
- Conditions
- Bad Row types

## Steps

By definition steps allow performing modifications on existing bad row data points' payloads. We defined a configuration DSL for Steps that is turned into actions with `Inspectable` definitions. `Inspectable`s are data structures on which Steps can be performed. Therefore in order to add a new `Step`:

- a `config.Step` DSL structure for it has to be defined
- an implementation of action defined as per DSL has to be defined for `Inspectable`.

The latter can be described in form of `transform` function that builds upon a recursive generic JSON-transforming structure.

## Conditions

Conditions are a lot like steps but as they are triggered earlier before `Inspectable`s are created. They do operate upon JSON data and need to implement behavior for basic JSON types. Therefore in order to add a new `Condition`:

- a `config.Condition` DSL structure for it has to be defined
- functions for performing `Condition` application for basic/composite JSON types have to be defined

## Bad Row types

Once new recoverable Bad Row types are added they need to be turned into `Recoverable` by supplying appropriate `Recoverable` instances. If a new `Payload` format is added it has to be turned into `Inspectable` as well.

It is important to note that we only represent recoverable bad rows as `Recoverable` instances. Not all `BadRow`s are recoverable and we strongly believe in not representing invalid states as possible.
