---
title: "Self-served Lake Loader setup now available"
description: "More and more organizations are adopting the lakehouse paradigm – storing their data using open table formats like Apache Iceberg and Delta Lake and using a data warehouse for efficient querying."
date: "2025-01-27"
update_type:
  - "Release notes"
components:
  - "Destinations"
platforms:
  - "AWS"
---
More and more organizations are adopting the lakehouse paradigm – storing their  data using open table formats like Apache Iceberg and Delta Lake and using a data warehouse for efficient querying. This approach is cost-effective and flexible, since these table formats are supported by many different tools.

Snowplow Lake Loader — as you would expect — allows you to store Snowplow data in data lakes. We first [announced](https://snowplow.io/blog/announcing-snowplow-lake-loader) it back in 2023. Since then, the Lake Loader evolved a lot, [adding support for Iceberg table format](https://snowplow.io/blog/lake-loader-with-iceberg-and-delta-support) and expanding to AWS and GCP in addition to the initial Azure release.

Today, we are making the Lake Loader fully available in Snowplow CDI, and you can set up and manage a lake destination for your pipeline using the self-served form in our [destination catalog](https://console.snowplowanalytics.com/destinations). Select “Delta” or “Iceberg” in the “available” tab for a new destination.

If you’d like to change the settings of an existing destination, pick it from the list in the [destination catalog](https://console.snowplowanalytics.com/destinations), click “Details”, then click on the connection. You can review the connection settings and edit them via the “...” menu.

As of February 2025, we support the following combinations of clouds and formats:

* AWS + S3 + Iceberg
* AWS + S3 + Delta
* GCP + GCS + Delta
* Azure + ADLS + Delta
