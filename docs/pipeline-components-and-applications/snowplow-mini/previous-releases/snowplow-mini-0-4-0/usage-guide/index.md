---
title: "Usage Guide"
date: "2020-04-03"
sidebar_position: 20
---

This page refers to version 0.4.0 of Snowplow Mini for AWS. It also assumes an already running Snowplow Mini instance. 

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates (because they can)

## First time usage

This section is dedicated to the steps that need performing when accessing the Snowplow Mini instance for the first time.

### Connecting to the instance for the first time

You can access the Snowplow Mini instance at the `http://<public dns>/home` address. While accessing Snowplow Mini services, HTTP authentication is required. As a result, you will be prompted for credentials which are `USERNAME_PLACEHOLDER` and `PASSWORD_PLACEHOLDER` by default.

You **should** change these default credentials to something to your liking by going to the Control Plane tab (the last one) and fill the "Change username and password for basic http authentication" form towards the bottom.

You will then be prompted for those new credentials.

### Changing the super API key for the local Iglu schema registry

As as second step, you should change the super API key for the Iglu schema registry that is bundled with Snowplow Mini. This API key can be changed via the Control Plane tab.

Given that this API key must be a UUID, you will need to generate one by running `uuidgen` at the command line, or by using an online UUID generator like [this one](https://www.uuidgenerator.net/). Make a note of this UUID, you'll need it to upload your own event and context schemas to Snowplow Mini in the next subsection.

### Generating a pair of read/write API keys for the local Iglu schema registry

To add schemas to the Iglu repository bundled with Snowplow Mini, you have to create a dedicated pair of API keys:

- Navigate to `http://<public dns>/iglu-server`
- Input the super API key set up in step 2.2 in the input box in the top right corner
- Develop the `keygen` section
- Develop the `POST /api/auth/keygen` operation
- Input the appropriate `vendor_prefix` for this API key
- Click `Try it out!`
- You should receive a JSON similar to:

```
{
  "read":"bfa90866-ab14-4b92-b6ef-d421fd688b54",
  "write":"6175aa41-d3a7-4e4f-9fb4-3a170f3c6c16"
}
```

### Copying your Iglu repository to Snowplow Mini (optional)

To test and send non-standard Snowplow events such as your own custom-contexts and unstructured events you can load them into the Iglu repository local to the Snowplow Mini instance.

1. Get a local copy of your Iglu repository which contains your schemas. This should be modelled after [this folder](https://github.com/snowplow/iglu-central/tree/master/schemas)
2. Download the latest Igluctl from Github:

```
wget https://github.com/snowplow-incubator/igluctl/releases/download/0.2.0/igluctl_0.2.0.zip
unzip -j igluctl_0.2.0.zip
```

1. Run the executable with the following input:

- The address of the Iglu repository: `http://<public dns>/iglu-server`
- The Super API Key you created in step 2.2
- The path to your schemas For example to load the `iglu-central` repository into Iglu Server:

```
/path/to/igluctl static push iglu-central/schemas http://<public dns>/iglu-server 980ae3ab-3aba- 4ffe-a3c2-3b2e24e2ffce --public
```

Note: this example assumes the `iglu-central` repository has been cloned in the same directory as where executable is run.

1. After uploading the schemas, you will need to clear the cache with the restart button under the Control Plane tab in the Snowplow Mini dashboard.

### Setting up HTTPS (optional)

If you want to use HTTPS to connect to Snowplow Mini, you need to submit a domain name via the Control Plane. Make sure that the domain name you submit is redirected to the IP of the server Snowplow Mini is running from.

## Sending events to Snowplow Mini

Now that the first time usage steps have been dealt with, you can send some events!

### Example events

An easy way to quickly send a few test events is to use our example web page.

1. Open up the Snowplow Mini UI at: `http://<public dns>/home`
2. Login with username and password which you choose in step 2.1
3. Select the `Example Events` tab
4. Press the event triggering buttons on the page!

### Events from tracker

You can instrument any other Snowplow tracker by specifying the collector URL as the public DNS of the Snowplow Mini instance.

## Accessing the Elasticsearch API

Snowplow Mini makes the Elasticsearch HTTP API available at `http://<public dns>/elasticsearch`, you can check it's working by:

- Checking the Elasticsearch API is available:
    - `curl --user username:password http://<public dns>/elasticsearch`
    - You should see a `200 OK` response
- Checking the number of good events we sent in step 3:
    - `curl --user username:password http://<public dns>/elasticsearch/good/good/_count`
    - You should see the appropriate count of sent events

## Viewing the data in Kibana

Data sent to Snowplow Mini will be processed and loaded into Elasticsearch in real time. In turn, it will be made available in Kibana. To view the data in Kibana, navigate in your browser to `http://<public dns>/kibana`

### Index patterns

Snowplow Mini comes with two index patterns:

- `good` : For all of your good events, indexed on `collector_tstamp`.
- `bad` : For all of your bad events, indexed in `failure_tstamp`.

### Discover your data

Once you've loaded Kibana you should be able to view the data via the discover interface.

You can view the number of events recorded over time on the histogram at the top. By selecting one of the bars you can zoom into just those events and can then inspect the individual event data.

## Uploading custom enrichments

You can add new custom enrichments via the Control Plane tab. The only thing you have to do is submit the enrichment file which you created according to this [wiki page](https://github.com/snowplow/snowplow/wiki/Configurable-enrichments). If the enrichment relies on additional schemas these should be uploaded to the Iglu repository.

#### [](https://github.com/snowplow/snowplow-mini/wiki/Usage-guide---0.4.0#please-note)Please note:

The [PII Enrichment](https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment) is not compatible with this version of Snowplow Mini. A new version which will work with the PII enrichment is expected to be released before the 28th of May 2018.

## Adding a custom schema

- Input the write API key created in subsection 2.3 in the input box in the top right corner
- Develop the `schemas` section
- Develop the `POST /api/schemas/{vendor}/{name}/{schemaFormat}/{version}` operation
- Fill the vendor, name, format, version and body according to your schema in the form
- Click `Try it out!`

## Adding an external Iglu repository

If you already have an external Iglu repository available, instead of copying it inside the Iglu repository bundled with the Snowplow Mini instance as shown in 2.4, you can add it directly with the Control Plane's `Add an external Iglu repository` form. Note that if you're using a static repository hosted on S3, you can omit providing an API key.
