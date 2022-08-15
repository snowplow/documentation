---
title: "Migrating from 0.1.0"
date: "2020-04-15"
sidebar_position: 60
---

From a user point-of-view changes in recovery process introduced in 0.2.0 boil down to:

- data sinks
- configuration

### Data Sinks

Since version 0.2 data is delivered to PubSub (GCP) and Kinesis (AWS) and only failed (ones which did not get recovery flows successfully applied) and unrecoverable (ones which are considered faulty beyond fixing) are stored in GCS (GCP) and S3 (AWS) buckets. These require additional command-line output parameters: `--failedOutput` and `--unrecoverableOutput` pointing to bucket paths.

### Configuration

As described in Concepts, configuration is significantly different and instead of introducing specific set of custom JSON configuration objects relies on more generic approach built upon JSON Patch. In order to migrate existing configurations to work with 0.2.0+ versions of recovery they should be migrates as follows:

| 0.1.x                             | 0.2.x        | Comments                                                                                                                                        |
|-----------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| PassThrough                       | -            | empty steps mean pass-through                                                                                                                   |
| ReplaceInQueryString              | Replace step | query string is deconstructed into individual parameters or querystring fields depending on bad row type                                        |
| RemoveFromQueryString             | Replace step | query string is deconstructed into individual parameters or querystring fields depending on bad row type                                        |
| ReplaceInBase64FieldInQueryString | Replace step | Base64-encoded and inline JSON fields are treated just as any other field. Structure within base64-encoded strings can be accessed by JsonPath. |
| ReplaceInBody                     | Replace step |
| RemoveFromBody                    | Remove step  |
| ReplaceInBase64FieldInBody        | Replace step | Base64-encoded and inline JSON fields are treated just as any other field. Structure within base64-encoded strings can be accessed by JsonPath. |

### Examples

| 0.1.x | {"name": "ReplaceInBase64FieldInBody","error": "instance type (object) does not match any allowed primitive type (allowed: [\"null\",\"string\"])\n level: \"error\"\n schema: {\"loadingURI\":\"#\",\"pointer\":\"/properties/device/properties/geo/properties/country_iso2\"}","base64Field": "ue_px","toReplace": "\"country_iso2\":\{([^}]+)\}","replacement": "\"country_iso2\":\"bad_country_iso2.Str\""} |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.2.x | {"op": "Replace","path": "parameters.cx.country_iso2","match": "(?U)^.*$","value": "bad_country_iso2.Str"}                                                                                                                                                                                                                                                                                                      | If the step is to be applied only to those rows that contain specific values the step may be combined with a condition, ie:{"op": "Test","path": "parameters.cx.country_iso2","value": { "regex": ".*"}} |
