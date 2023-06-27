---
title: "R32 Upgrade Guide"
date: "2020-03-06"
sidebar_position: 700
---

We recommend to go through the upgrade routine in several independent steps. After every step you should have a working pipeline. If something is not working or Shredder produces unexpected bad rows - please let us know.

## Updating assets

1. Upgrade EmrEtlRunner to R116 or higher
2. In your `redshift_config.json`
    1. Update SchemaVer to `4-0-0`
    2. Add `"blacklistTabular": null` field into `data` payload
3. Update your `config.yml` file

```yaml
aws:
  emr:
    ami_version: 5.19.0     # was 5.9.0; Required by RDB Shredder 
storage:
  versions:
    rdb_loader: 0.17.0      # was 0.16.0
    rdb_shredder: 0.16.0    # was 0.15.0
```

At this point, your pipeline should be running with new assets as it was before, without automigrations and generated TSV. We recommend to test this setup and monitor shredded bad rows for one or two runs before proceeding to enabling automigrations.

## Iglu Server

Automigrations work only with Iglu Server 0.6.0. This component provides information about how columns should be ordered across different ADDITIONs and REVISIOINs. If you still don't have Iglu Server 0.6.0 we recommend to [set it up](https://github.com/snowplow/iglu/wiki/Setting-up-an-Iglu-Server).

You still can use static registries as a backup, they will continue to work for validatioin purposes, but won't work for TSV shredding. Snowplow does not provide a public Iglu Server hosting Iglu Central schemas, so we recommend you to mirror Iglu Central with your own Iglu Server:

```bash
$ git clone https://github.com/snowplow/iglu-central.git
$ igluctl static push iglu-central/schemas $YOUR_SERVER_URL $YOU_API_KEY
$ igluctl static push com.acme-iglu-registry/schemas $YOUR_SERVER_URL $YOU_API_KEY
```

After setting up the Iglu Server, don't forget to add it to your resolver config.

## Tabular blacklisting

New RDB Shredder is still able to produce legacy JSON files. But automigrations can be applied only to tables where data is prepared as TSV. If you setup a new pipeline, you can generate only TSVs abandoning legacy DDLs (except `atomic.events` and `atomic.manifest`) and [JSONPaths](https://discourse.snowplow.io/t/jsonpaths-files-demystified/269) altogether. However, if you already have tables deployed which DDLs were generated manually or via old igluctl you will likely need to apply so called _tabular blacklisting_ to these tables. It means that Shredder will keep producing data with these schemas as JSONs and Loader won't be able to apply migrations to it. This is necessary because manually generated DDLs are not guaranteed to have predictable column order and the only way to map JSON values to respective columns is JSONPaths files.

[igluctl 0.7.0](https://discourse.snowplow.io/t/igluctl-0-7-0-released/3620) provides `rdbms table-check` subcommand that get schemas from Iglu Server, figures out what DDL the Loader would generate, then connects to Redshift and compares those DDLs with actual state of the table.  
Every table that have an incompatible order will have to be "blacklisted" in Redshift storage target config (`redshift_config.json`).

Here's an example of a black list containing several schemas from Iglu Central:

```json
  "blacklistTabular": [
    "iglu:org.w3/PerformanceTiming/jsonschema/1-*-*",

    "iglu:com.snowplowanalytics.snowplow/timing/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/client_session/jsonschema/1-*-*",
    "iglu:com.snowplowanalytics.snowplow/application_error/jsonschema/1-*-*",

    "iglu:com.mandrill/recipient_unsubscribed/jsonschema/1-*-*",
    "iglu:com.mandrill/message_soft_bounced/jsonschema/1-*-*",
    "iglu:com.mandrill/message_sent/jsonschema/1-*-*",
    "iglu:com.mandrill/message_opened/jsonschema/1-*-*",
    "iglu:com.mandrill/message_marked_as_spam/jsonschema/1-*-*",
    "iglu:com.mandrill/message_delayed/jsonschema/1-*-*",
    "iglu:com.mandrill/message_clicked/jsonschema/1-*-*",
    "iglu:com.mandrill/message_bounced/jsonschema/1-*-*"
  ]
```

As you can see, schemas specified in schema criterion format (with wildcards everywhere except MODEL).

## Conclusion

At this point if you track an event with new schema and this schema resides on an Iglu Server - RDB Shredder will produce TSV data for it and RDB Loader will automatically create a new table. Same with ADDITION and REVISION migrations - they're handled by RDB Loader automatically.
