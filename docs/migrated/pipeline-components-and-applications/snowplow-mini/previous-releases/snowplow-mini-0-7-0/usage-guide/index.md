---
title: "Usage Guide"
date: "2020-04-03"
sidebar_position: 30
---

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

**Note that only alphanumeric passwords are supported.**

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
wget https://github.com/snowplow-incubator/igluctl/releases/download/0.7.0/igluctl_0.7.0.zip
unzip -j igluctl_0.7.0.zip
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

### Setting baseURL for Swagger UI (optional)

Behind the scenes, Snowplow Mini 0.6.0 uses Iglu Server 0.3.0 which [introduced](https://snowplowanalytics.com/blog/2018/04/19/iglu-r9-bulls-eye-released/#server-improvements) a new configuration parameter, `repo-server.baseURL` for Swagger UI to function properly.

This is an optional step as you may want to interact with Iglu Server through other channels, e.g. `cURL`.

If you'd like to use Swagger UI, you need to follow rest of this section.

Browse to Control plane tab on home page and you should see `Upload Iglu Server config file:` form towards top of the page.

Save Iglu Server [configuration](https://github.com/snowplow/snowplow-mini/blob/master/provisioning/resources/configs/iglu-server.conf).

Set `repo-server.baseURL` to Snowplow Mini's public DNS, i.e. deployment address. Note that you should omit the protocol (i.e. http(s)://), because Swagger UI will automatically prepend that. You should also append `/iglu-server`. Note that there is no trailing slash.

For example, if your deployment address is [http://my-iglu-server.com](http://my-iglu-server.com/) then your `baseURL` should be `my-iglu-server.com/iglu-server`.

Upload the file through Control Plane. A notification `Uploaded successfully` should appear at right top of the page. Now Swagger UI is ready for use.

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

Once you've loaded Kibana you should be able to view the data via the discover interface:

![](images/Screen-Shot-2020-04-13-at-13.20.22.png)

This is the Kibana Discover UI. You can view the number of events recorded over time on the histogram at the top. By selecting one of the bars you can zoom into just those events:

![](images/Screen-Shot-2020-04-13-at-13.32.26.png)

You can then inspect the individual event data in the UI below:

![](images/Screen-Shot-2020-04-13-at-13.23.16.png)

## Uploading custom enrichments

You can add new custom enrichments via the Control Plane tab. The only thing you have to do is submit the enrichment file which you created according to this [wiki page](https://github.com/snowplow/snowplow/wiki/Configurable-enrichments). If the enrichment relies on additional schemas these should be uploaded to the Iglu repository.

## Adding a custom schema

- Input the write API key created in subsection 2.3 in the input box in the top right corner
- Develop the `schemas` section
- Develop the `POST /api/schemas/{vendor}/{name}/{schemaFormat}/{version}` operation
- Fill the vendor, name, format, version and body according to your schema in the form
- Click `Try it out!`

## Adding an external Iglu repository

If you already have an external Iglu repository available, instead of copying it inside the Iglu repository bundled with the Snowplow Mini instance as shown in 2.4, you can add it directly with the Control Plane's `Add an external Iglu repository` form. Note that if you're using a static repository hosted on S3, you can omit providing an API key.

## Using an external Postgres instance

Browse to Control plane tab on home page and you should see `Upload Iglu Server config file:` form towards top of the page.

Save Iglu Server [configuration](https://github.com/snowplow/snowplow-mini/blob/master/provisioning/resources/configs/iglu-server.conf).

Update postgres connection settings per your external Postgres connection information.

Upload the file through Control Plane. A notification `Uploaded successfully` should appear at right top of the page.

Assuming it is a clean and fresh Postgres instance, 2 tables, `apikeys` and `schemas`, are to be created by you.

Let's create `apikeys` table.

```
$ psql -h "mydbinstance.cyb6dd6wajhe.us-east-1.rds.amazonaws.com" -p 5432 -d iglu -U snowplow << EOF
> CREATE TABLE public.apikeys (uid uuid NOT NULL, vendor_prefix character varying(200) NOT NULL, permission character varying(20) DEFAULT 'read'::character varying NOT NULL, createdat timestamp without time zone NOT NULL);
> ALTER TABLE public.apikeys OWNER TO snowplow;
> ALTER TABLE ONLY public.apikeys ADD CONSTRAINT apikeys_pkey PRIMARY KEY (uid);
> EOF
```

Instead of executing multiple psql commands with each of these commands, this is a workaround to execute multiple commands at single psql command.

`>` is printed by psql after entering each line. After entering above 3 lines as input to psql, hit `EOF` keyboard combination or enter `EOF` text and `Password for user snowplow:` will appear and then we input our password.

Let's create `schemas` table similarly.

```
$ psql -h "mydbinstance.cyb6dd6wajhe.us-east-1.rds.amazonaws.com" -p 5432 -d iglu -U snowplow << EOF
> CREATE TABLE public.schemas (schemaid integer NOT NULL, vendor character varying(200) NOT NULL, name character varying(50) NOT NULL, format character varying(50) NOT NULL, version character varying(50) NOT NULL, schema text NOT NULL, createdat timestamp without time zone NOT NULL, updatedat timestamp without time zone NOT NULL, ispublic boolean NOT NULL);
> ALTER TABLE public.schemas OWNER TO snowplow;
> CREATE SEQUENCE public.schemas_schemaid_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
> ALTER TABLE public.schemas_schemaid_seq OWNER TO snowplow;
> ALTER SEQUENCE public.schemas_schemaid_seq OWNED BY public.schemas.schemaid;
> ALTER TABLE ONLY public.schemas ALTER COLUMN schemaid SET DEFAULT nextval('public.schemas_schemaid_seq'::regclass);
> ALTER TABLE ONLY public.schemas ADD CONSTRAINT schemas_pkey PRIMARY KEY (schemaid);
> EOF
```

Now that we have our tables, we need to insert a super api key into `apikeys` table.

```
psql -h "mydbinstance.cyb6dd6wajhe.us-east-1.rds.amazonaws.com" -p 5432 -d iglu -U snowplow \
-c "insert into apikeys(uid, vendor_prefix, permission, createdat) values ('8de87fb0-8b8c-4c3a-b30e-6c425bf9d268', '*', 'super', current_timestamp);"
```

Last step, for Iglu Resolver to work, you should send this apikey through `Add apikey for local Iglu Server:` form under Control Plane tab.

Now, this external Postgres is ready to be used. The schemas uploaded to Iglu Server will reside in this external Postgres instance.
