---
title: "IP lookup enrichment"
sidebar_position: 10
sidebar_label: IP lookup
description: "Resolve IP addresses to geographic locations and ISP information using MaxMind databases."
keywords: ["IP lookup", "geolocation", "MaxMind"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"
import XForwardedForPlugin from "@site/docs/reusable/x-forwarded-for-plugin/_index.md"
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment uses [MaxMind](https://www.maxmind.com/en/geoip2-databases) databases to look up useful data based on the IP address collected by your Snowplow tracker.

MaxMind maintains databases of information like geographic location, second level domain names (e.g. `acme.com`), Internet Service Provider, organization name, and several other data points publicly associated with a given IP address.

Starting with Enrich 6.7.0, the enrichment supports ASN information, which is useful for detecting bot traffic coming from cloud computing providers. To enable this, provide either the ISP or the free ASN database through the `isp` or `asn` setting respectively.

## Select the MaxMind databases

MaxMind offers a free tier and a paid tier of databases.

From the free tier, you can provide two databases to Snowplow:

- [GeoLite2 City Database](https://dev.maxmind.com/geoip/docs/databases/city-and-country/), which contains geographic information (e.g. country) by IP address
- [GeoLite2 ASN Database](https://dev.maxmind.com/geoip/docs/databases/asn/), supported from Enrich 6.7.0, which contains autonomous system numbers by IP address

From the paid tier, you can provide four databases to Snowplow:

- [GeoIP2 City](https://dev.maxmind.com/geoip/docs/databases/city-and-country/), which also contains geographic information, but with more precision and coverage than the GeoLite2 City Database
- [GeoIP2 ISP](https://dev.maxmind.com/geoip/docs/databases/isp/), which contains information about the ISP serving that IP, and a more complete ASN mapping compared to the GeoLite2 ASN Database
- [GeoIP2 Domain](https://dev.maxmind.com/geoip/docs/databases/domain/), which contains information about the domain at that IP address
- [GeoIP2 Connection Type](https://dev.maxmind.com/geoip/docs/databases/connection-type/), which contains information about the connection type at that IP address.

## Host the databases in your cloud

:::tip[Free databases included in Snowplow CDI]

If you're a Snowplow CDI customer, the free-tier MaxMind database files are already provided and updated by Snowplow, so you don't need this step.

There's a pre-configured URI for the directory containing these files. You can find it in the default enrichment configuration in [Console](https://console.snowplowanalytics.com).

:::

Once downloaded, take the `.mmdb` files and upload them to a location on your cloud:
- Amazon S3 if running Snowplow on AWS e.g. `s3://my-private-bucket/third-party/maxmind`
- Azure ADLS if running Snowplow on Azure e.g. `https://my-private-storage-container.dfs.core.windows.net/third-party/maxmind`
- Google Cloud Storage if running Snowplow on GCS e.g. `gs://my-private-bucket/third-party/maxmind`

If the databases need updating in future, download the latest version and overwrite this file in your storage.

MaxMind also offer a method to [download and update their databases programmatically](https://dev.maxmind.com/geoip/updating-databases/#using-geoip-update).

## Configure the enrichment

<TestingWithMicro>

Note that to test this enrichment, you will need events with realistic IP addresses, not local ones like `192.168.0.42`.

This isn't an issue if running Micro through Console, but will be trickier if running locally.

<XForwardedForPlugin/>

Alternatively, you can [set up Micro to receive external IP addresses](/docs/testing/snowplow-micro/local/remote-usage/index.md#exposing-micro-via-a-public-domain-name).

</TestingWithMicro>

The enrichment takes these parameters:

| Parameter        | Required | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `geo`            | ❌        | MaxMind GeoIP2 / GeoLite2 City database. |
| `isp`            | ❌        | MaxMind GeoIP2 ISP database.             |
| `domain`         | ❌        | MaxMind GeoIP2 Domain database.          |
| `connectionType` | ❌        | MaxMind GeoIP2 Connection Type database. |
| `asn`            | ❌        | MaxMind GeoLite2 ASN database.           |


<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. Keep the Console defaults for the `uri` fields, unless you are using a custom paid database. For example:

```json
{
  "geo": {
    "database": "GeoLite2-City.mmdb",
    "uri": "<use default value from Console>"
  },
  "asn": {
    "database": "GeoLite2-ASN.mmdb",
    "uri": "<use default value from Console>"
  }
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-1",
  "data": {
    "name": "ip_lookups",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "geo": {
        "database": "GeoLite2-City.mmdb",
        "uri": "<your file location>"
      },
      "asn": {
        "database": "GeoLite2-ASN.mmdb",
        "uri": "<your file location>"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

Each of the parameters is an object with two required fields: `database` and `uri`:
- The `database` field is an enum that contains the name of the MaxMind database file.
- The `uri` field contains the URI of the bucket in which the database file is found. This can have either `http:` or `s3:` or `gs:` as the scheme, and must not end with a trailing slash.

:::tip[URI values]
If you are using Snowplow CDI and the free MaxMind databases, use the same default value you can see in Console for all `uri` fields, whether `geo`, `asn`, etc.

Otherwise, provide the location (e.g. `s3://my-private-bucket/third-party/maxmind`) where you uploaded the files.
:::

Allowed database filenames are as follows. If the filename you provide isn't one of these, the enrichment JSON will fail validation, causing a failed event.

| Parameter        | Valid database names                                   |
| ---------------- | ------------------------------------------------------ |
| `geo`            | `GeoLite2-City.mmdb` (free)  `GeoIP2-City.mmdb` (paid) |
| `isp`            | `GeoIP2-ISP.mmdb`                                      |
| `domain`         | `GeoIP2-Domain.mmdb`                                   |
| `connectionType` | `GeoIP2-Connection-Type.mmdb`                          |
| `asn`            | `GeoLite2-ASN.mmdb`                                    |

## Output

This enrichment populates the [atomic table fields prefixed with `geo_` and `ip_`](/docs/fundamentals/canonical-event/index.md#ip-address-fields).

If ASN data is available, the enrichment also adds an `asn` entity to the enriched event.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    number: 16509,
    organization: "Amazon.com, Inc."
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for ASN entity generated by IP lookup enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "asn", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "number": { "type": "integer", "minimum": 0, "maximum": 2147483647, "description": "The autonomous system number associated with the IP address" }, "organization": { "type": ["string", "null"], "description": "The organization associated with the registered autonomous system number for the IP address" }, "likelyBot": { "type": "boolean", "description": "Populated by the ASN lookup enrichment. Set to true if the ASN belongs to hosting providers, data centers, etc." } }, "required": ["number"], "additionalProperties": false }} />
