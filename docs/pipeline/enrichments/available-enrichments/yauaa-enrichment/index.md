---
title: "YAUAA enrichment"
sidebar_position: 9
sidebar_label: YAUAA
description: "Parse user agent strings with advanced detection using Yet Another UserAgent Analyzer for detailed device insights."
keywords: ["YAUAA", "user agent analysis", "device fingerprinting"]
---

YAUAA (Yet Another User Agent Analyzer) enrichment is a powerful user agent parser and analyzer.

It uses [YAUAA API](https://yauaa.basjes.nl/) to parse and analyze all user agent information of an HTTP request and extract as many relevant information as possible about the user's device and browser, like for instance the device class (Phone, Tablet, etc.).

:::warning

YAUAA parsing relies entirely on in-memory _HashMaps_ and requires roughly 400 MB of RAM (see [here](https://yauaa.basjes.nl/README-MemoryUsage.html)). Additional memory is also needed if caching is enabled (by default).

:::

There is no interaction with an external system.

## Configure your website to send client hints

The current trend in web browsers is to reduce the amount of information sent to servers in the `User-Agent` HTTP header, to help with user privacy. [Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) are a way for sites to opt in to sending the extra information which previously would have been part of the user agent header.

The YAUAA enrichment does not require you to make any changes to your website, if you are happy with the level of detail you get from the reduced user agent.  However, it is possible to improve the accuracy of the user agent data produced by YAUAA, if you are able to configure your website to send [high entropy client hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) to the collector by following these instructions.

There are two ways for your website to opt-in to sending client hints to the collector.  In the first method, you must configure your webserver to set both a [`Accept-CH` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) and a [`Permissions-Policy` HTTP header](https://www.w3.org/TR/permissions-policy-1/) when serving the your site's main HTML pages:

```
Accept-CH: sec-ch-ua, sec-ch-ua-full-version-list, sec-ch-ua-full-version, sec-ch-ua-mobile, sec-ch-ua-platform, sec-ch-ua-platform-version, sec-ch-ua-arch, sec-ch-ua-bitness, sec-ch-ua-model, sec-ch-ua-wow64
Permissions-Policy: ch-ua=("https://<YOUR COLLECTOR>"), ch-ua-full-version-list=("https://<YOUR COLLECTOR>"), ch-ua-full-version=("https://<YOUR COLLECTOR>"), ch-ua-mobile=("https://<YOUR COLLECTOR>"), ch-ua-platform=("https://<YOUR COLLECTOR>"), ch-ua-platform-version=("https://<YOUR COLLECTOR>"), ch-ua-arch=("https://<YOUR COLLECTOR>"), ch-ua-bitness=("https://<YOUR COLLECTOR>"), ch-ua-model=("https://<YOUR COLLECTOR>"), ch-ua-wow64=("https://<YOUR COLLECTOR>"),
```

Alternatively, in the second method, you can put a `meta` tag in the header secion of your site's HTML:

```
<meta http-equiv="delegate-ch" content="sec-ch-ua https://<YOUR COLLECTOR>; sec-ch-ua-full-version-list https://<YOUR COLLECTOR>; sec-ch-ua-full-version https://<YOUR COLLECTOR>; sec-ch-ua-mobile https://<YOUR COLLECTOR>; sec-ch-ua-platform https://<YOUR COLLECTOR>; sec-ch-ua-platform-version https://<YOUR COLLECTOR>; sec-ch-ua-arch https://<YOUR COLLECTOR>; sec-ch-ua-bitness https://<YOUR COLLECTOR>; sec-ch-ua-model https://<YOUR COLLECTOR>; sec-ch-ua-wow64 https://<YOUR COLLECTOR>;">
```

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/yauaa_enrichment_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/yauaa_enrichment_config.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

Only one parameter can be set in the configuration : `cacheSize`. This field determines the number of already parsed user agents that are kept in memory for faster processing. If set to 0, caching is disabled. If not set, a default size is used for the cache (10000).

## Input

This enrichment uses the following inputs:

- The `useragent` field from the Snowplow event.  Typically this field is taken from the `User-Agent` HTTP header.  But Snowplow trackers can also override the user agent by setting the `ua` field [in the tracker payload](/docs/events/index.md).
- Client hint HTTP headers.  These are [a set of standard headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) such as `Sec-CH-UA` which provide extra detail about the user agent.

## Output

This enrichment adds a new derived context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/nl.basjes/yauaa_context/jsonschema/1-0-1) (since enrich 1.4.0).

If a field can't be figured out by the algorithm, it won't be in the output. But some fields can have value _UNKNOWN_.

The only field that will always be present is `deviceClass`.

Here is an example of a derived context attached by this enrichment for a page visited with a Samsung Galaxy S9:

```json
{
  "schema":"iglu:nl.basjes/yauaa_context/jsonschema/1-0-1",
    "data": {
        "deviceClass":"Phone",
        "deviceName":"Samsung SM-G960F",
        "deviceBrand":"Samsung",
        "operatingSystemClass":"Mobile",
        "operatingSystemName":"Android",
        "operatingSystemVersion":"8.0.0",
        "operatingSystemNameVersion":"Android 8.0.0",
        "operatingSystemVersionBuild":"R16NW",
        "layoutEngineClass":"Browser",
        "layoutEngineName":"Blink",
        "layoutEngineVersion":"62.0",
        "layoutEngineVersionMajor":"62",
        "layoutEngineNameVersion":"Blink 62.0",
        "layoutEngineNameVersionMajor":"Blink 62",
        "agentClass":"Browser",
        "agentName":"Chrome",
        "agentVersion":"62.0.3202.84",
        "agentVersionMajor":"62",
        "agentNameVersion":"Chrome 62.0.3202.84",
        "agentNameVersionMajor":"Chrome 62"
   }
}
```

The full output possiblities generated by the YAUAA algorithm can be found [here](https://yauaa.basjes.nl/expect/fieldvalues/).
