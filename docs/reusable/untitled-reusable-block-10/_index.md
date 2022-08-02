### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/ip\_lookups/jsonschema/2-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0) Compatibility R103 Data provider [MaxMind](https://www.maxmind.com/en/home)

### Overview

MaxMind offers five different databases with information on different IP addresses which can be used with Snowplow, one free:

- [GeoLite2 Free Database](https://dev.maxmind.com/geoip/geoip2/geolite2/), which contains geographic information (e.g. country) by IP address

and four paid for databases:

- [GeoIP2 City](https://www.maxmind.com/en/geoip2-city?rld=snowplow), which also contains geographic information, but that with a lot more precision and coverage than that found in the GeoLite2 Free Database
- [GeoIP2 ISP](https://www.maxmind.com/en/geoip2-isp-database?rld=snowplow), which contains information about the ISP serving that IP
- [GeoIP2 Domain](https://www.maxmind.com/en/geoip2-domain-name-database?rld=snowplow), which contains information about the domain at that IP address
- [GeoIP2 Connection Type](https://www.maxmind.com/en/geoip2-connection-type-database?rld=snowplow), which contains information about the connection type at that IP address.

You need to decide which of the different Maxmind databases listed above you wish to enrich your data with, and then setup the enrichment configuration accordingly. You need to download the relevant databases (as .MMDB files) from Maxmind, upload them to Amazon S3 (if running Snowplow on AWS) or Cloud Storage (if running Snowplow on GCS), and then set the parameters in the enrichment configuration to identify which database should be used to perform each enrichment as described below. There are four possible fields you can add to the “parameters” section of the enrichment configuration JSON: “geo”, “isp”, “domain”, and “connectionType” to dictate which database:

- The `database` field contains the name of the database file.
- The `uri` field contains the URI of the bucket in which the database file is found. Can have either `http:`, `s3:` or `gs:` as the scheme. Must _not_ end with a trailing slash.

| **Field name** | **MaxMind Database name** | **Lookup description** | **Accepted database filenames** | **Fields populated** |
| --- | --- | --- | --- | --- |
| `"geo"` | [GeoIP2 City](https://www.maxmind.com/en/geoip2-city?rld=snowplow) or [GeoLite2 City](https://dev.maxmind.com/geoip/geoip2/geolite2/?rld=snowplow) | Information related to geographic location | `"GeoLite2-City.mmdb"` or `"GeoIP2-City.mmdb"` | `geo_country`, `geo_region`, `geo_city`, `geo_zipcode`, `geo_latitude`, `geo_longitude`, `geo_region_name`, `geo_timezone` |
| `"isp"` | [GeoIP2 ISP](https://www.maxmind.com/en/geoip2-isp-database?rld=snowplow) | Internet Service Provider | `"GeoIP2-ISP.mmdb"` | `ip_isp` |
| `"domain"` | [GeoIP2 Domain](https://www.maxmind.com/en/geoip2-domain-name-database?rld=snowplow) | Second level domain name associated with IP address | `"GeoIP2-Domain.mmdb"` | `ip_domain` |
| `"connectionType"` | [GeoIP2 Connection Type](https://www.maxmind.com/en/geoip2-connection-type-database?rld=snowplow) | Estimated connection type | `"GeoIP2-Connection-Type.mmdb"` | `ip_netspeed` |

**Field name** is the name of the field in the ip\_lookups enrichment configuration JSON which you should include if you wish to use that type of lookup. That field should have two subfields: “uri” and “database”. **MaxMind Database name** is the name of the database which that lookup uses. **Lookup description** describes the lookup. **Accepted database filenames** are the strings which are allowed in the “database” subfield. If the file name you provide is not one of these, the enrichment JSON will fail validation. **Fields populated** are the names of the database fields which the lookup fills. For each of these services you wish to use, add a corresponding field to the enrichment JSON. The fields names you should use are “geo”, “isp”, “organization”, “domain”, and “netspeed”.

### Examples

Here is a maximalist example configuration JSON, which performs all four types of lookup using the MaxMind commercial files, on AWS:

{
	"schema": "iglu:com.snowplowanalytics.snowplow/ip\_lookups/jsonschema/2-0-0",

	"data": {

		"name": "ip\_lookups",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"geo": {
				"database": "GeoIP2-City.mmdb",
				"uri": "s3://my-private-bucket/third-party/maxmind"
			},
			"isp": {
				"database": "GeoIP2-ISP.mmdb",
				"uri": "s3://my-private-bucket/third-party/maxmind"
			},
			"domain": {
				"database": "GeoIP2-Domain.mmdb",
				"uri": "s3://my-private-bucket/third-party/maxmind"
			},
			"connectionType": {
				"database": "GeoIP2-Connection-Type.mmdb",
				"uri": "s3://my-private-bucket/third-party/maxmind"
			}
		}
	}
}

Here is another example of a maximalist setup on GCP:

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0",
  "data": {
    "name": "ip_lookups",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "geo": {
        "database": "GeoIP2-City.mmdb",
        "uri": "gs://my-private-bucket/third-party/maxmind"
      },
      "isp": {
        "database": "GeoIP2-ISP.mmdb",
        "uri": "gs://my-private-bucket/third-party/maxmind"
      },
      "domain": {
        "database": "GeoIP2-Domain.mmdb",
        "uri": "gs://my-private-bucket/third-party/maxmind"
      },
      "connectionType": {
        "database": "GeoIP2-Connection-Type.mmdb",
        "uri": "gs://my-private-bucket/third-party/maxmind"
      }
    }
  }
}
```

Here is a simpler example configuration with just the free file, on AWS:

{
	"schema": "iglu:com.snowplowanalytics.snowplow/ip\_lookups/jsonschema/2-0-0",

	"data": {

		"name": "ip\_lookups",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"geo": {
				"database": "GeoLite2-City.mmdb",
				"uri": "s3://my-private-bucket/third-party/maxmind"
			}
		}
	}
}

### Data sources

The only input value for this enrichment comes from `ip` parameter, which maps to `user_ipaddress` field in `atomic.events` table.

### Algorithm

This enrichment uses 3rd party, [MaxMind](https://www.maxmind.com/en/home), service to look up data associated with the IP address. MaxMind offer industry-leading IP intelligence data updated monthly.

### Data generated

Below is the summary of the fields in `atomic.events` table driven by the result of this enrichment (no dedicated table).

| Field | Purpose |
| --- | --- |
| `geo_country` | Country of IP origin |
| `geo_region` | Region of IP origin |
| `geo_city` | City of IP origin |
| `geo_zipcode` | Zip (postal) code |
| `geo_latitude` | An approximate latitude (coordinates) |
| `geo_longitude` | An approximate longitude (coordinates) |
| `geo_region_name` | Region |
| `ip_isp` | ISP name |
| `ip_organization` | Organization name for larger networks |
| `ip_domain` | Second level domain name |
| `ip_netspeed` | Indication of connection type (dial-up, cellular, cable/DSL) |
