---
title: "Self Hosting the JavaScript Tracker on GCP"
date: "2020-04-28"
sidebar_position: 200
---

## Pre-requisites

For the purposes of this guide, we are going to assume that you want to serve the standard `sp.js` from Google Cloud Storage. To accomplish this, you will need the following:

- An account with [Google Cloud](https://cloud.google.com/)
- Access to Google Cloud Storage (GCS) within your GCP account

## Download the JavaScript tracker file

Navigate to [https://github.com/snowplow/snowplow-javascript-tracker/releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) and download the latest version of the Snowplow JavaScript Tracker sp.js file

## gzip and rename the file

- rename `sp.js` to a random 8 character string to reduce the chance of AdBlockers preventing the script from loading e.g. `gh7rnghq.js`
- `gzip` the file to reduce the file size and reduce associated cloud storage and egress costs.

From a terminal / command prompt window, navigate to where you have downloaded the file and run:

`gzip -c sp.js > gh7rnghq.js`

**N.B.** on Windows you may need to [download the gzip binaries](http://gnuwin32.sourceforge.net/packages/gzip.htm)

We will continue referring to the file as `sp.js` throughout this guide, however where `sp.js` is mentioned we are referring to your renamed and gzipped file.

## Uploading to Google Cloud Storage

### Create a storage bucket

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/) and ensure you are in the Google Cloud Project that you wish to host the Snowplow JavaScript Tracker in
2. Navigate to the [Storage section](https://console.cloud.google.com/storage/browser) of Google Cloud Console
3. Create a new bucket with the following settings

| Option                                                                                                                                                                                                                                                                             | Value                                                                                  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **Name** (also see [Add DNS Record for bucket](#add-dns-record-for-bucket-optional)) | For example, `[company-name]-sp-js`                                                    |
| **Storage region**                                                                                                                                                                                                                                                                 | Select a suitable region, multi-region offers the widest availability and highest SLAs |
| **Storage class**                                                                                                                                                                                                                                                                  | Standard                                                                               |
| Access control options                                                                                                                                                                                                                                                             | Fine grained                                                                           |

Connecting your domain to your storage bucket (optional)

You may wish to connect your domain to your Cloud Storage bucket. In this case your bucket can be named in the format of a subdomain e.g.`spassets.acme.com`.

See **[Add DNS Record for bucket](#add-dns-record-for-bucket-optional)** for additional step you'll need to take.

### Upload your file

Click _Upload Files_ and upload your tracker file.

Make future upgrades easier

We recommend that you create a folder for each version of the JavaScript tracker to make future updates easier. If you wish to do this then first create a folder corresponding to the version and place your tracker file in that folder.

### Set metadata

Open the _Edit Metadata_ popup using the file menu.

1. Alter the `Content-Encoding` value to be `gzip`
2. Alter the `Cache-Control` to `max-age=31536000`
3. Save the meta data

### Set permissions

Open the [_Edit Access_ popup](https://cloud.google.com/storage/docs/access-control/making-data-public#objects) using the file menu.

Add a new item in the table, enter the following details and click Save.

| Option | Value    |
|--------|----------|
| Entity | Public   |
| Name   | allUsers |
| Access | Reader   |

Click _Copy URL_ next to _Public to internet_ in the file browser to get the file's URL e.g. [https://storage.googleapis.com/company-name-sp-js/gh7rnghq.js](https://storage.googleapis.com/company-name-sp-js/gh7rnghq.js) 

### Add DNS Record for bucket (optional)

This will only work correctly if:

- you earlier created your bucket with a name corresponding to the subdomain (see [Creating a storage bucket](#create-bucket)) you wish to use
- you have verified ownership of this domain in Google Cloud: [https://cloud.google.com/storage/docs/domain-name-verification](https://cloud.google.com/storage/docs/domain-name-verification).

To connect your domain to your Cloud Storage bucket, you will need to create a `CNAME` record as below:

| Option | Value                     |
|--------|---------------------------|
| Name   | [your domain]             |
| Type   | CNAME                     |
| Data   | c.storage.googleapis.com. |

CNAME redirection only works on HTTP, to ensure this works on HTTPS you must follow [this troubleshooting guide](https://cloud.google.com/storage/docs/troubleshooting#https).

## Update your tracking tags

Update any existing tracking tags to point to your self-hosted file URL.
