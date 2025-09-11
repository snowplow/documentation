---
title: "Setup Guide for GCP"
description: "Set up Snowplow Mini on Google Cloud Platform for lightweight behavioral data pipeline testing."
schema: "TechArticle"
keywords: ["Mini GCP", "Mini Setup", "Google Cloud", "Testing Environment", "Development Platform", "GCP Mini"]
date: "2021-05-11"
sidebar_position: 2
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates (because they can)

<p>Version {versions.snowplowMini} (recommended) comes with:</p>

- Snowplow Collector NSQ 3.3.0
- Snowplow Enrich NSQ 5.4.0
- Snowplow Elasticsearch Loader 2.1.2
- Snowplow Iglu Server 0.13.0
- Opensearch 2.4.0
- Opensearch Dashboards 2.4.0
- Postgresql 15.1
- NSQ v1.3.0

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![](images/snowplow-mini-topology.jpg)

## Importing public tarballs to a GCP project

Our offering for GCP is 3 compressed tarballs for 3 different sized Snowplow Mini, produced through `gcloud`'s [`export`](https://cloud.google.com/sdk/gcloud/reference/compute/images/export) command. Simply put, they are Virtual Disk images exported in GCP format, a `disk.raw` file that has been tarred and gzipped.

To use them within GCP console, you need to import a tarball of your choice into your GCP project. You can use `gcloud` CLI utility to do that.

Browse [GCP docs](https://cloud.google.com/sdk/docs/quickstarts) to get started with `gcloud`.

Assuming you have `gcloud` setup and configured for your GCP project, use `gcloud`'s [`create`](https://cloud.google.com/sdk/gcloud/reference/compute/images/create) command to import a tarball of your choice into your GCP project.

A sample usage would be as following.

```bash
gcloud compute images create \
imported-sp-mini \
--source-uri \
https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-23-2-large-1749631920.tar.gz
```

Note that `imported-sp-mini` is a name of your choice for destination image and above URI is for large image, change it with your preferred version of Snowplow Mini.

<p>Version {versions.snowplowMini} (recommended)</p>

| L / 2 vCPUs | XL / 4 vCPUs | XXL / 8 vCPUs |
| --- | --- | --- |
| [large](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-23-2-large-1749631920.tar.gz) | [xlarge](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-23-1-xlarge-1749633980.tar.gz) | [xxlarge](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-23-1-xxlarge-1749639938.tar.gz) |

You can find more about `gcloud compute images create` command [here](https://cloud.google.com/sdk/gcloud/reference/compute/images/create) for additional parameters.

After importing our tarball of your choice into your project, you should see it under `Images` on `Compute Engine`.

To decide on which size of Snowplow Mini to choose, read on.

### large & xlarge & xxlarge

Mini is available in 3 different sizes:

- `large` : Opensearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Opensearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Opensearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

## Create instance

Go to `Compute Engine` on GCP console, select `Images` from menu on the left. You should see your imported image on the list. Select it then you should see `CREATE INSTANCE` button at the top of the page. Click on it.

![](images/create-instance.png)

![](images/create-instance-2.png)

![](images/create-instance-3.png)

Click `Create`.

These images show setup for `large` image. To setup `xlarge` or `xxlarge`, you should increase memory per above explanation of different sizes.

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Mini" since="0.13.0">

  If you wish to disable telemetry, you can do so via the [API](../control-plane-api/#configuring-telemetry).

</Telemetry>
```
