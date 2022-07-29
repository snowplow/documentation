---
title: "Setup Guide for GCP"
date: "2020-12-14"
sidebar_position: -10
---

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates (because they can)

The software stack installed:

- Snowplow Stream Collector NSQ 2.1.0
- Snowplow Stream Enrich NSQ 1.4.1
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.9
- Kibana-OSS 6.8.9
- Postgresql 9.5
- NSQ v1.2.0

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![](images/snowplow-mini-topology.jpg)

## Importing public tarballs to a GCP project

Our offering for GCP is 3 compressed tarballs for 3 different sized Snowplow Mini, produced through `gcloud`'s [`export`](https://cloud.google.com/sdk/gcloud/reference/compute/images/export) command. Simply put, they are Virtual Disk images exported in GCP format, a `disk.raw` file that has been tarred and gzipped.

To use them within GCP console, you need to import a tarball of your choice into your GCP project. You can use `gcloud` CLI utility to do that.

Browse [GCP docs](https://cloud.google.com/sdk/docs/quickstarts) to get started with `gcloud`.

Assuming you have `gcloud` setup and configured for your GCP project, use `gcloud`'s [`create`](https://cloud.google.com/sdk/gcloud/reference/compute/images/create) command to import a tarball of your choice into your GCP project.

A sample usage would be as following.

```
gcloud compute images create \
imported-sp-mini \
--source-uri \
https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-11-0-large-1604511003.tar.gz
```

Note that `imported-sp-mini` is a name of your choice for destination image and above URI is for large image, change it with your preferred version of Snowplow Mini.

| L / 2 vCPUs | XL / 4 vCPUs | XXL / 8 vCPUs |
| --- | --- | --- |
| [large](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-large-1608042992.tar.gz) | [xlarge](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-xlarge-1608041310.tar.gz) | [xxlarge](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-xxlarge-1608041173.tar.gz) |

You can find more about `gcloud compute images create` command [here](https://cloud.google.com/sdk/gcloud/reference/compute/images/create) for additional parameters.

After importing our tarball of your choice into your project, you should see it under `Images` on `Compute Engine`.

To decide on which size of Snowplow Mini to choose, read on.

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-GCP#large--xlarge--xxlarge)large & xlarge & xxlarge

Until today, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

If you want, you can download [`large`](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-large-1608042992.tar.gz) , [`xlarge`](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-xlarge-1608041310.tar.gz) and [`xxlarge`](https://storage.googleapis.com/snowplow-mini/snowplow-mini-0-12-0-xxlarge-1608041173.tar.gz) for other usages/purposes.

## Create instance

Go to `Compute Engine` on GCP console, select `Images` from menu on the left. You should see your imported image on the list. Select it then you should see `CREATE INSTANCE` button at the top of the page. Click on it.

![](images/create-instance.png)

![](images/create-instance-2.png)

![](images/create-instance-3.png)

Click `Create`.

These images show setup for `large` image. To setup `xlarge` or `xxlarge`, you should increase memory per above explanation of different sizes.
