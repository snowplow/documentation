---
title: "Running"
date: "2020-04-13"
sidebar_position: 10
---

## Define configuration

The configuration consists of

`resolver-config.json`, for example:

```
{"schema":"iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-1","data":{"cacheSize":0,"repositories":[{"name":"Iglu-Central","priority":1,"vendorPrefixes":["com.snowplowanalytics"],"connection":{"http":{"uri":"http://iglu-central.com"}}}]}}
```

`job-config.json`, for example:

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/2-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-*": [
      {
        "name": "pass through",
        "conditions": [],
        "steps": []
      }
    ]
  }
}
```

## Encode configuration

Configuration is supplied to recovery jobs as a Base64-encoded string. Encode your configuration. You can use following [ammonite](http://ammonite.io) script to do this for you:

```
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

And then just run (assuming ammonite is on your path and above script is called `encode.sc`:

```
amm ./encode.sc resolver-config.json
amm ./encode.sc job-config.json
```

## Deploy the job

There are several runtimes that recovery process can be deployed to:
