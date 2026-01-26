---
title: "JVM-embedded Iglu repository for applications"
sidebar_label: "JVM-embedded repo"
date: "2021-03-26"
sidebar_position: 5000
description: "Embed JSON schemas in Java or Scala application resources for bootstrap schema resolution without remote dependencies."
keywords: ["jvm embedded repo", "java schema repository", "scala embedded schemas"]
---

A JVM-embedded repo is an Iglu repository **embedded** inside a Java or Scala application, typically alongside the [Scala client](/docs/api-reference/analytics-sdk/analytics-sdk-scala/index.md).

## Technical architecture

A JVM-embedded repo is simply a set of schemas stored in an Iglu-compatible path inside the `resources` folder of a Java or Scala application.

As an embedded repo, there is a no mechanism for updating the schemas stored in the repository following the release of the host application.

## Example

For an example of a JVM-embedded repo, check out the repository embedded in the Iglu Scala client itself:

[https://github.com/snowplow/iglu-scala-client/tree/0.1.0/src/main/resources/iglu-client-embedded](https://github.com/snowplow/iglu-scala-client/tree/0.1.0/src/main/resources/iglu-client-embedded)

This embedded repository is used to bootstrap the Iglu Scala client with JSON Schemas that it needs before it can access any remote repositories.

## Setup

### 1. Prepare your files

You need to create a file structure for your JSON Schemas. Please check out the template we provide here:

[https://github.com/snowplow/iglu/tree/master/2-repositories/jvm-embedded-repo/template](https://github.com/snowplow/iglu/tree/master/2-repositories/jvm-embedded-repo/template)

Make the following changes:

- Replace `com.myvendor` with your company domain, reverse-ordered
- Replace `myschema` with the name of your first JSON Schema
- Leave `jsonschema` as-is (we only support JSON Schemas for now)
- Replace `1-0-0` with the schema specification of your first JSON Schema

Writing JSON Schemas is out of scope for this setup guide - see [Self-describing-JSONs-and-JSON-Schemas](/docs/api-reference/iglu/common-architecture/self-describing-json-schemas/index.md) for details.

Done? Now you are ready to embed your files.

### 2. Embed your files

You now need to embed your JSON Schema files into your Java or Scala application.

The Iglu Scala client will expect to find these JSON Schema files included in the application as resources. Therefore, you should store the files in a path something like this:

```text
myapp/src/main/resources/my-repo/schemas
```

### 3. Update your Iglu client configuration

Finally, update your Iglu client configuration so that it can resolve your new repository.

For details on how to do this, check out the page on [Iglu client configuration](/docs/api-reference/iglu/iglu-resolver/index.md). In the case above, the `path` you would specify for your embedded Iglu repository would be simply `/my-repo`.
