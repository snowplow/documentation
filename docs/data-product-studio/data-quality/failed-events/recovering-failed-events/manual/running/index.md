---
title: "Running"
description: "Manual processes for running failed event recovery to restore data quality in your behavioral analytics pipeline."
schema: "TechArticle"
keywords: ["Manual Recovery", "Event Recovery", "Failed Events", "Data Recovery", "Event Repair", "Manual Process"]
date: "2020-07-22"
sidebar_position: 30
---

Now that we've discussed configuring the recovery, let's dive in to running it on your pipeline.

First we'll need to define configuration:

## Define configuration

The configuration consists of the `resolver-config.json` that your pipeline uses to resolve events against corresponding schema, for example:

```json
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-1",
  "data": {
    "cacheSize": 0,
    "repositories": [
      {
        "name": "Iglu Central",
        "priority": 0,
        "vendorPrefixes": [
          "com.snowplowanalytics"
        ],
        "connection": {
          "http": {
            "uri": "http://iglucentral.com"
          }
        }
      }
    ]
  }
}
```

Also, the`job-config.json` which describes the recovery job to be done, for example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/4-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-0": [
      {
        "name": "passthrough",
        "conditions": [],
        "steps": []
      }
    ]
  }
}
```

## Encode configuration

Configuration is supplied to recovery jobs as a Base64-encoded string. You can use your encoding plugin of choice, but here is an example [ammonite](http://ammonite.io/) script you can use to encode your configuration:

```scala
import java.util.Base64
import java.nio.charset.StandardCharsets
import ammonite.ops._
import $ivy.`io.circe::circe-parser:0.13.0`, io.circe._, io.circe.syntax._, io.circe.parser._

val load = (path: String)  => read! os.Path(path, base = os.pwd)
val encode = (str: String)  => Base64.getEncoder.encodeToString(str.getBytes(StandardCharsets.UTF_8))

@main def run(config: String): Unit =
  parse(load(config)) match {
    case Right(data)  => println(encode(data.asJson.noSpaces))
    case Left(err)  => println(s"Invalid JSON input in: ${err.getMessage}")
  }
```

And then just run (assuming ammonite is on your path and above script is called `encode.sc`:

```bash
amm ./encode.sc resolver-config.json
amm ./encode.sc job-config.json
```

Once the configuration files are encrypted it's time to deploy the recovery job on your pipeline.

## Deploy the job

There are several runtimes that recovery process can be deployed to:
