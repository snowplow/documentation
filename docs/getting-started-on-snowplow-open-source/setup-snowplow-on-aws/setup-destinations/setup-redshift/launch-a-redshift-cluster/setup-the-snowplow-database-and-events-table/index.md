---
title: "Setup the Snowplow database and events table"
date: "2020-02-26"
sidebar_position: 10
---

Now that you have Redshift up and running, you need to create the Snowplow database (if you didn't do this as part of the process of firing up your Redshift cluster) and creating your Snowplow events table.

To create a new database on Redshift, right click on the new connection and select 'New database'. Give your database a suitable name and click OK.

The Snowplow events table definition for Redshift is available on the repo [here](https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/atomic-def.sql). Execute the queries in the file - this can be done using psql as follows:

Navigate to your snowplow github repo:

```bash
$ cd snowplow
```

Navigate to the sql file:

```bash
$ cd 4-storage/redshift-storage/sql
```

Now execute the `atomic-def.sql` file:

```bash
$ psql -h <HOSTNAME> -U {{ admin_username }} -d snowplow -p <PORT> -f atomic-def.sql
```

Where `{{ admin_username }}` is the username you created when you setup the Redshift cluster.

If you prefer using a GUI (e.g. Navicat) rather than `psql`, you can do so. These will let you either run the files directly, or you can simply copy and paste the queries in the files into your GUI of choice, and execute them from there.

If you capture unstructured events or contexts, you also need to create the corresponding tables in Redshift. For example:

```bash
$ psql -h <HOSTNAME> -U {{ admin_username }} -d snowplow -p <PORT> -f com.snowplowanalytics.snowplow/mobile_context_1.sql
$ psql -h <HOSTNAME> -U {{ admin_username }} -d snowplow -p <PORT> -f com.snowplowanalytics.snowplow/link_click_1.sql
$ psql -h <HOSTNAME> -U {{ admin_username }} -d snowplow -p <PORT> -f org.w3/performance_timing_1.sql
```
