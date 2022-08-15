---
title: "UA parser enrichment"
date: "2020-02-14"
sidebar_position: 80
---

This enrichment uses the [ua-parser library](https://github.com/ua-parser/uap-core/) to parse the user agent and provide information about the user's device.

Collecting and separating out all the valuable device information to be found in the user agent is a great way to get insight into the types of devices and operating systems and versions your users are using. This helps with deciding which to support as well as in decisions around functionality releases.

With the device family field which is part of the context you can also benefit from the lookup done with our database to sort the multitude of different devices into higher level device types like desktop, mobile, tablet, other, etc.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_config/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/ua_parser_config.json)

## Input

This enrichment uses the field `useragent`.

## Output

This enrichment adds a new context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0).

| Field | Description |
| --- | --- |
| `useragent_family` | Useragent family (browser) name |
| `useragent_major` | Useragent major version |
| `useragent_minor` | Useragent minor version |
| `useragent_patch` | Useragent patch version |
| `useragent_version` | Full version of the useragent |
| `os_family` | Operation system name |
| `os_major` | Operation system major version |
| `os_minor` | Operation system minor version |
| `os_patch` | Operation system patch version |
| `os_patch_minor` | Operation system patch minor version |
| `os_version` | Operation system full version |
| `device_family` | Device type |

As an example, the useragent string

```
Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36
```

would be parsed with the following result:

| PARAMETER | VALUE |
| --- | --- |
| useragent\_family | Chrome |
| useragent\_major | 48 |
| useragent\_minor | \- |
| useragent\_patch | 2564 |
| os\_family | Windows 7 |
| os\_major | \- |
| os\_minor | \- |
| os\_patch\_minor | \- |
| os\_version | Windows 7 |
| device\_family | Computer |

_\*empty values denoted by “-“_
