---
title: "Iglu Central Setup"
date: "2021-03-26"
sidebar_position: 50
---

This guide is designed for Iglu users wanting to create a public mirror or private clone of [Iglu Central](/docs/migrated/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/). There are a couple of reasons you may want to do this:

1. Some Snowplow components require a Iglu Server, so the static Iglu Central repository will not work.
2. You may want to access Iglu Central from a software system that cannot access the open internet.
3. You may want a mirror of Iglu Central which has lower latency to your software system.

This guide is divided into two sections:

1. Create Iglu Central Mirror
2. Update your Iglu client configuration to point to your new Iglu Central

## Create Iglu Central Mirror

### Hosting an Iglu Server based mirror

Some components of Snowplow require an Iglu Server, and a static repo will not work. This means you'll want to host a mirror of Iglu Central. You can mirror Iglu Central using `[igluctl](/docs/migrated/pipeline-components-and-applications/iglu/igluctl)`:

```
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://MY-IGLU-URL 00000000-0000-0000-0000-000000000000
```

For further information on Iglu Central, consult the [Iglu Central setup guide](/docs/migrated/pipeline-components-and-applications/iglu/iglu-central-setup/).

### Hosting a Static Repository based mirror

Iglu Central is built on top of the Iglu static repo server, so the first step is to [setup a static repo](/docs/migrated/pipeline-components-and-applications/iglu/setting-up-iglu/step-2-setup-an-iglu-repository/2-1-a-static-repo/). You can give your copy of Iglu Central a name like:

```
http://iglucentral.acme.com
```

Once you have completed this static repo setup, then copy into your `/schemas` sub-folder **all** of the schemas that you can find [in the Iglu Central GitHub Repo](https://github.com/snowplow/iglu-central/tree/master/schemas)

Once you have done this, check that your schemas are publically accessible, for example:

```
http://iglucentral.acme.com/schemas/com.snowplowanalytics.self-desc/instance/jsonschema/1-0-2
```

## [](https://github.com/snowplow/iglu/wiki/Iglu-Central-setup#update-your-iglu-client-configuration)Update your Iglu client configuration

You now need to update your Iglu client configuration to point to your Iglu Central mirror, rather than the original.

Given a standard Iglu client configuration:

```
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-2",
  "data": {
    "cacheSize": 500,
    "repositories": [
      {
        "name": "Iglu Central",
        "priority": 0,
        "vendorPrefixes": [ "com.snowplowanalytics" ],
        "connection": {
          "http": {
            "uri": "http://iglucentral.com"
          }
        }
      }
    ]
  }
}
```

Update it to point to your Iglu Central mirror:

```
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-2",
  "data": {
    "cacheSize": 500,
    "repositories": [
      {
        "name": "Acme Corp's Iglu Central mirror",
        "priority": 0,
        "vendorPrefixes": [ "com.snowplowanalytics" ],
        "connection": {
          "http": {
            "uri": "http://iglucentral.acme.com"
          }
        }
      }
    ]
  }
}
```

And that's it - your Iglu client should now resolve to your Iglu Central mirror, rather than the original.
